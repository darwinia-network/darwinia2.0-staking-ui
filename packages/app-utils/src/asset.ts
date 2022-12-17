import BigNumber from "bignumber.js";

const POWER_CAP = 1000000000;
export const convertAssetToPower = (
  ringAmount: BigNumber,
  ktonAmount: BigNumber,
  poolRingAmount: BigNumber,
  poolKtonAmount: BigNumber
): BigNumber => {
  if (poolRingAmount.isEqualTo(0)) {
    return BigNumber(0);
  }

  let divider = BigNumber(0);
  /*Power calculation formula is
   *  (ringAmount + (ktonAmount * (poolRingAmount / poolKtonAmount))) / (poolRingAmount * 2) * 1000000000
   *  */
  if (!poolKtonAmount.isEqualTo(0)) {
    divider = poolRingAmount.div(poolKtonAmount);
  }

  const power = ringAmount.plus(ktonAmount.times(divider)).div(poolRingAmount.times(2)).times(POWER_CAP).toFixed(0);

  return BigNumber(power);
};
