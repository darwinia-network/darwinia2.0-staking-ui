import { DispatchCtx } from "@darwinia/app-types";
import { createContext, PropsWithChildren, useCallback, useContext } from "react";
import {
  buildMetadata,
  dispatch,
  setSessionKeys as updateSessionKey,
  pangolinMetaStatic,
  pangolin2MetaStatic,
} from "darwinia-js-sdk";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { HexString } from "@polkadot/util/types";

const initialState: DispatchCtx = {
  setSessionKey: (sessionKey: string, signer: JsonRpcSigner | undefined, provider: Web3Provider | undefined) => {
    //do nothing
    return Promise.resolve(true);
  },
};

const DispatchContext = createContext(initialState);

export const DispatchProvider = ({ children }: PropsWithChildren) => {
  const setSessionKey = useCallback(
    async (
      sessionKey: string,
      signer: JsonRpcSigner | undefined,
      provider: Web3Provider | undefined
    ): Promise<boolean> => {
      try {
        if (!signer || !provider) {
          return Promise.resolve(false);
        }
        const metadata = buildMetadata(pangolin2MetaStatic);
        const networkDispatch = dispatch(provider, metadata);
        const res = await updateSessionKey(networkDispatch, signer, sessionKey as HexString);
        console.log(res);
        return Promise.resolve(true);
      } catch (e) {
        console.log(e);
        console.log("AN error caught=======");
        return Promise.resolve(false);
      }
    },
    []
  );

  return (
    <DispatchContext.Provider
      value={{
        setSessionKey,
      }}
    >
      {children}
    </DispatchContext.Provider>
  );
};

export const useDispatch = () => useContext(DispatchContext);
