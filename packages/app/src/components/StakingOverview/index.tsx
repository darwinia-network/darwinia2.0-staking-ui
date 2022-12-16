import { localeKeys, useAppTranslation } from "@darwinia/app-locale";
import { Button, CheckboxGroup, Dropdown, Input } from "@darwinia/ui";
import ringIcon from "../../assets/images/ring.svg";
import ktonIcon from "../../assets/images/kton.svg";
import { useWallet } from "@darwinia/app-wallet";
import caretDownIcon from "../../assets/images/caret-down.svg";
import JazzIcon from "../JazzIcon";
import switchIcon from "../../assets/images/switch.svg";
import StakingRecordsTable from "../StakingRecordsTable";
import { useRef, useState } from "react";
import { Deposit, Collator } from "@darwinia/app-types";
import SelectCollatorModal, { SelectCollatorRefs } from "../SelectCollatorModal";

const StakingOverview = () => {
  const { t } = useAppTranslation();
  const { selectedNetwork, selectedAccount } = useWallet();
  const [selectedDeposits, setSelectedDeposits] = useState<Deposit[]>([]);
  const selectCollatorModalRef = useRef<SelectCollatorRefs>(null);
  const [selectedCollator, setSelectedCollator] = useState<Collator>();

  const onSelectCollator = () => {
    if (selectCollatorModalRef.current) {
      selectCollatorModalRef.current.toggle();
    }
  };

  const depositList: Deposit[] = [
    {
      id: "1",
      amount: "1,200",
    },
    {
      id: "2",
      amount: "1,300",
    },
    {
      id: "3",
      amount: "1,400",
    },
    {
      id: "4",
      amount: "1,500",
    },
    {
      id: "5",
      amount: "1,600",
    },
  ];

  const depositRenderer = (option: Deposit) => {
    return (
      <div className={"flex justify-between"}>
        <div>ID#{option.id}</div>
        <div>{option.amount}</div>
      </div>
    );
  };

  const onDepositSelectionChange = (selectedItem: Deposit, allItems: Deposit[]) => {
    setSelectedDeposits(allItems);
  };

  const onCollatorSelected = (collator: Collator) => {
    setSelectedCollator(collator);
  };

  const getDepositsDropdown = () => {
    if (depositList.length === 0) {
      return (
        <div className={"w-full border border-halfWhite bg-blackSecondary border-t-0"}>
          <div className={"bg-[rgba(255,255,255,0.2)] px-[10px] py-[6px] text-halfWhite"}>no active deposits</div>
        </div>
      );
    }
    return (
      <div
        className={
          "w-full border border-halfWhite border-t-0 bg-blackSecondary max-h-[310px] p-[10px] dw-custom-scrollbar"
        }
      >
        <CheckboxGroup
          options={depositList}
          render={depositRenderer}
          onChange={onDepositSelectionChange}
          selectedOptions={selectedDeposits}
        />
      </div>
    );
  };

  return (
    <div>
      <div className={"card flex flex-col gap-[10px]"}>
        <div className={"text-14-bold"}>{t(localeKeys.delegate)}</div>
        <div className={"text-halfWhite text-12 divider border-b pb-[10px]"}>
          {t(localeKeys.stakingBasicInfo, { sessionTime: "24 hours", unbondTime: "14 days" })}
        </div>
        <div className={"flex flex-col gap-[10px]"}>
          {!selectedCollator && (
            <Button
              onClick={() => {
                onSelectCollator();
              }}
              className={"w-full"}
              btnType={"secondary"}
            >
              {t(localeKeys.selectCollator)}
            </Button>
          )}
          <SelectCollatorModal ref={selectCollatorModalRef} onCollatorSelected={onCollatorSelected} type={"set"} />
          {/*Selected collator*/}
          {selectedCollator && (
            <div className={"flex items-center gap-[10px] px-[15px] lg:px-[25px] lg:py-[20px] border border-primary"}>
              <div className={"shrink-0"}>
                <JazzIcon size={30} address={selectedCollator.accountAddress ?? ""} />
              </div>
              <div className={"lg:flex lg:gap-[10px] min-w-0"}>
                <div>{selectedCollator.accountName}</div>
                <div>
                  <div className={"break-words"}>{selectedCollator.accountAddress}</div>
                </div>
              </div>
              <div
                onClick={() => {
                  onSelectCollator();
                }}
                className={"shrink-0"}
              >
                <img className={"w-[24px] clickable"} src={switchIcon} alt="image" />
              </div>
            </div>
          )}
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
              <div className={"text-12-bold text-primary pt-[10px]"}>+0 {t(localeKeys.power)}</div>
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
              <div className={"text-12-bold text-primary pt-[10px]"}>+0 {t(localeKeys.power)}</div>
            </div>
            {/*use a deposit*/}
            <Dropdown
              closeOnInteraction={false}
              overlay={getDepositsDropdown()}
              triggerEvent={"click"}
              className={"flex-1"}
              dropdownClassName={"w-full top-[40px]"}
            >
              <div>
                <div className={"flex-1 flex justify-between items-center border border-halfWhite px-[10px]"}>
                  <div className={"py-[7px]"}>
                    {selectedDeposits.length === 0
                      ? t(localeKeys.useDeposit)
                      : t(localeKeys.depositSelected, { number: selectedDeposits.length })}
                  </div>
                  <img className={"w-[16px]"} src={caretDownIcon} alt="image" />
                </div>
                <div className={"text-12-bold text-primary pt-[10px]"}>+0 {t(localeKeys.power)}</div>
              </div>
            </Dropdown>
          </div>
        </div>
        <div className={"w-full flex flex-col lg:flex-row gap-[10px]"}>
          <Button className={"w-full lg:w-auto !px-[55px]"}>
            {t(localeKeys.approveKton, { token: selectedNetwork?.kton.symbol })}
          </Button>
          <Button disabled className={"w-full lg:w-auto !px-[55px]"}>
            {t(localeKeys.stake)}
          </Button>
        </div>
      </div>
      <StakingRecordsTable />
    </div>
  );
};

export default StakingOverview;
