import { ChainConfig } from "@darwinia/app-types";
import stakingABI from "../abi/testNet/stake.json";
import depositABI from "../abi/testNet/deposit.json";
// import myTest from "../abi/testNet/myTest.json";

export const testNet: ChainConfig = {
  name: "Pangolin",
  displayName: "TestNet",
  explorerURL: ["https://pangolin.subscan.io/"],
  // rpcURL: ["ws://g1.dev.darwinia.network:20000"],
  rpcURL: ["https://pangolin-rpc.darwinia.network/"],
  kton: {
    address: "0x0000000000000000000000000000000000000402",
    symbol: "PKTON",
    decimals: 18,
  },
  ring: {
    name: "PRING",
    symbol: "PRING",
    decimals: 18,
  },
  contractAddresses: {
    staking: "0x0000000000000000000000000000000000000601",
    deposit: "0x0000000000000000000000000000000000000600",
  },
  contractInterface: {
    staking: stakingABI,
    deposit: depositABI,
  },
  chainId: 43,
};
