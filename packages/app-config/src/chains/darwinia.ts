import { ChainConfig } from "@darwinia/app-types";
import contractABI from "../abi/darwiniaContract.json";

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
    address: "0xc52287b259b2431ba0f61BC7EBD0eD793B0b7044",
    symbol: "RING",
    decimals: 18,
  },
  contractAddress: "0xcA927Df15afb7629b79dA4713a871190315c7409", // This is a random address brought from fee market
  contractInterface: contractABI,
  chainId: 43,
};
