import AccountOverview from "../components/AccountOverview";
import { Tab, Tabs } from "@darwinia/ui";
import { useState } from "react";
import { localeKeys, useAppTranslation } from "@package/app-locale";
import StakingOverview from "../components/StakingOverview";
import DepositOverview from "../components/DepositOverview";

const Staking = () => {
  const [activeTabId, setActiveTabId] = useState<string>("1");
  const { t } = useAppTranslation();
  const onTabChange = (selectedTab: Tab) => {
    setActiveTabId(selectedTab.id);
  };

  const tabs: Tab[] = [
    {
      id: "1",
      title: t(localeKeys.staking),
    },
    {
      id: "2",
      title: t(localeKeys.deposit),
    },
  ];
  const getTabsContent = (activeTabId: string) => {
    switch (activeTabId) {
      case "2": {
        return <DepositOverview />;
      }
      default:
      case "1": {
        return <StakingOverview />;
      }
    }
  };
  return (
    <div className={"flex-1 flex flex-col gap-[30px]"}>
      <AccountOverview />
      <div className={"flex flex-col gap-[30px]"}>
        <Tabs onChange={onTabChange} tabs={tabs} activeTabId={activeTabId} />
        <div>{getTabsContent(activeTabId)}</div>
      </div>
    </div>
  );
};

export default Staking;
