import { ContractInterface } from "ethers";

export type SupportedWallet = "MetaMask";
export type SupportedBrowser = "Chrome" | "Firefox" | "Brave" | "Edge" | "Opera";
export type ChainName = "Crab" | "Pangolin" | "Darwinia" | "Pangoro";

export interface Token {
  name: string;
  symbol: string;
  decimals: number;
}

export interface ChainConfig {
  name: ChainName;
  displayName: string;
  chainId: number;
  ring: Token;
  kton: Token;
  explorerURL: [string];
  rpcURL: [string];
  contractInterface: ContractInterface;
  contractAddress: string;
}

export interface WalletExtension {
  browser: SupportedBrowser;
  downloadURL: string;
}

export interface WalletConfig {
  name: SupportedWallet;
  logo: string;
  extensions: WalletExtension[];
}

export interface WalletError {
  code: number;
  message: string;
}

export interface WalletCtx {
  provider: string | undefined;
  signer: string | undefined;
  isConnecting: boolean;
  connectWallet: () => void;
  error: WalletError | undefined;
}
