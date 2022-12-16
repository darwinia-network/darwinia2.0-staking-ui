import AccountOverview from "../components/AccountOverview";
import { Tab, Tabs } from "@darwinia/ui";
import { useState } from "react";
import { localeKeys, useAppTranslation } from "@darwinia/app-locale";
import StakingOverview from "../components/StakingOverview";
import DepositOverview from "../components/DepositOverview";
import { CSSTransition } from "react-transition-group";

const Staking = () => {
  const [activeTabId, setActiveTabId] = useState<string>("1");
  const { t } = useAppTranslation();
  const tabTransitionTimeout = 500;

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

  return (
    <div className={"flex-1 flex flex-col gap-[30px]"}>
      <AccountOverview />
      <div className={"flex flex-col gap-[30px]"}>
        <Tabs onChange={onTabChange} tabs={tabs} activeTabId={activeTabId} />
        <div className={"wrapper relative"}>
          {/*staking overview*/}
          <CSSTransition
            classNames={"tab-content"}
            unmountOnExit={true}
            timeout={{
              enter: tabTransitionTimeout,
              exit: 0,
            }}
            in={activeTabId === "1"}
            key={1}
          >
            <StakingOverview />
          </CSSTransition>
          {/*deposit overview*/}
          <CSSTransition
            classNames={"tab-content"}
            unmountOnExit={true}
            timeout={{
              enter: tabTransitionTimeout,
              exit: 0,
            }}
            in={activeTabId === "2"}
            key={2}
          >
            <DepositOverview />
          </CSSTransition>
        </div>
      </div>
    </div>
  );
};

export default Staking;
