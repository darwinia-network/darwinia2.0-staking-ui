import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  StorageCtx,
  Asset,
  DarwiniaStakingLedger,
  DarwiniaStakingLedgerEncoded,
  Deposit,
  DepositEncoded,
} from "@darwinia/app-types";
import BigNumber from "bignumber.js";
import { useWallet } from "./walletProvider";
import { WsProvider, ApiPromise } from "@polkadot/api";
import { FrameSystemAccountInfo } from "@darwinia/api-derive/accounts/types";
import { Option, Vec } from "@polkadot/types";
import { convertAssetToPower } from "@darwinia/app-utils";
import { combineLatest, Subscription } from "rxjs";

const initialState: StorageCtx = {
  power: undefined,
  asset: undefined,
  stakedDepositsIds: undefined,
  deposits: undefined,
  refresh: () => {
    //ignore
  },
  isLoadingLedger: undefined,
  isLoadingPool: undefined,
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
  /*These are all the deposits that have been made by the user*/
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  /*These are the IDs of the deposits that have been used in staking already*/
  const [stakedDepositsIds, setStakedDepositsIds] = useState<number[]>([]);
  const [isLoadingLedger, setLoadingLedger] = useState<boolean>(true);
  const [isLoadingPool, setLoadingPool] = useState<boolean>(true);

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
      setLoadingLedger(true);
      const ledger = apiPromise.query.staking.ledgers(selectedAccount);
      const userDeposits = apiPromise.query.deposit.deposits(selectedAccount);
      if (!ledger || !userDeposits) {
        setLoadingLedger(false);
        return;
      }
      subscription = combineLatest([ledger, userDeposits]).subscribe(([ledgers, deposits]) => {
        const depositsList: Deposit[] = [];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const depositsOption = deposits as unknown as Option<Vec<DepositEncoded>>;
        if (depositsOption.isSome) {
          const unwrappedDeposits = depositsOption.unwrap();
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const depositsData = unwrappedDeposits.toHuman() as Deposit[];
          /*depositsData here is not a real Deposit[], it's just a casting hack */
          depositsData.forEach((item, index) => {
            const tempStartTime = 1670601600000; //Dec 10th 2022
            depositsList.push({
              id: Number(item.id.toString().replaceAll(",", "")),
              startTime: tempStartTime,
              accountId: selectedAccount,
              reward: BigNumber("5002087651239764369"),
              expiredTime: Number(item.expiredTime.toString().replaceAll(",", "")),
              inUse: item.inUse,
              value: BigNumber(item.value.toString().replaceAll(",", "")),
              canEarlyWithdraw: index === 0,
              isEarlyWithdrawn: index === 1,
              canRegularWithdraw: index === 3,
              isRegularWithdrawn: index === 4,
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
          const stakedDepositsIdsList: number[] = [];
          unwrappedLedger.stakedDeposits?.forEach((item) => {
            stakedDepositsIdsList.push(Number(item.toString()));
          });

          ledgerData.stakedRing = BigNumber(ledgerData.stakedRing.toString().replaceAll(",", ""));
          ledgerData.stakedKton = BigNumber(ledgerData.stakedKton.toString().replaceAll(",", ""));
          ledgerData.stakedDeposits = [...stakedDepositsIdsList];
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
          const stakedDepositsList = depositsList.filter((deposit) => stakedDepositsIdsList.includes(deposit.id));
          const totalStakingDeposit = stakedDepositsList.reduce(
            (acc, deposit) => acc.plus(deposit.value),
            BigNumber(0)
          );
          setAsset({
            ring: {
              bonded: BigNumber(ledgerData.stakedRing.toString()),
              totalStakingDeposit: BigNumber(totalStakingDeposit.toString()),
            },
            kton: {
              bonded: BigNumber(ledgerData.stakedKton.toString()),
            },
          });

          const totalRingInStaking = ledgerData.stakedRing.plus(totalStakingDeposit);
          const totalKtonInStaking = ledgerData.stakedKton;
          setActiveAsset({
            ring: BigNumber(totalRingInStaking.toString()),
            kton: BigNumber(totalKtonInStaking.toString()),
          });

          setStakedDepositsIds(stakedDepositsIdsList);
          setLoadingLedger(false);
        }
      });
    };
    getStakingLedger().catch((e) => {
      setLoadingLedger(false);
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
    let subscription: Subscription | undefined;
    const getPool = async () => {
      if (!apiPromise) {
        return;
      }
      setLoadingPool(true);
      const ring = apiPromise.query.staking.ringPool();
      const kton = apiPromise.query.staking.ktonPool();

      subscription = combineLatest([ring, kton]).subscribe(([ringValue, ktonValue]) => {
        setPool({
          kton: BigNumber(ktonValue.toString()),
          ring: BigNumber(ringValue.toString()),
        });
        setLoadingPool(false);
      });
    };

    getPool().catch(() => {
      //ignore
      setLoadingPool(false);
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
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
        deposits,
        stakedDepositsIds,
        isLoadingPool,
        isLoadingLedger,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
};

export const useStorage = () => useContext(StorageContext);
