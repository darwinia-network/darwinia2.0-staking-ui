import powerIcon from "../../assets/images/power.svg";
import { localeKeys, useAppTranslation } from "@darwinia/app-locale";
import BigNumber from "bignumber.js";
import ringIcon from "../../assets/images/ring.svg";
import ktonIcon from "../../assets/images/kton.svg";
import { useStorage, useWallet } from "@darwinia/app-providers";
import { StakingRecord } from "@darwinia/app-types";
import { prettifyNumber, toTimeAgo } from "@darwinia/app-utils";
import { useQuery } from "@apollo/client";
import { GET_LATEST_STAKING_REWARDS } from "@darwinia/app-config";
import { Spinner } from "@darwinia/ui";
import { ethers } from "ethers";

interface StakingStashQuery {
  accountAddress: string;
  itemsCount: number;
}

const AccountOverview = () => {
  const { t } = useAppTranslation();
  const { selectedNetwork, selectedAccount } = useWallet();
  const { power, stakedAssetDistribution, isLoadingLedger } = useStorage();

  const {
    loading: isLoadingStakingData,
    data: stakingData,
    error,
  } = useQuery<{ stakingRecord: StakingRecord }, StakingStashQuery>(GET_LATEST_STAKING_REWARDS, {
    variables: {
      accountAddress: ethers.utils.getAddress(selectedAccount ?? ""),
      itemsCount: 3,
    },
  });

  return (
    <div className={"flex gap-[20px] lg:gap-0 justify-between flex-col lg:flex-row"}>
      {/*Power Card*/}
      <div className={"card lg:max-w-[66.08%] flex-1 flex flex-col gap-[20px] bg-primary"}>
        <div className={"flex justify-between items-center"}>
          <div className={"flex items-center gap-[10px] lg:gap-[30px]"}>
            <img className={"w-[30px] lg:w-[44px]"} src={powerIcon} alt="image" />
            <div className={"text-24-bold text-[30px]"}>{t(localeKeys.power)}</div>
          </div>
          <div className={"text-24-bold text-[30px]"}>
            {prettifyNumber({
              number: power ?? BigNumber(0),
              shouldFormatToEther: false,
            })}
          </div>
        </div>
        <Spinner isLoading={isLoadingStakingData} size={"small"} className={"card"}>
          <div className={"flex gap-[10px] flex-col"}>
            <div className={"border-b divider pb-[10px] text-14-bold"}>{t(localeKeys.latestStakingRewards)}</div>
            <div className={"min-h-[92px] flex flex-col text-14-bold"}>
              {!error && stakingData?.stakingRecord && stakingData?.stakingRecord.rewards.nodes.length > 0 ? (
                <div className={"flex flex-col gap-[10px]"}>
                  {stakingData.stakingRecord.rewards.nodes.map((item) => {
                    return (
                      <div className={"flex justify-between"} key={item.id}>
                        <div>
                          {prettifyNumber({
                            number: BigNumber(item.amount),
                            precision: 6,
                          })}{" "}
                          {selectedNetwork?.ring.symbol}
                        </div>
                        <div>{toTimeAgo(item.blockTime)}</div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={"text-halfWhite"}>{t(localeKeys.noRewards)}</div>
              )}
            </div>
          </div>
        </Spinner>
        <div className={"flex lg:justify-center text-12 gap-[8px]"}>
          <div className={"text-halfWhite"}>{t(localeKeys.seeDetailed)}</div>
          <a
            className={"clickable underline"}
            target="_blank"
            href={`${selectedNetwork?.explorerURLs[0]}`}
            rel="noreferrer"
          >
            Subscan→
          </a>
        </div>
      </div>
      {/*Staking reserve*/}
      <Spinner
        size={"small"}
        className={"card flex flex-col justify-center lg:w-[32.25%] shrink-0"}
        isLoading={!!isLoadingLedger}
      >
        <div>
          <div className={"divider border-b pb-[20px]"}>{t(localeKeys.reservedInStaking)}</div>
          <div className={"flex flex-col gap-[20px] mt-[20px]"}>
            {/*RING*/}
            <div className={"divider border-b pb-[20px] gap-[20px] flex flex-col"}>
              <div className={"flex gap-[5px] items-center"}>
                <img className={"w-[30px]"} src={ringIcon} alt="image" />
                <div className={"uppercase text-18-bold"}>{selectedNetwork?.ring.symbol ?? "RING"}</div>
              </div>
              <div className={"flex flex-col gap-[2px]"}>
                <div className={"flex justify-between"}>
                  <div>{t(localeKeys.bonded)}</div>
                  <div>
                    {prettifyNumber({
                      number: stakedAssetDistribution?.ring.bonded ?? BigNumber(0),
                      precision: 4,
                    })}
                  </div>
                </div>
                <div className={"flex justify-between"}>
                  <div>{t(localeKeys.inDeposit)}</div>
                  <div>
                    {prettifyNumber({
                      number: stakedAssetDistribution?.ring.totalOfDepositsInStaking ?? BigNumber(0),
                      precision: 4,
                    })}
                  </div>
                </div>
              </div>
            </div>
            {/*KTON*/}
            <div className={"gap-[20px] flex flex-col"}>
              <div className={"flex gap-[5px] items-center"}>
                <img className={"w-[30px]"} src={ktonIcon} alt="image" />
                <div className={"uppercase text-18-bold"}>{selectedNetwork?.kton.symbol ?? "KTON"}</div>
              </div>
              <div className={"flex flex-col gap-[2px]"}>
                <div className={"flex justify-between"}>
                  <div>{t(localeKeys.bonded)}</div>
                  <div>
                    {prettifyNumber({
                      number: stakedAssetDistribution?.kton.bonded ?? BigNumber(0),
                      precision: 4,
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Spinner>
    </div>
  );
};

export default AccountOverview;
