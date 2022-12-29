import BigNumber from "bignumber.js";
import { ApiPromise } from "@polkadot/api";
import { useCallback, useEffect, useState } from "react";
import { combineLatest, Subscription } from "rxjs";
import { convertAssetToPower, formatToWei } from "@darwinia/app-utils";
import { StakingAsset } from "@darwinia/app-types";

interface Pool {
  ring: BigNumber;
  kton: BigNumber;
}

interface Params {
  apiPromise: ApiPromise | undefined;
  stakingAsset: StakingAsset | undefined;
}

const usePower = ({ apiPromise, stakingAsset }: Params) => {
  const [isLoadingPool, setLoadingPool] = useState<boolean>(true);
  const [pool, setPool] = useState<Pool>({ ring: BigNumber(0), kton: BigNumber(0) });
  const [power, setPower] = useState<BigNumber>(BigNumber(0));

  // fetch data from kton and ring pool
  useEffect(() => {
    let subscription: Subscription | undefined;
    const getPool = async () => {
      if (!apiPromise) {
        return;
      }
      setLoadingPool(true);
      // TODO wire ringPool and ktoPool to socket
      const ring = apiPromise.query.staking.ringPool();
      const kton = apiPromise.query.staking.ktonPool();

      subscription = combineLatest([ring, kton]).subscribe(([ringValue, ktonValue]) => {
        setPool({
          kton: BigNumber(ktonValue.toString()),
          ring: BigNumber(ringValue.toString()),
        });
        setLoadingPool(false);
      });
    };

    getPool().catch(() => {
      //ignore
      setLoadingPool(false);
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [apiPromise]);

  /*calculate power*/
  useEffect(() => {
    if (!stakingAsset) {
      setPower(BigNumber(0));
      return;
    }
    const power = convertAssetToPower(stakingAsset.ring, stakingAsset.kton, pool.ring, pool.kton);
    setPower(power);
  }, [pool, stakingAsset]);

  /*StakingAsset values should be in Wei*/
  const calculatePower = useCallback(
    (stakingAsset: StakingAsset) => {
      const initialBondedRing = BigNumber(0);
      const initialBondedKton = BigNumber(0);
      const initialPower = convertAssetToPower(initialBondedRing, initialBondedKton, pool.ring, pool.kton);
      const accumulatedPower = convertAssetToPower(stakingAsset.ring, stakingAsset.kton, pool.ring, pool.kton);
      return accumulatedPower.minus(initialPower);
    },
    [pool]
  );

  return {
    pool,
    isLoadingPool,
    power,
    calculatePower,
  };
};

export default usePower;
