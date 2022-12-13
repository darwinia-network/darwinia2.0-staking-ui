import { localeKeys, useAppTranslation } from "@package/app-locale";
import { Button, Input } from "@darwinia/ui";
import ringIcon from "../../assets/images/ring.svg";
import ktonIcon from "../../assets/images/kton.svg";
import { useWallet } from "@darwinia/app-wallet";
import caretDownIcon from "../../assets/images/caret-down.svg";
import JazzIcon from "../JazzIcon";
import switchIcon from "../../assets/images/switch.svg";
import StakingRecordsTable from "../StakingRecordsTable";

const StakingOverview = () => {
  const { t } = useAppTranslation();
  const { selectedNetwork, selectedAccount } = useWallet();

  return (
    <div>
      <div className={"card flex flex-col gap-[10px]"}>
        <div className={"text-14-bold divider border-b pb-[10px]"}>{t(localeKeys.delegate)}</div>
        <div className={"text-halfWhite text-12"}>
          {t(localeKeys.stakingBasicInfo, { sessionTime: "24 hours", unbondTime: "14 days" })}
        </div>
        <div className={"flex flex-col gap-[10px]"}>
          <Button className={"w-full"} btnType={"secondary"}>
            {t(localeKeys.selectCollator)}
          </Button>
          <div className={"flex flex-col lg:flex-row gap-[10px] divider border-b pb-[10px]"}>
            <div className={"flex-1"}>
              <Input
                leftIcon={null}
                rightSlot={
                  <div className={"flex gap-[10px] items-center px-[10px]"}>
                    <img className={"w-[20px]"} src={ringIcon} alt="image" />
                    <div className={"uppercase"}>{selectedNetwork?.ring.symbol ?? "RING"}</div>
                  </div>
                }
                placeholder={t(localeKeys.balanceAmount, { amount: 0 })}
              />
            </div>
            <div className={"flex-1"}>
              <Input
                leftIcon={null}
                rightSlot={
                  <div className={"flex gap-[10px] items-center px-[10px]"}>
                    <img className={"w-[20px]"} src={ktonIcon} alt="image" />
                    <div className={"uppercase"}>{selectedNetwork?.kton.symbol ?? "RING"}</div>
                  </div>
                }
                placeholder={t(localeKeys.balanceAmount, { amount: 0 })}
              />
            </div>
            {/*use a deposit*/}
            <div className={"flex-1 flex justify-between items-center border border-halfWhite px-[10px]"}>
              <div className={"py-[7px]"}>{t(localeKeys.useDeposit)}</div>
              <img className={"w-[16px]"} src={caretDownIcon} alt="image" />
            </div>
          </div>
        </div>
        <Button className={"w-full lg:w-auto !px-[55px]"}>{t(localeKeys.stake)}</Button>
        {/*Selected collator*/}
        <div
          className={"flex items-center gap-[10px] py-[10px] px-[15px] lg:px-[25px] lg:py-[20px] border border-primary"}
        >
          <div className={"shrink-0"}>
            <JazzIcon size={30} address={selectedAccount ?? ""} />
          </div>
          <div className={"lg:flex lg:gap-[10px] min-w-0"}>
            <div>darwinia</div>
            <div>
              <div className={"break-words"}>{selectedAccount}</div>
            </div>
          </div>
          <div className={"shrink-0"}>
            <img className={"w-[24px] clickable"} src={switchIcon} alt="image" />
          </div>
        </div>
      </div>
      <StakingRecordsTable />
    </div>
  );
};

export default StakingOverview;
