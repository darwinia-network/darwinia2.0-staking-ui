import { Storage } from "@darwinia/app-types";
import { STORAGE } from "@darwinia/app-config";

const convertToString = (value: number) => {
  return `${value}`;
};

export { convertToString };

export const setStore = (key: keyof Storage, value: never) => {
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
