import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";
import { dAppSupportedWallets, pangolin } from "@darwinia/app-config";
import { ChainConfig, WalletCtx, WalletError, SupportedWallet, WalletConfig } from "@darwinia/app-types";
import { Contract, ethers } from "ethers";
import { Web3Provider, JsonRpcSigner } from "@ethersproject/providers";

/*This is just a blueprint, no value will be stored in here*/
const initialState: WalletCtx = {
  provider: undefined,
  signer: undefined,
  isConnecting: false,
  isWalletConnected: false,
  error: undefined,
  selectedAccount: undefined,
  contract: undefined,
  connectWallet: () => {
    //do nothing
  },
  addKTONtoWallet: () => {
    //do nothing
  },
};

const WalletContext = createContext<WalletCtx>(initialState);

export const WalletProvider = ({ children }: PropsWithChildren) => {
  const [provider, setProvider] = useState<Web3Provider>();
  const [signer, setSigner] = useState<JsonRpcSigner>();
  const [contract, setContract] = useState<Contract>();
  const [isConnecting, setConnecting] = useState<boolean>(false);
  const [isWalletConnected, setWalletConnected] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string>();
  const [error, setError] = useState<WalletError | undefined>(undefined);
  // selectedNetwork and selectedWallet maybe dynamic in the future
  const [selectedNetwork] = useState<ChainConfig>(pangolin);
  const [selectedWallet] = useState<SupportedWallet>("MetaMask");
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

  /* Listen to metamask account changes */
  useEffect(() => {
    if (!isWalletInstalled() || !isWalletConnected) {
      return;
    }

    const onAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setSelectedAccount(accounts[0]);
      }
      console.log("account changed=====", accounts);
    };

    const onChainChanged = () => {
      /*Metamask recommends reloading the whole page ref: https://docs.metamask.io/guide/ethereum-provider.html#events */
      window.location.reload();
    };

    window.ethereum?.on<string[]>("accountsChanged", onAccountsChanged);
    window.ethereum?.on("chainChanged", onChainChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", onAccountsChanged);
      window.ethereum?.removeListener("chainChanged", onChainChanged);
    };
  }, [isWalletConnected]);

  const addKTONtoWallet = useCallback(async () => {
    try {
      if (!isWalletInstalled() || !selectedNetwork) {
        return;
      }

      const ktonConfig = selectedNetwork.kton;

      const isSuccessful = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: ktonConfig.address,
            symbol: ktonConfig.symbol,
            decimals: ktonConfig.decimals,
            image: ktonConfig.logo,
          },
        },
      });

      if (!isSuccessful) {
        console.log("Something went wrong 💣");
        return;
      }

      console.log("Token added successfully 🎉");
    } catch (e) {
      //ignore
      console.log(e);
    }
  }, [selectedNetwork]);

  /*Connect to MetaMask*/
  const connectWallet = useCallback(async () => {
    try {
      if (!isWalletInstalled()) {
        setError({
          code: 0,
          message: "Wallet is not installed",
        });
        setWalletConnected(false);
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
            setWalletConnected(true);
          }
        } catch (e) {
          setConnecting(false);
          setWalletConnected(false);
          setError({
            code: 4,
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
                setWalletConnected(true);
              }
            } catch (e) {
              setConnecting(false);
              setError({
                code: 3,
                message: "Account access permission rejected",
              });
              setWalletConnected(false);
            }
          }
        } catch (e) {
          setError({
            code: 1,
            message: "User rejected adding ethereum chain",
          });
          setConnecting(false);
          setWalletConnected(false);
        }
        return;
      }
      setConnecting(false);
      setWalletConnected(false);
      setError({
        code: 4,
        message: "Something else happened",
      });
    }
  }, [isWalletInstalled, selectedNetwork]);

  /*This will be fired once the connection to the wallet is successful*/
  useEffect(() => {
    if (!isWalletConnected || !selectedAccount) {
      return;
    }
    //refresh the page with the newly selected account
    const newProvider = new ethers.providers.Web3Provider(window.ethereum);
    const newSigner = newProvider.getSigner();
    const newContract = new ethers.Contract(selectedNetwork.contractAddress, selectedNetwork.contractInterface, signer);
    setProvider(newProvider);
    setSigner(newSigner);
    setContract(newContract);
  }, [selectedAccount, isWalletConnected]);

  return (
    <WalletContext.Provider
      value={{
        provider,
        isWalletConnected,
        contract,
        signer,
        selectedAccount,
        isConnecting,
        connectWallet,
        addKTONtoWallet,
        error,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
