export interface Deposit {
  id: string;
  amount: string;
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
