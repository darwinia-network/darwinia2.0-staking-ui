import BigNumber from "bignumber.js";
import { Deposit } from "./staking";

export interface StakingAsset {
  bonded: BigNumber;
  totalStakingDeposit?: BigNumber;
}

export interface AssetDistribution {
  ring: StakingAsset;
  kton: StakingAsset;
}

export interface StorageCtx {
  power: BigNumber | undefined;
  assetDistribution: AssetDistribution | undefined;
  refresh: () => void;
  deposits: Deposit[] | undefined;
  stakedDepositsIds: number[] | undefined;
  isLoadingLedger: boolean | undefined;
  isLoadingPool: boolean | undefined;
}
