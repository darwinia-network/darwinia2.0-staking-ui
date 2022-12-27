import { useEffect, useRef, useState } from "react";

import {
  AssetDistribution,
  DarwiniaStakingLedger,
  DarwiniaStakingLedgerEncoded,
  Deposit,
  DepositEncoded,
  StakingAsset,
} from "@darwinia/app-types";
import { Option, Vec } from "@polkadot/types";
import BigNumber from "bignumber.js";
import { ApiPromise } from "@polkadot/api";
import { UnSubscription } from "../storageProvider";
import useBlock from "./useBlock";

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
  const [assetDistribution, setAssetDistribution] = useState<AssetDistribution>();
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

        const depositsList: Deposit[] = [];

        if (depositsOption.isSome) {
          const unstakingDeposits: { depositId: number; expireBlock: number }[] = [];
          if (ledgerOption.isSome) {
            const ledgerData = ledgerOption.unwrap().toHuman() as unknown as DarwiniaStakingLedger;
            ledgerData.unstakingDeposits?.forEach((item) => {
              unstakingDeposits.push({
                depositId: Number(item[0]),
                expireBlock: Number(item[1]),
              });
            });
          }
          // console.log("unstakingDeposits====", unstakingDeposits, currentBlock);
          const unwrappedDeposits = depositsOption.unwrap();
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const depositsData = unwrappedDeposits.toHuman() as Deposit[];
          /*depositsData here is not a real Deposit[], it's just a casting hack */
          depositsData.forEach((item, index) => {
            const expiredTime = Number(item.expiredTime.toString().replaceAll(",", ""));
            const isEarlyWithdrawn = false;
            const isRegularWithdrawn = false;
            // canWithdraw (canClaim) = item.expiredTime <= now
            const hasExpireTimeReached = currentBlock.timestamp >= expiredTime;
            const canEarlyWithdraw = !isEarlyWithdrawn && !hasExpireTimeReached;
            const canRegularWithdraw = !isRegularWithdrawn && hasExpireTimeReached;

            // console.log("hasExpireTimeReached=====🚂", hasExpireTimeReached);
            // TODO remove all the fake data below
            const tempStartTime = 1670601600000; //Dec 10th 2022
            depositsList.push({
              id: Number(item.id.toString().replaceAll(",", "")),
              startTime: tempStartTime,
              accountId: selectedAccount,
              reward: BigNumber("5002087651239764369"),
              expiredTime: expiredTime,
              inUse: item.inUse,
              value: BigNumber(item.value.toString().replaceAll(",", "")),
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
          const totalStakingDeposit = stakedDepositsList.reduce(
            (acc, deposit) => acc.plus(deposit.value),
            BigNumber(0)
          );
          setAssetDistribution({
            ring: {
              bonded: BigNumber(ledgerData.stakedRing.toString()),
              totalStakingDeposit: BigNumber(totalStakingDeposit.toString()),
            },
            kton: {
              bonded: BigNumber(ledgerData.stakedKton.toString()),
            },
          });

          const totalRingInStaking = ledgerData.stakedRing.plus(totalStakingDeposit);
          const totalKtonInStaking = ledgerData.stakedKton;
          setStakingAsset({
            ring: BigNumber(totalRingInStaking.toString()),
            kton: BigNumber(totalKtonInStaking.toString()),
          });

          setStakedDepositsIds(stakedDepositsIdsList);
          setLoadingLedger(false);
        }
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
    assetDistribution,
  };
};

export default useLedger;