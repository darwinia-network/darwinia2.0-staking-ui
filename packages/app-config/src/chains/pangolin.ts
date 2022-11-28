import { ChainConfig } from "@darwinia/app-types";
import contractABI from "../abi/contract.json";

export const Pangolin: ChainConfig = {
  name: "Pangolin",
  displayName: "Pangolin",
  explorerURL: "https://pangolin.subscan.io/",
  kton: {
    symbol: "KTON",
    decimals: 18,
  },
  ring: {
    symbol: "PRING",
    decimals: 18,
  },
  contractAddress: "0xcA927Df15afb7629b79dA4713a871190315c7409",
  contractInterface: contractABI,
  chainId: 43,
};
