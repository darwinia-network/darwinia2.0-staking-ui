import { ApiPromise } from "@polkadot/api";
import { useCallback } from "react";
import { DeriveAccountRegistration } from "@polkadot/api-derive/accounts/types";

/*This code needs a double check with Polkadot JS apps */
const useAccountPrettyName = (apiPromise: ApiPromise | undefined) => {
  /*Old code from apps.darwinia.network */
  const extractIdentity = (cacheAddress: string, identity: DeriveAccountRegistration) => {
    const judgements = identity.judgements.filter(([, judgement]) => !judgement.isFeePaid);
    const isGood = judgements.some(([, judgement]) => judgement.isKnownGood || judgement.isReasonable);
    // const isBad = judgements.some(([, judgement]) => judgement.isErroneous || judgement.isLowQuality);
    const displayName = isGood ? identity.display : identity.display || ""; // at polkadot apps: .replace(/[^\x20-\x7E]/g, '');
    const displayParent =
      identity.displayParent && (isGood ? identity.displayParent : identity.displayParent.replace(/[^\x20-\x7E]/g, ""));
    return displayName || displayParent;
  };

  const getPrettyName = useCallback(
    async (accountAddress: string): Promise<string | undefined> => {
      if (!apiPromise) {
        return;
      }

      const queryInfo = async () => {
        const accountInfo = await apiPromise.derive.accounts.info(accountAddress);
        const { accountId, nickname, identity } = accountInfo;
        const cacheAddress = (accountId || accountAddress).toString();
        if (typeof apiPromise.query.identity?.identityOf === "function") {
          return identity.display ? extractIdentity(cacheAddress, identity) : accountAddress;
        } else if (nickname) {
          return nickname;
        }
        return accountAddress;
      };

      queryInfo().catch((e) => {
        //ignore
      });
    },
    [apiPromise]
  );

  return {
    getPrettyName,
  };
};

export default useAccountPrettyName;
