import { useCallback, useEffect, useState } from "react";
import { ApiPromise } from "@polkadot/api";
import { Collator } from "@darwinia/app-types";
import useBlock from "./useBlock";
import BigNumber from "bignumber.js";
import { combineLatest, Subscription } from "rxjs";
import { Option, Struct } from "@polkadot/types";
import useAccountPrettyName from "./useAccountPrettyName";

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
    let subscription: Subscription | undefined;
    const listenToCollators = async () => {
      if (!apiPromise) {
        return;
      }

      subscription = combineLatest([
        apiPromise.query.staking.exposures.entries(),
        apiPromise.query.session.validators(),
        apiPromise.query.staking.rewardPoints(),
      ]).subscribe(async ([exposureEntries, activeCollatorsAddressesEncoded, rewardPointsEncoded]) => {
        /*Get all the collators and the total powers staked to them */
        /*allCollatorsStakedPowersMap contains all the collators with their total powers*/
        const allCollatorsStakedPowersMap = new Map<string, BigNumber>();
        exposureEntries.forEach(([key, result]) => {
          const accountAddress = key.args.map((item) => item.toHuman())[0] as unknown as string;
          const exposureObj = result.toHuman() as unknown as { total: string };
          allCollatorsStakedPowersMap.set(accountAddress, BigNumber(exposureObj.total.toString().replaceAll(",", "")));
        });

        /*These are the collators that are active in this session */
        const activeCollatorsAddresses = activeCollatorsAddressesEncoded.toHuman() as unknown as string[];

        /*Calculate collators' last session blocks */
        const allCollatorsLastSessionBlocksMap = new Map<string, number>();
        const rewardPoints = rewardPointsEncoded.toHuman() as unknown as [string, { [key: string]: string }];
        if (rewardPoints.length >= 2) {
          const collatorsPoints = rewardPoints[1];
          Object.keys(collatorsPoints).forEach((key) => {
            const singleCollatorPoints = Number(collatorsPoints[key].toString().replaceAll(",", ""));
            /*This staticNumber = 20 was given by the backend */
            const staticNumber = 20;
            allCollatorsLastSessionBlocksMap.set(key, singleCollatorPoints / staticNumber);
          });
        }

        const allCollators: Collator[] = [];
        const allCollatorEntries = await apiPromise.query.staking.collators.entries();
        for (let i = 0; i < allCollatorEntries.length; i++) {
          const [key, result] = allCollatorEntries[i];
          const accountAddress = key.args.map((item) => item.toHuman())[0] as unknown as string;
          const commission = `${result.toHuman()}`;
          const totalStaked = allCollatorsStakedPowersMap.get(accountAddress) ?? BigNumber(0);
          const blocksLastSession = allCollatorsLastSessionBlocksMap.get(accountAddress) ?? 0;

          const prettyName = await getPrettyName(accountAddress);

          const collator: Collator = {
            id: accountAddress,
            accountAddress: accountAddress,
            isActive: activeCollatorsAddresses.includes(accountAddress),
            lastSessionBlocks: blocksLastSession,
            commission: commission,
            totalStaked: totalStaked,
            accountName: prettyName,
          };
          allCollators.push(collator);
        }
        setCollators(allCollators);
      });
    };

    listenToCollators().catch((e) => {
      // console.log(e);
      //ignore
    });
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [apiPromise, currentBlock?.number]);

  return {
    collators,
  };
};

export default useCollators;
