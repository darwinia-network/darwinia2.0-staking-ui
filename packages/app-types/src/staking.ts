import { u128, Struct } from "@polkadot/types";
import type { AccountId, BlockNumber } from "@polkadot/types/interfaces/runtime";

export interface Deposit {
  id: string;
  amount: string;
  reward?: string;
  startTime?: string;
  endTime?: string;
  isTimeOver?: boolean;
}

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

/*Staking types start here*/
export interface DarwiniaStakingLedger extends Struct {
  stakedRing: u128;
  stakedKton: u128;
  // unstakingRing: [];
}
/*Staking types end here*/
