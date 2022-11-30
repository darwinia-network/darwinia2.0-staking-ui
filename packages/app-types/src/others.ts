import { SupportedWallet } from "./wallet";

export interface Account {
  id: number;
}

export interface Storage {
  isConnectedToWallet?: boolean;
  selectedNetwork?: boolean;
  selectedWallet?: SupportedWallet;
}
