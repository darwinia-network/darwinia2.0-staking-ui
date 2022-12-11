import { useEffect } from "react";
import { localeKeys, useAppTranslation } from "@package/app-locale";
import { Button, Input } from "@darwinia/ui";

const StakingOverview = () => {
  const { t } = useAppTranslation();
  useEffect(() => {
    console.log("staking mounted");
  }, []);
  return (
    <div>
      <div className={"card flex flex-col gap-[20px]"}>
        <div className={"text-14-bold divider border-b pb-[20px]"}>{t(localeKeys.delegate)}</div>
        <div className={"text-halfWhite text-12"}>
          {t(localeKeys.stakingBasicInfo, { sessionTime: "24 hours", unbondTime: "14 days" })}
        </div>
        <div className={"flex flex-col gap-[10px]"}>
          <Button className={"w-full"} btnType={"secondary"}>
            {t(localeKeys.selectCollator)}
          </Button>
          <div className={"flex gap-[10px]"}>
            <Input leftIcon={null} placeholder={"Balance: 0"} />
            <Input leftIcon={null} />
            <Input leftIcon={null} />
          </div>
        </div>
        <Button>{t(localeKeys.stake)}</Button>
      </div>
    </div>
  );
};

export default StakingOverview;
