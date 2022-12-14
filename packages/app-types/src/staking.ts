import BigNumber from "bignumber.js";

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
  amount: BigNumber;
  time: string;
  symbol: string;
}
