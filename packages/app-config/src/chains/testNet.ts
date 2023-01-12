import { ChainConfig } from "@darwinia/app-types";
import stakingABI from "../abi/testNet/stake.json";
import depositABI from "../abi/testNet/deposit.json";
// import myTest from "../abi/testNet/myTest.json";

export const testNet: ChainConfig = {
  name: "Pangolin",
  displayName: "TestNet",
  explorerURLs: ["https://pangolin.subscan.io/"],
  httpsURLs: ["https://cors.kahub.in/http://g1.dev.darwinia.network:10000"],
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
  substrate: {
    graphQlURL: "https://api.subquery.network/sq/isunaslabs/pangolin2",
    wssURL: "ws://g1.dev.darwinia.network:20000",
    httpsURL: "https://pangolin-rpc.darwinia.network",
  },
  secondsPerBlock: 12,
};
