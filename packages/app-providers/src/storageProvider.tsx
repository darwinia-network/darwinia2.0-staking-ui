import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  StorageCtx,
  Asset,
  DarwiniaStakingLedger,
  DarwiniaStakingLedgerEncoded,
  DepositChain,
  DepositEncoded,
} from "@darwinia/app-types";
import BigNumber from "bignumber.js";
import { useWallet } from "./walletProvider";
import { WsProvider, ApiPromise } from "@polkadot/api";
import { FrameSystemAccountInfo } from "@darwinia/api-derive/accounts/types";
import { Option, Vec } from "@polkadot/types";
import { convertAssetToPower, formatToEther } from "@darwinia/app-utils";
import { combineLatest, Subscription } from "rxjs";

const initialState: StorageCtx = {
  power: undefined,
  asset: undefined,
  refresh: () => {
    //ignore
  },
};

type UnSubscription = () => void;
interface Pool {
  ring: BigNumber;
  kton: BigNumber;
}

interface ActiveAsset {
  ring: BigNumber;
  kton: BigNumber;
}

const StorageContext = createContext(initialState);

export const StorageProvider = ({ children }: PropsWithChildren) => {
  const [power, setPower] = useState<BigNumber>(BigNumber(0));
  const { selectedNetwork, selectedAccount } = useWallet();
  const [apiPromise, setApiPromise] = useState<ApiPromise>();
  const [pool, setPool] = useState<Pool>({ ring: BigNumber(0), kton: BigNumber(0) });
  /*This is the total amount of RING and KTON that the user has invested in staking, it will be used in calculating
   * the total power that he has*/
  const [activeAsset, setActiveAsset] = useState<ActiveAsset>({ ring: BigNumber(0), kton: BigNumber(0) });
  const [asset, setAsset] = useState<Asset>();
  const [deposits, setDeposits] = useState<DepositChain[]>([]);

  const initNetworkStorage = async (rpcURL: string) => {
    try {
      const provider = new WsProvider(rpcURL);
      const api = new ApiPromise({
        provider,
      });

      api.on("connected", async () => {
        const readyAPI = await api.isReady;
        setApiPromise(readyAPI);
      });
      api.on("disconnected", () => {
        // console.log("disconnected");
      });
      api.on("error", () => {
        // console.log("error");
      });
    } catch (e) {
      //ignore
    }
  };

  /*calculate power*/
  useEffect(() => {
    const power = convertAssetToPower(activeAsset.ring, activeAsset.kton, pool.ring, pool.kton);
    setPower(power);
  }, [pool, activeAsset]);

  /*Get staking ledger. The data that comes back from the server needs a lot of decoding */
  useEffect(() => {
    let subscription: Subscription | undefined;
    const getStakingLedger = async () => {
      if (!selectedAccount || !apiPromise) {
        return;
      }
      const ledger = apiPromise?.query.staking.ledgers(selectedAccount);
      const userDeposits = apiPromise?.query.deposit.deposits(selectedAccount);
      if (!ledger || !userDeposits) {
        return;
      }
      subscription = combineLatest([ledger, userDeposits]).subscribe(([ledgers, deposits]) => {
        const depositsList: DepositChain[] = [];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const depositsOption = deposits as unknown as Option<Vec<DepositEncoded>>;
        if (depositsOption.isSome) {
          const unwrappedDeposits = depositsOption.unwrap();
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const depositsData = unwrappedDeposits.toHuman() as DepositChain[];
          /*depositsData here is not a real DepositChain[], it's just a casting hack */
          depositsData.forEach((item) => {
            depositsList.push({
              id: Number(item.id.toString().replaceAll(",", "")),
              expiredTime: Number(item.expiredTime.toString().replaceAll(",", "")),
              inUse: item.inUse,
              value: BigNumber(item.value.toString().replaceAll(",", "")),
            });
          });
        }
        setDeposits(depositsList);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const ledgerOption = ledgers as unknown as Option<DarwiniaStakingLedgerEncoded>;
        if (ledgerOption.isSome) {
          const unwrappedLedger = ledgerOption.unwrap();
          /*ledgerData here is not a real DarwiniaStakingLedger, it's just a casting hack */
          const ledgerData = unwrappedLedger.toHuman() as unknown as DarwiniaStakingLedger;

          /*These are the IDs of the deposits that have been used in staking*/
          const depositsIds: number[] = [];
          unwrappedLedger.stakedDeposits?.forEach((item) => {
            depositsIds.push(Number(item.toString()));
          });

          ledgerData.stakedRing = BigNumber(ledgerData.stakedRing.toString().replaceAll(",", ""));
          ledgerData.stakedKton = BigNumber(ledgerData.stakedKton.toString().replaceAll(",", ""));
          ledgerData.stakedDeposits = [...depositsIds];
          ledgerData.unstakingDeposits =
            ledgerData.unstakingDeposits?.map((item) => {
              return [Number(item[0].toString().replaceAll(",", "")), Number(item[1].toString().replaceAll(",", ""))];
            }) ?? [];
          ledgerData.unstakingRing =
            ledgerData.unstakingRing?.map((item) => {
              return [Number(item[0].toString().replaceAll(",", "")), Number(item[1].toString().replaceAll(",", ""))];
            }) ?? [];
          ledgerData.unstakingKton =
            ledgerData.unstakingKton?.map((item) => {
              return [Number(item[0].toString().replaceAll(",", "")), Number(item[1].toString().replaceAll(",", ""))];
            }) ?? [];

          // find deposits that have been used in staking by their IDs
          const stakedDepositsList = depositsList.filter((deposit) => depositsIds.includes(deposit.id));
          const totalStakedRing = stakedDepositsList.reduce((acc, deposit) => acc.plus(deposit.value), BigNumber(0));
          setAsset({
            ring: {
              bonded: BigNumber(formatToEther(ledgerData.stakedRing.toString())),
              totalStakingDeposit: BigNumber(formatToEther(totalStakedRing.toString())),
            },
            kton: {
              bonded: BigNumber(formatToEther(ledgerData.stakedKton.toString())),
            },
          });

          /*
        /!*NEW API
         * stakedRing ==== bonded
         * stakedDeposits ==== In deposit (u8) ---> Array [depositId]
         *
         * *!/
        const activeRing = unwrappedLedger.active;
        const activeKton = unwrappedLedger.activeKton;
        const lockedRing = unwrappedLedger.activeDepositRing;
        const bondedRing = activeRing.toBn().sub(lockedRing.toBn());
        const bondedKton = activeKton;
        // activeRing = lockedRing + bondedRing;
        setAsset({
          ring: {
            locked: BigNumber(formatToEther(unwrappedLedger.activeDepositRing.toString())),
            bonded: BigNumber(formatToEther(bondedRing.toString())),
          },
          kton: {
            bonded: BigNumber(formatToEther(bondedKton.toString())),
          },
        });

        setActiveAsset({
          ring: BigNumber(activeRing.toString()),
          kton: BigNumber(activeKton.toString()),
        });*/
        }
      });
    };
    getStakingLedger().catch((e) => {
      // console.log(e);
      //ignore
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [apiPromise, selectedAccount]);

  // fetch data from kton and ring pool
  useEffect(() => {
    const getPool = async () => {
      const kton = (await apiPromise?.query.staking.ktonPool()) ?? 0;
      const ring = (await apiPromise?.query.staking.ringPool()) ?? 0;
      setPool({
        kton: BigNumber(kton.toString()),
        ring: BigNumber(ring.toString()),
      });
    };

    getPool().catch(() => {
      //ignore
    });
  }, [apiPromise]);

  /*Monitor account balance*/
  useEffect(() => {
    let unsubscription: UnSubscription | undefined;
    const getBalance = async () => {
      if (!selectedAccount || !apiPromise) {
        return;
      }
      try {
        const res = await apiPromise?.query.system.account(selectedAccount, (accountInfo: FrameSystemAccountInfo) => {
          console.log("Account Balance Info======", accountInfo.data.free);
        });
        unsubscription = res as unknown as UnSubscription;
      } catch (e) {
        // ignore
      }
    };

    getBalance().catch(() => {
      //do nothing
    });

    return () => {
      if (unsubscription) {
        unsubscription();
      }
    };
  }, [apiPromise, selectedAccount]);

  useEffect(() => {
    if (!selectedNetwork) {
      return;
    }
    initNetworkStorage(selectedNetwork.substrate.wssURL);
  }, [selectedNetwork]);

  const refresh = useCallback(() => {
    // console.log("refresh storage====");
  }, []);

  return (
    <StorageContext.Provider
      value={{
        power,
        refresh,
        asset,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
};

export const useStorage = () => useContext(StorageContext);
