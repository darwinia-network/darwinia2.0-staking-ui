import { createContext, ErrorInfo, PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";
import { dAppSupportedWallets, pangolin } from "@darwinia/app-config";
import { ChainConfig, WalletCtx, WalletError, SupportedWallet, WalletConfig } from "@darwinia/app-types";
import { ethers } from "ethers";

/*This is just a blueprint, no value will be stored in here*/
const initialState: WalletCtx = {
  provider: undefined,
  signer: undefined,
  isConnecting: false,
  error: undefined,
  connectWallet: () => {
    //do nothing
  },
};

const WalletContext = createContext<WalletCtx>(initialState);

export const WalletProvider = ({ children }: PropsWithChildren) => {
  const [provider, setProvider] = useState<string>();
  const [signer, setSigner] = useState();
  const [isConnecting, setConnecting] = useState<boolean>(false);
  const [selectedAccount, setSelectedAccount] = useState<string>();
  const [error, setError] = useState<WalletError | undefined>(undefined);
  const [selectedNetwork, setSelectedNetwork] = useState<ChainConfig>(pangolin);
  const [selectedWallet, setSelectedWallet] = useState<SupportedWallet>("MetaMask");
  const [walletConfig, setWalletConfig] = useState<WalletConfig>();

  const isWalletInstalled = () => {
    return !!window.ethereum;
  };

  useEffect(() => {
    const walletConfig = dAppSupportedWallets.find((walletConfig) => walletConfig.name === selectedWallet);
    if (walletConfig) {
      setWalletConfig(walletConfig);
    }
  }, [selectedWallet]);

  useEffect(() => {
    if (!isWalletInstalled()) {
      return;
    }

    const onAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setSelectedAccount(accounts[0]);
      }
      console.log("account changed=====", accounts);
    };

    window.ethereum?.on<string[]>("accountsChanged", onAccountsChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", onAccountsChanged);
    };
  }, []);

  /*Connect to MetaMask*/
  const connectWallet = useCallback(async () => {
    try {
      if (!isWalletInstalled()) {
        setError({
          code: 0,
          message: "Wallet is not installed",
        });
        return;
      }

      if (!walletConfig) {
        return;
      }

      setConnecting(true);
      //try switching the token to the selected network token
      const chainResponse = await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ethers.utils.hexlify(selectedNetwork.chainId) }],
      });
      if (!chainResponse) {
        //The chain was switched successfully, request account permission
        // request account permission
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          if (accounts && Array.isArray(accounts) && accounts.length > 0) {
            setSelectedAccount(accounts[0]);
            setConnecting(false);
          }
        } catch (e) {
          setConnecting(false);
          setError({
            code: 3,
            message: "Account access permission rejected",
          });
        }
      }
    } catch (e) {
      if ((e as { code: number }).code === 4902) {
        /*Unrecognized chain, add it first*/
        try {
          const addedChainResponse = await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: ethers.utils.hexlify(selectedNetwork.chainId),
                chainName: selectedNetwork.name,
                nativeCurrency: {
                  ...selectedNetwork.ring,
                },
                rpcUrls: [...selectedNetwork.rpcURL],
                blockExplorerUrls: [...selectedNetwork.explorerURL],
              },
            ],
          });
          if (!addedChainResponse) {
            // request account permission
            try {
              const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
              });
              if (accounts && Array.isArray(accounts) && accounts.length > 0) {
                setSelectedAccount(accounts[0]);
                setConnecting(false);
              }
            } catch (e) {
              setConnecting(false);
              setError({
                code: 3,
                message: "Account access permission rejected",
              });
            }
          }
        } catch (e) {
          setError({
            code: 1,
            message: "User rejected adding ethereum chain",
          });
          setConnecting(false);
        }
        return;
      }
      setConnecting(false);
      setError({
        code: 4,
        message: "Something else happened",
      });
    }
  }, [isWalletInstalled, walletConfig, selectedNetwork]);

  useEffect(() => {
    setProvider("mabadiliko");
  }, []);

  return (
    <WalletContext.Provider value={{ provider, signer, isConnecting, connectWallet, error }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
