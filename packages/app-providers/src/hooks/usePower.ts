import BigNumber from "bignumber.js";
import { ApiPromise } from "@polkadot/api";
import { useEffect, useState } from "react";
import { combineLatest, Subscription } from "rxjs";
import { convertAssetToPower } from "@darwinia/app-utils";

interface Pool {
  ring: BigNumber;
  kton: BigNumber;
}

interface StakingAsset {
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

  return {
    pool,
    isLoadingPool,
    power,
  };
};

export default usePower;
