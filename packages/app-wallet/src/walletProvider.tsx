import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useReducer, useState } from "react";

interface WalletCtx {
  provider: string | undefined;
  signer: string | undefined;
  connectWallet: () => void;
}

/*This is just a blueprint, no value will be stored in here*/
const initialState: WalletCtx = {
  provider: undefined,
  signer: undefined,
  connectWallet: () => {
    //do nothing
  },
};

const WalletContext = createContext<WalletCtx>(initialState);

export const WalletProvider = ({ children }: PropsWithChildren) => {
  const [provider, setProvider] = useState<string>();
  const [signer, setSigner] = useState();

  const connectWallet = useCallback(() => {
    console.log("connect wallet");
  }, []);

  useEffect(() => {
    setProvider("mabadiliko");
  }, []);

  return <WalletContext.Provider value={{ provider, signer, connectWallet }}>{children}</WalletContext.Provider>;
};

export const useWallet = () => useContext(WalletContext);
