import { useEffect, useRef, useState } from "react";

import {
  AssetDistribution,
  DarwiniaStakingLedger,
  DarwiniaStakingLedgerEncoded,
  Deposit,
  DepositEncoded,
  StakingAsset,
  UnbondingDeposit,
} from "@darwinia/app-types";
import { Option, Vec } from "@polkadot/types";
import BigNumber from "bignumber.js";
import { ApiPromise } from "@polkadot/api";
import { UnSubscription } from "../storageProvider";
import useBlock from "./useBlock";
import { calculateKtonFromRingDeposit, getMonthsRange } from "@darwinia/app-utils";

interface Params {
  apiPromise: ApiPromise | undefined;
  selectedAccount: string | undefined;
}

const useLedger = ({ apiPromise, selectedAccount }: Params) => {
  /*This is the total amount of RING and KTON that the user has invested in staking, it will be used in calculating
   * the total power that he has*/
  const [stakingAsset, setStakingAsset] = useState<StakingAsset>({ ring: BigNumber(0), kton: BigNumber(0) });
  const [isLoadingLedger, setLoadingLedger] = useState<boolean>(true);
  const isInitialLoad = useRef<boolean>(true);
  /*These are all the deposits that have been made by the user*/
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  /*These are the IDs of the deposits that have been used in staking already*/
  const [stakedDepositsIds, setStakedDepositsIds] = useState<number[]>([]);
  /*staking asset distribution*/
  const [stakedAssetDistribution, setStakedAssetDistribution] = useState<AssetDistribution>();
  const [ktonBalance, setKtonBalance] = useState<BigNumber>(BigNumber(0));
  const { currentBlock } = useBlock(apiPromise);

  /*Get staking ledger and deposits. The data that comes back from the server needs a lot of decoding */
  useEffect(() => {
    let depositsUnsubscription: UnSubscription | undefined;
    let ledgerUnsubscription: UnSubscription | undefined;
    const getStakingLedgerAndDeposits = async () => {
      if (!selectedAccount || !apiPromise || !currentBlock) {
        return;
      }
      if (isInitialLoad.current) {
        isInitialLoad.current = false;
        setLoadingLedger(true);
      }

      let ledgerInfo: Option<DarwiniaStakingLedgerEncoded> | undefined;
      let depositsInfo: Option<Vec<DepositEncoded>> | undefined;

      /*This method will be called every time there are changes in the deposits or ledger, it is managed by
       * socket */
      const parseData = (
        ledgerOption: Option<DarwiniaStakingLedgerEncoded> | undefined,
        depositsOption: Option<Vec<DepositEncoded>> | undefined
      ) => {
        if (!ledgerOption || !depositsOption) {
          return;
        }

        let totalKtonRewarded = BigNumber(0);
        let totalStakedKton = BigNumber(0);

        const depositsList: Deposit[] = [];

        if (depositsOption.isSome) {
          /*These are the deposits that the user has decided to unbond from staking, they are in the
           * 14 days unbonding period  */
          const unstakingDeposits: UnbondingDeposit[] = [];
          if (ledgerOption.isSome) {
            const ledgerData = ledgerOption.unwrap().toHuman() as unknown as DarwiniaStakingLedger;
            ledgerData.unstakingDeposits?.forEach((item) => {
              const expireBlock = Number(item[1].toString().replaceAll(",", ""));
              const depositId = Number(item[0].toString().replaceAll(",", ""));
              unstakingDeposits.push({
                depositId: depositId,
                expireBlock: expireBlock,
                isUnbondingComplete: currentBlock.number >= expireBlock,
              });
            });
          }
          // console.log("unstakingDeposits====", unstakingDeposits, currentBlock);
          const unwrappedDeposits = depositsOption.unwrap();
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const depositsData = unwrappedDeposits.toHuman() as Deposit[];
          /*depositsData here is not a real Deposit[], it's just a casting hack */
          depositsData.forEach((item) => {
            const startTime = Number(item.startTime.toString().replaceAll(",", ""));
            const expiredTime = Number(item.expiredTime.toString().replaceAll(",", ""));
            // TODO isEarlyWithdrawn,isRegularWithdrawn, etc  need to be updated
            const isEarlyWithdrawn = false;
            const isRegularWithdrawn = false;
            // canWithdraw (canClaim) = item.expiredTime <= now
            const hasExpireTimeReached = currentBlock.timestamp >= expiredTime;
            const canEarlyWithdraw = !isEarlyWithdrawn && !hasExpireTimeReached;
            const canRegularWithdraw = hasExpireTimeReached;

            const ringAmount = BigNumber(item.value.toString().replaceAll(",", ""));

            const reward = calculateKtonFromRingDeposit({
              ringAmount: ringAmount,
              depositMonths: getMonthsRange(startTime, expiredTime),
              decimalPrecision: 0,
            }).replaceAll(",", "");

            totalKtonRewarded = totalKtonRewarded.plus(BigNumber(reward));

            depositsList.push({
              id: Number(item.id.toString().replaceAll(",", "")),
              startTime: startTime,
              accountId: selectedAccount,
              reward: BigNumber(reward),
              expiredTime: expiredTime,
              inUse: item.inUse,
              value: ringAmount,
              canEarlyWithdraw: canEarlyWithdraw,
              isEarlyWithdrawn: isEarlyWithdrawn,
              canRegularWithdraw: canRegularWithdraw,
              isRegularWithdrawn: isRegularWithdrawn,
            });
          });
        }

        setDeposits(depositsList);

        if (ledgerOption.isSome) {
          const unwrappedLedger = ledgerOption.unwrap();
          /*ledgerData here is not a real DarwiniaStakingLedger, it's just a casting hack */
          const ledgerData = unwrappedLedger.toHuman() as unknown as DarwiniaStakingLedger;

          /*These are the IDs of the deposits that have been used in staking*/
          const stakedDepositsIdsList: number[] = [];
          unwrappedLedger.stakedDeposits?.forEach((item) => {
            stakedDepositsIdsList.push(Number(item.toString()));
          });

          ledgerData.stakedRing = BigNumber(ledgerData.stakedRing.toString().replaceAll(",", ""));
          ledgerData.stakedKton = BigNumber(ledgerData.stakedKton.toString().replaceAll(",", ""));
          ledgerData.stakedDeposits = [...stakedDepositsIdsList];
          ledgerData.unstakingDeposits =
            ledgerData.unstakingDeposits?.map((item) => {
              return [Number(item[0].toString().replaceAll(",", "")), Number(item[1].toString().replaceAll(",", ""))];
            }) ?? [];
          ledgerData.unstakingRing =
            ledgerData.unstakingRing?.map((item) => {
              return [Number(item[0].toString().replaceAll(",", "")), Number(item[1].toString().replaceAll(",", ""))];
            }) ?? [];
          ledgerData.unstakingKton =
            ledgerData.unstakingKton?.map((item) => {
              return [Number(item[0].toString().replaceAll(",", "")), Number(item[1].toString().replaceAll(",", ""))];
            }) ?? [];

          // find deposits that have been used in staking by their IDs
          const stakedDepositsList = depositsList.filter((deposit) => stakedDepositsIdsList.includes(deposit.id));
          const totalOfDepositsInStaking = stakedDepositsList.reduce(
            (acc, deposit) => acc.plus(deposit.value),
            BigNumber(0)
          );
          setStakedAssetDistribution({
            ring: {
              bonded: BigNumber(ledgerData.stakedRing.toString()),
              totalOfDepositsInStaking: BigNumber(totalOfDepositsInStaking.toString()),
            },
            kton: {
              bonded: BigNumber(ledgerData.stakedKton.toString()),
            },
          });

          const totalRingInStaking = ledgerData.stakedRing.plus(totalOfDepositsInStaking);
          const totalKtonInStaking = ledgerData.stakedKton;
          totalStakedKton = ledgerData.stakedKton;
          setStakingAsset({
            ring: BigNumber(totalRingInStaking.toString()),
            kton: BigNumber(totalKtonInStaking.toString()),
          });

          setStakedDepositsIds(stakedDepositsIdsList);
          setLoadingLedger(false);
        }

        const usableKton = totalKtonRewarded.minus(totalStakedKton);
        setKtonBalance(usableKton);
      };

      ledgerUnsubscription = (await apiPromise.query.staking.ledgers(
        selectedAccount,
        (ledger: Option<DarwiniaStakingLedgerEncoded>) => {
          ledgerInfo = ledger;
          parseData(ledgerInfo, depositsInfo);
        }
      )) as unknown as UnSubscription;

      depositsUnsubscription = (await apiPromise.query.deposit.deposits(
        selectedAccount,
        (deposits: Option<Vec<DepositEncoded>>) => {
          depositsInfo = deposits;
          parseData(ledgerInfo, depositsInfo);
        }
      )) as unknown as UnSubscription;
    };
    getStakingLedgerAndDeposits().catch((e) => {
      setLoadingLedger(false);
      console.log(e);
      //ignore
    });

    return () => {
      if (ledgerUnsubscription) {
        ledgerUnsubscription();
      }
      if (depositsUnsubscription) {
        depositsUnsubscription();
      }
    };
  }, [apiPromise, selectedAccount, currentBlock]);

  return {
    stakingAsset,
    isLoadingLedger,
    deposits,
    stakedDepositsIds,
    stakedAssetDistribution,
    ktonBalance,
  };
};

export default useLedger;
