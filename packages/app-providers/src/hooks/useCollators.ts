import { useCallback, useEffect, useState } from "react";
import { ApiPromise } from "@polkadot/api";
import { Collator } from "@darwinia/app-types";
import useBlock from "./useBlock";
import BigNumber from "bignumber.js";
import { StorageKey, Struct } from "@polkadot/types";
import type { AnyTuple, Codec } from "@polkadot/types/types";
import useAccountPrettyName from "./useAccountPrettyName";
import { UnSubscription } from "../storageProvider";

interface PalletIdentityIdentityInfo extends Struct {
  display: string;
}

interface PalletIdentityRegistration extends Struct {
  info: PalletIdentityIdentityInfo;
}

const useCollators = (apiPromise: ApiPromise | undefined) => {
  const [collators, setCollators] = useState<Collator[]>([]);
  const { currentBlock } = useBlock(apiPromise);
  const { getPrettyName } = useAccountPrettyName(apiPromise);

  useEffect(() => {
    let exposureUnsubscription: UnSubscription | undefined;
    let collatorsUnsubscription: UnSubscription | undefined;
    let rewardsUnsubscription: UnSubscription | undefined;
    let allCollatorUnsubscription: UnSubscription | undefined;

    const listenToCollators = async () => {
      if (!apiPromise) {
        return;
      }

      /*allCollatorsStakedPowersMap contains all the collators with their total powers*/
      const allCollatorsStakedPowersMap = new Map<string, BigNumber>();
      const allCollatorsNominatorsMap = new Map<string, string[]>();
      /*Calculate collators' last session blocks */
      const allCollatorsLastSessionBlocksMap = new Map<string, number>();

      let activeCollatorsAddresses: string[] = [];

      const updateCollators = async () => {
        if (allCollatorUnsubscription) {
          allCollatorUnsubscription();
        }
        allCollatorUnsubscription = (await apiPromise.query.staking.collators.entries(
          async (allCollatorEntries: [StorageKey<AnyTuple>, Codec][]) => {
            const allCollators = [];
            for (let i = 0; i < allCollatorEntries.length; i++) {
              const [key, result] = allCollatorEntries[i];
              const accountAddress = key.args.map((item) => item.toHuman())[0] as unknown as string;
              const commission = `${result.toHuman()}`;
              const totalStaked = allCollatorsStakedPowersMap.get(accountAddress) ?? BigNumber(0);
              const blocksLastSession = allCollatorsLastSessionBlocksMap.get(accountAddress) ?? 0;
              const nominators = allCollatorsNominatorsMap.get(accountAddress) ?? [];

              const prettyName = await getPrettyName(accountAddress);

              const collator: Collator = {
                id: accountAddress,
                accountAddress: accountAddress,
                isActive: activeCollatorsAddresses.includes(accountAddress),
                lastSessionBlocks: blocksLastSession,
                commission: commission,
                totalStaked: totalStaked,
                accountName: prettyName,
                nominators: nominators,
              };
              allCollators.push(collator);
            }

            setCollators(allCollators);
          }
        )) as unknown as UnSubscription;
      };

      exposureUnsubscription = (await apiPromise.query.staking.exposures.entries(
        (exposureEntries: [StorageKey<AnyTuple>, Codec][]) => {
          allCollatorsNominatorsMap.clear();
          /*Get all the collators and the total powers staked to them */
          exposureEntries.forEach(([key, result]) => {
            const accountAddress = key.args.map((item) => item.toHuman())[0] as unknown as string;
            const exposureObj = result.toHuman() as unknown as {
              total: string;
              nominators?: { who: string; value: string }[];
            };
            exposureObj.nominators?.forEach((nominator) => {
              const oldNominators = allCollatorsNominatorsMap.get(accountAddress) ?? [];
              allCollatorsNominatorsMap.set(accountAddress, [...oldNominators, nominator.who]);
            });
            allCollatorsStakedPowersMap.set(
              accountAddress,
              BigNumber(exposureObj.total.toString().replaceAll(",", ""))
            );
          });
          updateCollators();
        }
      )) as unknown as UnSubscription;

      collatorsUnsubscription = (await apiPromise.query.session.validators((activeCollatorsAddressesEncoded: Codec) => {
        /*These are the collators that are active in this session */
        activeCollatorsAddresses = activeCollatorsAddressesEncoded.toHuman() as unknown as string[];
        updateCollators();
      })) as unknown as UnSubscription;

      rewardsUnsubscription = (await apiPromise.query.staking.rewardPoints((rewardPointsEncoded: Codec) => {
        const rewardPoints = rewardPointsEncoded.toHuman() as unknown as [string, { [key: string]: string }];
        if (rewardPoints.length >= 2) {
          const collatorsPoints = rewardPoints[1];
          Object.keys(collatorsPoints).forEach((key) => {
            const singleCollatorPoints = Number(collatorsPoints[key].toString().replaceAll(",", ""));
            /*This staticNumber = 20 was given by the backend */
            const staticNumber = 20;
            const blocksNumber = singleCollatorPoints / staticNumber;
            allCollatorsLastSessionBlocksMap.set(key, blocksNumber);
          });
          updateCollators();
        }
      })) as unknown as UnSubscription;
    };

    listenToCollators().catch((e) => {
      // console.log(e);
      //ignore
    });
    return () => {
      if (exposureUnsubscription) {
        exposureUnsubscription();
      }
      if (collatorsUnsubscription) {
        collatorsUnsubscription();
      }
      if (rewardsUnsubscription) {
        rewardsUnsubscription();
      }
      if (allCollatorUnsubscription) {
        allCollatorUnsubscription();
      }
    };
  }, [apiPromise, currentBlock?.number]);

  return {
    collators,
  };
};

export default useCollators;
