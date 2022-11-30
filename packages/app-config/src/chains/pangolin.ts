import { ChainConfig } from "@darwinia/app-types";
import contractABI from "../abi/contract.json";

export const pangolin: ChainConfig = {
  name: "Pangolin",
  displayName: "Pangolin",
  explorerURL: ["https://pangolin.subscan.io/"],
  rpcURL: ["https://pangolin-rpc.darwinia.network/"],
  kton: {
    name: "KTON",
    symbol: "KTON",
    decimals: 18,
  },
  ring: {
    name: "PRING",
    symbol: "PRING",
    decimals: 18,
  },
  contractAddress: "0xcA927Df15afb7629b79dA4713a871190315c7409",
  contractInterface: contractABI,
  chainId: 43,
};
