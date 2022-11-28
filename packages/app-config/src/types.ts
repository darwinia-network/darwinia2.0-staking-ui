import { ContractInterface } from "ethers";

export type SupportedWallet = "MetaMask";
export type ChainName = "Crab" | "Pangolin" | "Darwinia" | "Pangoro";

export interface Token {
  symbol: string;
  decimals: number;
}

export interface ChainConfig {
  name: ChainName;
  displayName: string;
  chainId: number;
  ring: Token;
  kton: Token;
  explorerURL: string;
  contractInterface: ContractInterface;
  contractAddress: string;
}

export interface WalletConfig {
  name: SupportedWallet;
  logo: string;
  downloadURL: string;
}
