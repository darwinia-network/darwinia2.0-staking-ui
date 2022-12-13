import { Button, Column, Table, Tooltip, TableRow, Popover, ModalEnhanced, Input } from "@darwinia/ui";
import { localeKeys, useAppTranslation } from "@package/app-locale";
import { useWallet } from "@darwinia/app-wallet";
import JazzIcon from "../JazzIcon";
import warningIcon from "../../assets/images/warning.svg";
import plusIcon from "../../assets/images/plus-square.svg";
import minusIcon from "../../assets/images/minus-square.svg";
import helpIcon from "../../assets/images/help.svg";
import reloadIcon from "../../assets/images/reload.svg";
import { useRef, useState } from "react";

interface Bond {
  amount: string;
  symbol: string;
  isDeposit: boolean;
}

interface Delegate extends TableRow {
  collator?: string;
  previousReward?: string;
  staked: string;
  bondedTokens: Bond[];
  isActive?: boolean;
  isMigrated?: boolean;
  isLoading?: boolean;
  isUndelegating?: boolean;
  canUndelegate?: boolean;
  canChangeCollator?: boolean;
}

const StakingRecordsTable = () => {
  const { t } = useAppTranslation();
  const { selectedNetwork } = useWallet();
  const [showBondModal, setShowBondModal] = useState<boolean>(false);
  const [bondModalType, setBondModalType] = useState<BondModalType>("bondMore");
  const [tokenSymbolToUpdate, setTokenSymbolToUpdate] = useState<string>("RING");
  const delegateToUpdate = useRef<Delegate | null>(null);

  const onCloseBondModal = () => {
    delegateToUpdate.current = null;
    setShowBondModal(false);
  };

  const onShowBondModal = (modalType: BondModalType, delegate: Delegate, symbol: string) => {
    delegateToUpdate.current = delegate;
    setTokenSymbolToUpdate(symbol);
    setBondModalType(modalType);
    setShowBondModal(true);
  };

  const onShowDepositModal = (modalType: BondModalType, delegate: Delegate, symbol: string) => {
    delegateToUpdate.current = delegate;
    console.log("show deposit modal");
  };

  const onConfirmBondModal = () => {
    console.log("confirm====");
  };

  const dataSource: Delegate[] = [
    {
      id: "1",
      collator: "chchainkoney.com",
      previousReward: "0/0",
      staked: "9,863",
      bondedTokens: [
        {
          amount: "12,983",
          symbol: selectedNetwork?.ring.symbol ?? "",
          isDeposit: false,
        },
        {
          amount: "10,000",
          symbol: selectedNetwork?.ring.symbol ?? "",
          isDeposit: true,
        },
        {
          amount: "9,899",
          symbol: selectedNetwork?.kton.symbol ?? "",
          isDeposit: false,
        },
      ],
      isMigrated: true,
    },
    {
      id: "2",
      collator: "chchainkoney.com",
      previousReward: "0/0",
      staked: "9,863",
      isActive: true,
      bondedTokens: [
        {
          amount: "12,983",
          symbol: selectedNetwork?.ring.symbol ?? "",
          isDeposit: false,
        },
        {
          amount: "10,000",
          symbol: selectedNetwork?.ring.symbol ?? "",
          isDeposit: true,
        },
        {
          amount: "9,899",
          symbol: selectedNetwork?.kton.symbol ?? "",
          isDeposit: false,
        },
      ],
    },
    {
      id: "21",
      collator: "chchainkoney.com",
      previousReward: "0/0",
      staked: "9,863",
      isActive: true,
      canChangeCollator: true,
      bondedTokens: [
        {
          amount: "12,983",
          symbol: selectedNetwork?.ring.symbol ?? "",
          isDeposit: false,
        },
        {
          amount: "10,000",
          symbol: selectedNetwork?.ring.symbol ?? "",
          isDeposit: true,
        },
        {
          amount: "9,899",
          symbol: selectedNetwork?.kton.symbol ?? "",
          isDeposit: false,
        },
      ],
    },
    {
      id: "3",
      collator: "chchainkoney.com",
      previousReward: "0/0",
      staked: "9,863",
      isActive: true,
      isLoading: true,
      bondedTokens: [
        {
          amount: "12,983",
          symbol: selectedNetwork?.ring.symbol ?? "",
          isDeposit: false,
        },
        {
          amount: "10,000",
          symbol: selectedNetwork?.ring.symbol ?? "",
          isDeposit: true,
        },
        {
          amount: "9,899",
          symbol: selectedNetwork?.kton.symbol ?? "",
          isDeposit: false,
        },
      ],
    },
    {
      id: "4",
      collator: "chchainkoney.com",
      previousReward: "0/0",
      staked: "9,863",
      isUndelegating: true,
      bondedTokens: [
        {
          amount: "12,983",
          symbol: selectedNetwork?.ring.symbol ?? "",
          isDeposit: false,
        },
        {
          amount: "10,000",
          symbol: selectedNetwork?.ring.symbol ?? "",
          isDeposit: true,
        },
        {
          amount: "9,899",
          symbol: selectedNetwork?.kton.symbol ?? "",
          isDeposit: false,
        },
      ],
    },
    {
      id: "5",
      collator: "chchainkoney.com",
      previousReward: "0/0",
      staked: "9,863",
      canUndelegate: true,
      isActive: true,
      bondedTokens: [
        {
          amount: "12,983",
          symbol: selectedNetwork?.ring.symbol ?? "",
          isDeposit: false,
        },
        {
          amount: "10,000",
          symbol: selectedNetwork?.ring.symbol ?? "",
          isDeposit: true,
        },
        {
          amount: "9,899",
          symbol: selectedNetwork?.kton.symbol ?? "",
          isDeposit: false,
        },
      ],
    },
  ];

  const columns: Column<Delegate>[] = [
    {
      id: "1",
      title: <div>{t(localeKeys.collator)}</div>,
      key: "collator",
      render: (row) => {
        if (row.isMigrated) {
          return (
            <Button btnType={"secondary"} className={"!px-[15px] !h-[30px]"}>
              {t(localeKeys.selectCollator)}
            </Button>
          );
        }
        return (
          <div className={"flex gap-[5px] items-center"}>
            <JazzIcon size={30} address={row.collator ?? ""} />
            <div>{row.collator}</div>
            {row.isActive ? null : (
              <Tooltip message={t(localeKeys.waitingCollatorWarning)}>
                <img className={"w-[21px]"} src={warningIcon} alt="image" />
              </Tooltip>
            )}
          </div>
        );
      },
    },
    {
      id: "2",
      title: <div>{t(localeKeys.rewardLastSession)}</div>,
      key: "previousReward",
      width: "200px",
    },
    {
      id: "3",
      title: <div>{t(localeKeys.youStaked)}</div>,
      key: "staked",
      width: "150px",
      render: (row) => {
        if (row.isMigrated) {
          return (
            <div className={"flex items-center gap-[10px]"}>
              <div className={"text-halfWhite"}>{row.staked}</div>
              <Tooltip message={t(localeKeys.powerNotWorking)}>
                <img className={"w-[20px]"} src={helpIcon} alt="image" />
              </Tooltip>
            </div>
          );
        }

        return <div>{row.staked}</div>;
      },
    },
    {
      id: "4",
      title: <div>{t(localeKeys.bondedTokens)}</div>,
      key: "bondedTokens",
      render: (row) => {
        return (
          <div>
            {row.bondedTokens.map((item, index) => {
              return (
                <div className={"flex gap-[5px]"} key={`${row.collator}-${index}`}>
                  <div>
                    {item.amount} {item.isDeposit ? t(localeKeys.deposit) : ""} {item.symbol.toUpperCase()}
                  </div>
                  {row.isMigrated ? null : (
                    <div>
                      <div className={"flex gap-[5px]"}>
                        <img
                          onClick={() => {
                            if (item.isDeposit) {
                              onShowDepositModal("bondMore", row, item.symbol);
                              return;
                            }
                            onShowBondModal("bondMore", row, item.symbol);
                          }}
                          src={plusIcon}
                          className={"clickable w-[16px]"}
                          alt="image"
                        />
                        <img
                          onClick={() => {
                            if (item.isDeposit) {
                              onShowDepositModal("unbond", row, item.symbol);
                              return;
                            }
                            onShowBondModal("unbond", row, item.symbol);
                          }}
                          src={minusIcon}
                          className={"clickable w-[16px]"}
                          alt="image"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      id: "5",
      title: <div />,
      key: "collator",
      width: "250px",
      render: (row) => {
        if (row.isMigrated) {
          return (
            <Button btnType={"secondary"} className={"!px-[15px] !h-[30px]"}>
              {t(localeKeys.unbondAll)}
            </Button>
          );
        }

        if (row.isUndelegating) {
          return (
            <div>
              <span className={"pr-[8px]"}>{t(localeKeys.undelegationInfo, { undelegationTime: "14 days" })}</span>
              <span className={"text-primary clickable inline-block"}>{t(localeKeys.cancel)}</span>
            </div>
          );
        }

        if (row.canUndelegate) {
          return (
            <div>
              <span className={"pr-[8px]"}>{t(localeKeys.executeUndelegation)}</span>
              <span className={"text-primary clickable inline-block"}>{t(localeKeys.execute)}</span>
            </div>
          );
        }

        if (row.isLoading) {
          return (
            <div className={"flex items-center gap-[5px]"}>
              <img className={"w-[24px]"} src={reloadIcon} alt="image" />
              <div>{t(localeKeys.loading)}</div>
            </div>
          );
        }

        if (row.canChangeCollator) {
          const options = (
            <div className={"flex items-end flex-col gap-[5px]"}>
              <Button btnType={"secondary"}>{t(localeKeys.undelegate)}</Button>
            </div>
          );
          return (
            <div className={"flex gap-[10px]"}>
              <Button className={"!h-[36px] !px-[15px]"} btnType={"secondary"}>
                {t(localeKeys.changeCollator)}
              </Button>
              <MoreOptions options={options} />
            </div>
          );
        }

        const options = (
          <div className={"flex flex-col items-end gap-[5px]"}>
            <Button btnType={"secondary"}>{t(localeKeys.sessionKey)}</Button>
            <Button btnType={"secondary"}>{t(localeKeys.stopCollating)}</Button>
          </div>
        );

        return (
          <div className={"flex gap-[10px]"}>
            <Button className={"!h-[36px] !px-[15px]"} btnType={"secondary"}>
              {t(localeKeys.commission)}
            </Button>
            <MoreOptions options={options} />
          </div>
        );
      },
    },
  ];
  return (
    <div className={"flex flex-col"}>
      <div className={"flex flex-col mt-[20px]"}>
        <Table noDataText={t(localeKeys.noDelegations)} dataSource={dataSource} columns={columns} />
      </div>
      <BondTokenModal
        symbol={tokenSymbolToUpdate}
        onCancel={onCloseBondModal}
        onConfirm={onConfirmBondModal}
        type={bondModalType}
        isVisible={showBondModal}
        onClose={onCloseBondModal}
      />
    </div>
  );
};

export default StakingRecordsTable;

interface MoreOptionsProps {
  options: JSX.Element;
}

const MoreOptions = ({ options }: MoreOptionsProps) => {
  const [moreOptionsTrigger, setMoreOptionsTrigger] = useState<HTMLButtonElement | null>(null);
  return (
    <>
      <Button ref={setMoreOptionsTrigger} className={"!h-[36px] !px-[15px]"} btnType={"secondary"}>
        ...
      </Button>
      <Popover triggerElementState={moreOptionsTrigger} triggerEvent={"click"}>
        <div>{options}</div>
      </Popover>
    </>
  );
};

type BondModalType = "bondMore" | "unbond";

interface BondProps {
  symbol: string;
  type: BondModalType;
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const BondTokenModal = ({ isVisible, type, onClose, onConfirm, onCancel, symbol }: BondProps) => {
  const { t } = useAppTranslation();
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const getErrorJSX = () => {
    return hasError ? <div /> : null;
  };
  return (
    <ModalEnhanced
      modalTitle={type === "bondMore" ? t(localeKeys.bondMore) : t(localeKeys.unbond)}
      cancelText={t(localeKeys.cancel)}
      confirmText={type === "bondMore" ? t(localeKeys.bond) : t(localeKeys.unbond)}
      onConfirm={onConfirm}
      confirmLoading={isLoading}
      isVisible={isVisible}
      onClose={onClose}
      onCancel={onCancel}
      className={"!max-w-[400px]"}
    >
      <div>
        {type === "unbond" && (
          <div className={"pb-[20px] mb-[20px] divider border-b"}>
            {t(localeKeys.unbondTimeInfo, { unbondingTime: "14 days" })}
          </div>
        )}
        <div className={"flex flex-col gap-[10px]"}>
          <div className={"text-12-bold"}>{t(localeKeys.amount)}</div>
          <Input
            hasErrorMessage={false}
            error={getErrorJSX()}
            bottomTip={<div className={"text-primary"}>+0 {t(localeKeys.power)}</div>}
            leftIcon={null}
            placeholder={t(localeKeys.balanceAmount, { amount: 0 })}
            rightSlot={<div className={"flex items-center px-[10px]"}>{symbol}</div>}
          />
        </div>
      </div>
    </ModalEnhanced>
  );
};
