import { Storage } from "@darwinia/app-types";
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

export const parseNumber = (value: string): number | undefined => {
  return value.trim().length === 0 ? undefined : Number(value);
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

export const prettifyNumber = (
  number: BigNumber,
  precision = 0,
  round = BigNumber.ROUND_DOWN,
  keepTrailingZeros = true
) => {
  if (keepTrailingZeros) {
    // will return a number like 12,345.506000
    return number.toFormat(precision, round);
  }
  // will return a number like 12,345.506
  return number.decimalPlaces(precision, round).toFormat();
};

export const formatToEther = (value: string): string => {
  return ethers.utils.formatUnits(value, 9);
};

export const formatToWei = (value: string) => {
  return ethers.utils.parseEther(value);
};
