import { localeKeys, useAppTranslation } from "@package/app-locale";
import { Button, Column, Input, Table } from "@darwinia/ui";
import ringIcon from "../../assets/images/ring.svg";
import ktonIcon from "../../assets/images/kton.svg";
import { useWallet } from "@darwinia/app-wallet";
import caretDownIcon from "../../assets/images/caret-down.svg";
import { TableRow } from "@darwinia/ui/src/components/Table";

interface Delegation extends TableRow {
  collator: string;
  previousReward: string;
  staked: string;
  bondedTokens: string[];
}

const StakingOverview = () => {
  const { t } = useAppTranslation();
  const { selectedNetwork } = useWallet();

  const dataSource: Delegation[] = [
    {
      id: "1",
      collator: "chchainkoney.com",
      previousReward: "0/0",
      staked: "9,863",
      bondedTokens: ["12,983", "322,435", "2"],
    },
    {
      id: "2",
      collator: "chchainkoney.com",
      previousReward: "0/0",
      staked: "9,863",
      bondedTokens: ["12,983", "322,435", "2"],
    },
    {
      id: "3",
      collator: "chchainkoney.com",
      previousReward: "0/0",
      staked: "9,863",
      bondedTokens: ["12,983", "322,435", "2"],
    },
    {
      id: "4",
      collator: "chchainkoney.com",
      previousReward: "0/0",
      staked: "9,863",
      bondedTokens: ["12,983", "322,435", "2"],
    },
  ];

  const columns: Column<Delegation>[] = [
    {
      id: "1",
      title: <div>Collator</div>,
      key: "collator",
    },
    {
      id: "2",
      title: <div>Your rewards last session / in total</div>,
      key: "previousReward",
      width: "200px",
    },
    {
      id: "3",
      title: <div>You staked (power)</div>,
      key: "staked",
      width: "150px",
    },
    {
      id: "4",
      title: <div>Your Bonded Tokens</div>,
      key: "bondedTokens",
    },
    {
      id: "5",
      title: <div>Unknown</div>,
      key: "collator",
      width: "250px",
    },
  ];

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
        <div>Darwinia</div>
        <div></div>
      </div>
      <div className={"flex flex-col"}>
        <div className={"flex flex-col mt-[20px]"}>
          <Table noDataText={t(localeKeys.noDelegations)} dataSource={dataSource} columns={columns} />
        </div>
      </div>
    </div>
  );
};

export default StakingOverview;
