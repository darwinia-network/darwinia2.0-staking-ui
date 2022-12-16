import { ChainConfig } from "@darwinia/app-types";
import stakingABI from "../abi/testNet/stake.json";
import depositABI from "../abi/testNet/deposit.json";

export const darwinia: ChainConfig = {
  name: "Darwinia",
  displayName: "Darwinia",
  explorerURL: ["https://pangolin.subscan.io/"],
  rpcURL: ["https://pangolin-rpc.darwinia.network/"],
  kton: {
    address: "0x0000000000000000000000000000000000000402",
    symbol: "KTON",
    decimals: 18,
  },
  ring: {
    name: "RING",
    symbol: "RING",
    decimals: 18,
  },
  contractAddresses: {
    staking: "0xcA927Df15afb7629b79dA4713a871190315c7409",
    deposit: "0xcA927Df15afb7629b79dA4713a871190315c7409",
  },
  contractInterface: {
    staking: stakingABI,
    deposit: depositABI,
  },
  chainId: 46,
};
