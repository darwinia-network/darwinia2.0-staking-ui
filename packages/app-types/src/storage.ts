import BigNumber from "bignumber.js";
import { Deposit } from "./staking";

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
  deposits: Deposit[] | undefined;
  stakedDepositsIds: number[] | undefined;
  isLoadingLedger: boolean | undefined;
  isLoadingPool: boolean | undefined;
}
