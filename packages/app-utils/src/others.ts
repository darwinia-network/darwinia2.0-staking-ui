import { Storage } from "@darwinia/app-types";
import { STORAGE } from "@darwinia/app-config";

export const setStore = (key: keyof Storage, value: unknown) => {
  try {
    const oldValue = JSON.parse(localStorage.getItem(STORAGE) ?? "{}");
    const updatedValue = {
      ...oldValue,
      [key]: value,
    };
    localStorage.setItem(STORAGE, JSON.stringify(updatedValue));
  } catch (e) {
    //ignore
  }
};

export const getStore = <T>(key: keyof Storage): T | undefined | null => {
  try {
    const oldValue = JSON.parse(localStorage.getItem(STORAGE) ?? "{}") as Storage;
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
