import BigNumber from "bignumber.js";
import { Collator, Deposit, StakingAsset } from "./staking";

export interface AssetDetail {
  bonded: BigNumber;
  totalStakingDeposit?: BigNumber;
}

export interface AssetDistribution {
  ring: AssetDetail;
  kton: AssetDetail;
}

export interface StorageCtx {
  power: BigNumber | undefined;
  assetDistribution: AssetDistribution | undefined;
  calculatePower: (stakingAsset: StakingAsset) => BigNumber;
  deposits: Deposit[] | undefined;
  stakedDepositsIds: number[] | undefined;
  isLoadingLedger: boolean | undefined;
  isLoadingPool: boolean | undefined;
  collators: Collator[] | undefined;
}