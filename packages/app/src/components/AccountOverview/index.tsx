import powerIcon from "../../assets/images/power.svg";
import { localeKeys, useAppTranslation } from "@package/app-locale";
import BigNumber from "bignumber.js";
import ringIcon from "../../assets/images/ring.svg";
import ktonIcon from "../../assets/images/kton.svg";
import { useWallet } from "@darwinia/app-wallet";

interface Reward {
  id: string;
  amount: BigNumber;
  time: string;
  symbol: string;
}

const AccountOverview = () => {
  const { t } = useAppTranslation();
  const { selectedNetwork } = useWallet();
  const rewards: Reward[] = [
    {
      id: "1",
      amount: new BigNumber("34341.345"),
      time: "1 day ago",
      symbol: selectedNetwork?.ring.symbol ?? "RING",
    },
    {
      id: "2",
      amount: new BigNumber("34341.345"),
      time: "1 day ago",
      symbol: selectedNetwork?.ring.symbol ?? "RING",
    },
    {
      id: "3",
      amount: new BigNumber("34341.345"),
      time: "1 day ago",
      symbol: selectedNetwork?.ring.symbol ?? "RING",
    },
  ];
  return (
    <div className={"flex gap-[20px] lg:gap-0 justify-between flex-col lg:flex-row"}>
      {/*Power Card*/}
      <div className={"card lg:max-w-[66.08%] flex-1 flex flex-col gap-[20px] bg-primary"}>
        <div className={"flex justify-between items-center"}>
          <div className={"flex items-center gap-[10px] lg:gap-[30px]"}>
            <img className={"w-[30px] lg:w-[44px]"} src={powerIcon} alt="image" />
            <div className={"text-24-bold text-[30px]"}>{t(localeKeys.power)}</div>
          </div>
          <div className={"text-24-bold text-[30px]"}>94261823</div>
        </div>
        <div className={"card"}>
          <div className={"flex gap-[10px] flex-col"}>
            <div className={"border-b divider pb-[10px] text-14-bold"}>{t(localeKeys.latestStakingRewards)}</div>
            <div className={"min-h-[90px] flex flex-col text-14-bold"}>
              {rewards.length > 0 ? (
                <div className={"flex flex-col gap-[10px]"}>
                  {rewards.map((item) => {
                    return (
                      <div className={"flex justify-between"} key={item.id}>
                        <div>
                          {item.amount.toString()} {item.symbol}
                        </div>
                        <div>{item.time}</div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={"text-halfWhite"}>{t(localeKeys.noRewards)}</div>
              )}
            </div>
          </div>
        </div>
        <div className={"flex lg:justify-center text-12 gap-[8px]"}>
          <div className={"text-halfWhite"}>{t(localeKeys.seeDetailed)}</div>
          <a className={"clickable underline"} target="_blank" href="#">
            subscan→
          </a>
        </div>
      </div>
      {/*Staking reserve*/}
      <div className={"card flex flex-col justify-center lg:w-[32.25%] shrink-0"}>
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
                <div>0</div>
              </div>
              <div className={"flex justify-between"}>
                <div>{t(localeKeys.inDeposit)}</div>
                <div>0</div>
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
                <div>0</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountOverview;
