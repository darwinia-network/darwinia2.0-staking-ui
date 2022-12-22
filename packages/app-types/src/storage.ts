import BigNumber from "bignumber.js";

export interface StakingAsset {
  bonded: BigNumber;
  totalStakingDeposit?: BigNumber;
}

export interface Asset {
  ring: StakingAsset;
  kton: StakingAsset;
}

export interface StorageCtx {
  power: BigNumber | undefined;
  asset: Asset | undefined;
  refresh: () => void;
}
