import { u128, Struct } from "@polkadot/types";
import type { AccountId, BlockNumber } from "@polkadot/types/interfaces/runtime";
import BigNumber from "bignumber.js";

export interface Collator {
  id: string;
  accountAddress: string;
  accountName?: string;
  totalStaked: string;
  commission: number;
  lastSessionBlocks: number;
  isActive: boolean;
}

export interface Reward {
  id: string;
  amount: string;
  blockNumber: number;
  blockTime: string;
}

export interface RewardedNode {
  nodes: Reward[];
}

export interface StakingStash {
  id: string; //accountId
  totalRewarded: string; //RING/PRING,etc amount in string
  rewardeds: RewardedNode;
}

export interface StakingAsset {
  ring: BigNumber;
  kton: BigNumber;
}

/*Staking types start here*/
export interface DarwiniaStakingLedgerEncoded extends Struct {
  stakedRing: u128;
  stakedKton: u128;
  stakedDeposits?: Uint8Array;
}

export interface DarwiniaStakingLedger {
  stakedRing: BigNumber;
  stakedKton: BigNumber;
  stakedDeposits?: number[];
  unstakingDeposits?: [number, number][];
  unstakingRing?: [number, number][];
  unstakingKton?: [number, number][];
}

export interface DepositEncoded extends Struct {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  id: u128;
  value: u128;
  expiredTime: u128;
}

export interface Deposit {
  id: number;
  accountId: string;
  value: BigNumber;
  reward: BigNumber;
  startTime: number;
  expiredTime: number;
  inUse: boolean;
  canRegularWithdraw: boolean;
  isRegularWithdrawn: boolean;
  canEarlyWithdraw: boolean;
  isEarlyWithdrawn: boolean;
}
/*Staking types end here*/
