import BigNumber from "bignumber.js";

export interface StakingAsset {
  locked?: BigNumber;
  bonded: BigNumber;
}

export interface Asset {
  ring: StakingAsset;
  kton: StakingAsset;
}

export interface StorageCtx {
  power: BigNumber | undefined;
  lockedRING: BigNumber | undefined;
  lockedKTON: BigNumber | undefined;
  asset: Asset | undefined;
  refresh: () => void;
}
