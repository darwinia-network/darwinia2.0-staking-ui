import { PalletIdentityRegistration, Storage } from "@darwinia/app-types";
import { STORAGE as APP_STORAGE } from "@darwinia/app-config";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";

export const setStore = (key: keyof Storage, value: unknown) => {
  try {
    const oldValue = JSON.parse(localStorage.getItem(APP_STORAGE) ?? "{}");
    const updatedValue = {
      ...oldValue,
      [key]: value,
    };
    localStorage.setItem(APP_STORAGE, JSON.stringify(updatedValue));
  } catch (e) {
    //ignore
  }
};

export const getStore = <T>(key: keyof Storage): T | undefined | null => {
  try {
    const oldValue = JSON.parse(localStorage.getItem(APP_STORAGE) ?? "{}") as Storage;
    return oldValue[key] as T | undefined | null;
  } catch (e) {
    return undefined;
  }
};

export const toShortAddress = (accountAddress: string) => {
  const firstPart = accountAddress.slice(0, 5);
  const secondPart = accountAddress.slice(-4);
  return `${firstPart}...${secondPart}`;
};

export const isValidNumber = (value: string): boolean => {
  if (value.trim().length === 0) {
    return false;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return !isNaN(value);
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return Promise.resolve(true);
  } catch (e) {
    return Promise.resolve(false);
    //ignore
  }
};

interface PrettyNumberInput {
  number: BigNumber;
  precision?: number;
  round?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  keepTrailingZeros?: boolean;
  shouldFormatToEther?: boolean;
}
export const prettifyNumber = ({
  number,
  precision = 0,
  round = BigNumber.ROUND_DOWN,
  keepTrailingZeros = true,
  shouldFormatToEther = true,
}: PrettyNumberInput) => {
  if (keepTrailingZeros) {
    // will return a number like 12,345.506000
    if (shouldFormatToEther) {
      const numberInEther = formatToEther(number.toFixed());
      return BigNumber(numberInEther).toFormat(precision, round);
    }
    return number.toFormat(precision, round);
  }

  // will return a number like 12,345.506
  if (shouldFormatToEther) {
    const numberInEther = formatToEther(number.toFixed());
    return BigNumber(numberInEther).decimalPlaces(precision, round).toFormat();
  }
  return number.decimalPlaces(precision, round).toFormat();
};

export const formatToEther = (valueInWei: string): string => {
  return ethers.utils.formatEther(valueInWei);
};

export const formatToWei = (valueInEther: string) => {
  return ethers.utils.parseEther(valueInEther);
};
