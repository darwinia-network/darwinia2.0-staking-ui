import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";
import { StorageCtx, Asset, DarwiniaStakingLedger } from "@darwinia/app-types";
import BigNumber from "bignumber.js";
import { useWallet } from "./walletProvider";
import { WsProvider, ApiPromise } from "@polkadot/api";
import { FrameSystemAccountInfo } from "@darwinia/api-derive/accounts/types";
import { Option } from "@polkadot/types";
import { DarwiniaStakingStructsStakingLedger } from "@darwinia/api-derive/darwiniaStaking/types";
import { convertAssetToPower, formatToEther } from "@darwinia/app-utils";
import { combineLatest, from, Subscription, switchMap } from "rxjs";

const initialState: StorageCtx = {
  lockedKTON: undefined,
  lockedRING: undefined,
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
  const [lockedRING, setLockedRING] = useState<BigNumber>(BigNumber(0));
  const [lockedKTON, setLockedKTON] = useState<BigNumber>(BigNumber(0));
  const [power, setPower] = useState<BigNumber>(BigNumber(0));
  const { selectedNetwork, selectedAccount } = useWallet();
  const [apiPromise, setApiPromise] = useState<ApiPromise>();
  const [pool, setPool] = useState<Pool>({ ring: BigNumber(0), kton: BigNumber(0) });
  /*This is the total amount of RING and KTON that the user has invested in staking, it will be used in calculating
   * the total power that he has*/
  const [activeAsset, setActiveAsset] = useState<ActiveAsset>({ ring: BigNumber(0), kton: BigNumber(0) });
  const [asset, setAsset] = useState<Asset>();
  const account = "0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac";

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

  /*Get staking ledger*/
  useEffect(() => {
    let subscription: Subscription | undefined;
    const getStakingLedger = async () => {
      const ledger = apiPromise?.query.staking.ledgers(account);
      if (!ledger) {
        return;
      }
      subscription = combineLatest([ledger]).subscribe(([ledgers]) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const ledgerOption = ledgers as unknown as Option<DarwiniaStakingLedger>;
        if (ledgerOption.isSome) {
          const unwrappedLedger = ledgerOption.unwrap();
          console.log(unwrappedLedger);

          setAsset({
            ring: {
              locked: BigNumber(formatToEther(unwrappedLedger.stakedRing.toString())),
              bonded: BigNumber(formatToEther(unwrappedLedger.stakedRing.toString())),
            },
            kton: {
              bonded: BigNumber(formatToEther(unwrappedLedger.stakedKton.toString())),
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
      console.log(e);
      //ignore
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [apiPromise]);

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
      try {
        const res = await apiPromise?.query.system.account(account, (accountInfo: FrameSystemAccountInfo) => {
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
  }, [apiPromise]);

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
        lockedKTON,
        lockedRING,
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
