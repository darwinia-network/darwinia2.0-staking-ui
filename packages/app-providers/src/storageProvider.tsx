import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";
import { StakingAsset, StorageCtx } from "@darwinia/app-types";
import { useWallet } from "./walletProvider";
import { WsProvider, ApiPromise } from "@polkadot/api";
import { FrameSystemAccountInfo } from "@darwinia/api-derive/accounts/types";
import usePower from "./hooks/usePower";
import useLedger from "./hooks/useLedger";
import BigNumber from "bignumber.js";
import useCollators from "./hooks/useCollators";

const initialState: StorageCtx = {
  power: undefined,
  assetDistribution: undefined,
  stakedDepositsIds: undefined,
  deposits: undefined,
  isLoadingLedger: undefined,
  isLoadingPool: undefined,
  collators: undefined,
  // this whole function does nothing, it's just a blueprint
  calculatePower: (stakingAsset: StakingAsset): BigNumber => {
    return BigNumber(0);
  },
};

export type UnSubscription = () => void;

const StorageContext = createContext(initialState);

export const StorageProvider = ({ children }: PropsWithChildren) => {
  const { selectedNetwork, selectedAccount } = useWallet();
  const [apiPromise, setApiPromise] = useState<ApiPromise>();

  const { stakingAsset, isLoadingLedger, deposits, stakedDepositsIds, assetDistribution } = useLedger({
    apiPromise,
    selectedAccount,
  });
  const { isLoadingPool, power, calculatePower } = usePower({
    apiPromise,
    stakingAsset,
  });

  const { collators } = useCollators(apiPromise);

  const initStorageNetwork = async (rpcURL: string) => {
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
    initStorageNetwork(selectedNetwork.substrate.wssURL);
  }, [selectedNetwork]);

  const refresh = useCallback(() => {
    // console.log("refresh storage====");
  }, []);

  return (
    <StorageContext.Provider
      value={{
        power,
        assetDistribution,
        deposits,
        stakedDepositsIds,
        isLoadingPool,
        isLoadingLedger,
        calculatePower,
        collators,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
};

export const useStorage = () => useContext(StorageContext);
