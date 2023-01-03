import { u128, Struct, Vec } from "@polkadot/types";
import type { AccountId, BlockNumber } from "@polkadot/types/interfaces/runtime";
import BigNumber from "bignumber.js";
import { RegistrationJudgement } from "@polkadot/types/interfaces";

export interface PalletIdentityIdentityInfo extends Struct {
  display?: string;
  displayParent?: string;
  email?: string;
  image?: string;
  legal?: string;
  other?: Record<string, string>;
  parent?: AccountId;
  pgp?: string;
  riot?: string;
  twitter?: string;
  web?: string;
}

export interface PalletIdentityRegistration extends Struct {
  judgements: Vec<RegistrationJudgement>;
  info: PalletIdentityIdentityInfo;
}

export interface Collator {
  id: string;
  accountAddress: string;
  accountName?: string;
  totalStaked: BigNumber;
  commission: string;
  lastSessionBlocks: number;
  isActive?: boolean;
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

export interface Bond {
  amount: BigNumber;
  symbol: string;
  isDeposit: boolean;
  isRing: boolean;
}

export interface Delegate {
  id: string;
  collator?: string;
  previousReward?: string;
  staked: BigNumber;
  bondedTokens: Bond[];
  isActive?: boolean;
  isMigrated?: boolean;
  isUndelegating?: boolean;
  canUndelegate?: boolean;
  canChangeCollator?: boolean;
}

/*Staking types end here*/
