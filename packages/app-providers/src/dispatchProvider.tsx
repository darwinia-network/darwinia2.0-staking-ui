import { DispatchCtx } from "@darwinia/app-types";
import { createContext, PropsWithChildren, useCallback, useContext } from "react";
import { clientBuilder } from "darwinia-js-sdk";
import { Web3Provider } from "@ethersproject/providers";
import { HexString } from "@polkadot/util/types";

const initialState: DispatchCtx = {
  setCollatorSessionKey: (sessionKey: string, provider: Web3Provider | undefined) => {
    //do nothing
    return Promise.resolve(true);
  },
};

const DispatchContext = createContext(initialState);

export const DispatchProvider = ({ children }: PropsWithChildren) => {
  const setCollatorSessionKey = useCallback(
    async (sessionKey: string, provider: Web3Provider | undefined): Promise<boolean> => {
      try {
        if (!provider) {
          return Promise.resolve(false);
        }
        console.log("clientBuilder", clientBuilder);
        console.log("clientBuilder.buildPangolin2Client", clientBuilder.buildPangolin2Client);
        const client = clientBuilder.buildPangolin2Client(provider);
        /* We appended 00 to the session key to represent that we don't need any proof. Originally the setKeys method
         * required two params which are session key and proof but here we append both values into one param */
        const sessionKeyWithProof = `${sessionKey}00`;
        const res = await client.calls.session.setKeysD(provider.getSigner(), sessionKeyWithProof as HexString);
        console.log("sessionKeyRes=======", res);
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
        setCollatorSessionKey,
      }}
    >
      {children}
    </DispatchContext.Provider>
  );
};

export const useDispatch = () => useContext(DispatchContext);
