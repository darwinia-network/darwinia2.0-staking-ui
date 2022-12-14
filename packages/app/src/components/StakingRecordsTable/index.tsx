import { Button, Column, Table, Tooltip, TableRow, Popover, ModalEnhanced, Input, CheckboxGroup } from "@darwinia/ui";
import { localeKeys, useAppTranslation } from "@package/app-locale";
import { useWallet } from "@darwinia/app-wallet";
import JazzIcon from "../JazzIcon";
import warningIcon from "../../assets/images/warning.svg";
import plusIcon from "../../assets/images/plus-square.svg";
import minusIcon from "../../assets/images/minus-square.svg";
import helpIcon from "../../assets/images/help.svg";
import reloadIcon from "../../assets/images/reload.svg";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Deposit } from "@darwinia/app-types";
import { parseNumber } from "@darwinia/app-utils";

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

const allDeposits: Deposit[] = [
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

const StakingRecordsTable = () => {
  const { t } = useAppTranslation();
  const { selectedNetwork } = useWallet();
  const [showBondTokenModal, setShowBondTokenModal] = useState<boolean>(false);
  const [showCommissionUpdateModal, setShowCommissionUpdateModal] = useState<boolean>(false);
  const [showBondDepositModal, setShowBondDepositModal] = useState<boolean>(false);
  const [bondModalType, setBondModalType] = useState<BondModalType>("bondMore");
  const [tokenSymbolToUpdate, setTokenSymbolToUpdate] = useState<string>("RING");
  const delegateToUpdate = useRef<Delegate | null>(null);
  const [bondedDeposits, setBondedDeposit] = useState<Deposit[]>([
    {
      id: "2",
      amount: "1,300",
    },
    {
      id: "3",
      amount: "1,400",
    },
  ]);

  const onCloseBondTokenModal = () => {
    delegateToUpdate.current = null;
    setShowBondTokenModal(false);
  };

  const onCloseCommissionUpdateModal = () => {
    setShowCommissionUpdateModal(false);
  };

  const onCloseBondDepositModal = () => {
    delegateToUpdate.current = null;
    setShowBondDepositModal(false);
  };

  const onShowBondTokenModal = (modalType: BondModalType, delegate: Delegate, symbol: string) => {
    delegateToUpdate.current = delegate;
    setTokenSymbolToUpdate(symbol);
    setBondModalType(modalType);
    setShowBondTokenModal(true);
  };

  const onShowBondDepositModal = (modalType: BondModalType, delegate: Delegate) => {
    delegateToUpdate.current = delegate;
    setBondModalType(modalType);
    setShowBondDepositModal(true);
  };

  const onShowCommissionUpdateModal = () => {
    setShowCommissionUpdateModal(true);
  };

  const onConfirmBondToken = () => {
    console.log("confirm bond token====");
  };

  const onConfirmCommissionUpdate = () => {
    console.log("confirm commission update====");
  };

  const onConfirmBondDeposit = () => {
    console.log("confirm bond token====");
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
                              onShowBondDepositModal("bondMore", row);
                              return;
                            }
                            onShowBondTokenModal("bondMore", row, item.symbol);
                          }}
                          src={plusIcon}
                          className={"clickable w-[16px]"}
                          alt="image"
                        />
                        <img
                          onClick={() => {
                            if (item.isDeposit) {
                              onShowBondDepositModal("unbond", row);
                              return;
                            }
                            onShowBondTokenModal("unbond", row, item.symbol);
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
            <Button onClick={onShowCommissionUpdateModal} className={"!h-[36px] !px-[15px]"} btnType={"secondary"}>
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
        onCancel={onCloseBondTokenModal}
        onConfirm={onConfirmBondToken}
        type={bondModalType}
        isVisible={showBondTokenModal}
        onClose={onCloseBondTokenModal}
      />
      <BondDepositModal
        bondedDeposits={bondedDeposits}
        allDeposits={allDeposits}
        onCancel={onCloseBondDepositModal}
        onConfirm={onConfirmBondDeposit}
        type={bondModalType}
        isVisible={showBondDepositModal}
        onClose={onCloseBondDepositModal}
      />
      <UpdateCommissionModal
        onCancel={onCloseCommissionUpdateModal}
        onConfirm={onConfirmCommissionUpdate}
        isVisible={showCommissionUpdateModal}
        onClose={onCloseCommissionUpdateModal}
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

interface BondTokenProps {
  symbol: string;
  type: BondModalType;
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}

/*Bond more or less tokens*/
const BondTokenModal = ({ isVisible, type, onClose, onConfirm, onCancel, symbol }: BondTokenProps) => {
  const { t } = useAppTranslation();
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const getErrorJSX = () => {
    return hasError ? <div /> : null;
  };

  useEffect(() => {
    setValue("");
    setLoading(false);
    setHasError(false);
  }, [isVisible]);

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setHasError(false);
    setValue(event.target.value);
  };

  const onConfirmBonding = () => {
    const amount = parseNumber(value);
    if (!amount) {
      setHasError(true);
      return;
    }
    setValue(amount.toString());
    console.log(amount);
    setLoading(true);
    // onConfirm();
  };

  return (
    <ModalEnhanced
      modalTitle={type === "bondMore" ? t(localeKeys.bondMore) : t(localeKeys.unbond)}
      cancelText={t(localeKeys.cancel)}
      confirmText={type === "bondMore" ? t(localeKeys.bond) : t(localeKeys.unbond)}
      onConfirm={onConfirmBonding}
      isLoading={isLoading}
      isVisible={isVisible}
      onClose={onClose}
      onCancel={onCancel}
      className={"!max-w-[400px]"}
    >
      <div className={"divider border-b pb-[15px]"}>
        {type === "unbond" && (
          <div className={"pb-[20px] mb-[20px] divider border-b text-12"}>
            {t(localeKeys.unbondTimeInfo, { unbondingTime: "14 days" })}
          </div>
        )}
        <div className={"flex flex-col gap-[10px]"}>
          <div className={"text-12-bold"}>{t(localeKeys.amount)}</div>
          <Input
            value={value}
            onChange={onInputChange}
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

interface BondDepositProps {
  type: BondModalType;
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  allDeposits: Deposit[];
  bondedDeposits: Deposit[];
}

/*Bond more or less deposits*/
const BondDepositModal = ({
  isVisible,
  type,
  onClose,
  onConfirm,
  onCancel,
  bondedDeposits,
  allDeposits,
}: BondDepositProps) => {
  const { t } = useAppTranslation();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [selectedDeposits, setSelectedDeposit] = useState<Deposit[]>([]);
  const [renderDeposits, setRenderDeposits] = useState<Deposit[]>([]);

  useEffect(() => {
    setSelectedDeposit([]);
    let deposits = [];
    if (type === "bondMore") {
      /* filter out all deposits that have already been bonded, only take the unbonded deposits */
      deposits = allDeposits.filter((item) => {
        const foundItem = bondedDeposits.find((deposit) => deposit.id === item.id);
        /* only take the deposit if it is not bonded yet */
        return !foundItem;
      });
    } else {
      /*show bonded deposits so that the user can check thm to unbond them*/
      deposits = bondedDeposits;
    }
    setRenderDeposits(deposits);
  }, [isVisible]);

  const depositRenderer = (option: Deposit) => {
    return (
      <div className={"flex justify-between"}>
        <div>ID#{option.id}</div>
        <div>{option.amount}</div>
      </div>
    );
  };

  const onDepositSelectionChange = (selectedItem: Deposit, allItems: Deposit[]) => {
    setSelectedDeposit(allItems);
  };

  return (
    <ModalEnhanced
      modalTitle={type === "bondMore" ? t(localeKeys.bondMoreDeposits) : t(localeKeys.unbondDeposits)}
      cancelText={t(localeKeys.cancel)}
      confirmText={type === "bondMore" ? t(localeKeys.bond) : t(localeKeys.unbond)}
      onConfirm={onConfirm}
      confirmLoading={isLoading}
      isVisible={isVisible}
      onClose={onClose}
      onCancel={onCancel}
      className={"!max-w-[400px]"}
    >
      <div className={"divider border-b pb-[20px]"}>
        {type === "unbond" && (
          <div className={"pb-[20px] mb-[20px] divider border-b text-12"}>
            {t(localeKeys.unbondTimeInfo, { unbondingTime: "14 days" })}
          </div>
        )}
        <div className={"flex flex-col gap-[10px] max-h-[300px] dw-custom-scrollbar"}>
          <CheckboxGroup
            options={renderDeposits}
            render={depositRenderer}
            onChange={onDepositSelectionChange}
            selectedOptions={selectedDeposits}
          />
        </div>
      </div>
    </ModalEnhanced>
  );
};

interface CommissionProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}

/*update commission*/
const UpdateCommissionModal = ({ isVisible, onClose, onConfirm, onCancel }: CommissionProps) => {
  const { t } = useAppTranslation();
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const getErrorJSX = () => {
    return hasError ? <div /> : null;
  };

  useEffect(() => {
    setValue("");
    setLoading(false);
    setHasError(false);
  }, [isVisible]);

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setHasError(false);
    setValue(event.target.value);
  };

  const onConfirmUpdate = () => {
    const percentage = parseNumber(value);
    if (!percentage) {
      setHasError(true);
      return;
    }
    setValue(percentage.toString());
    console.log(percentage);
    setLoading(true);
    // onConfirm();
  };

  return (
    <ModalEnhanced
      modalTitle={t(localeKeys.updateCommission)}
      cancelText={t(localeKeys.cancel)}
      confirmText={t(localeKeys.update)}
      onConfirm={onConfirmUpdate}
      isLoading={isLoading}
      isVisible={isVisible}
      onClose={onClose}
      onCancel={onCancel}
      className={"!max-w-[400px]"}
    >
      <div className={"divider border-b pb-[20px]"}>
        <div className={"flex flex-col gap-[10px]"}>
          <div className={"flex items-center gap-[10px]"}>
            <div className={"text-12-bold"}>{t(localeKeys.commission)}</div>
            <Tooltip message={t(localeKeys.commissionPercentInfo)}>
              <img className={"w-[16px]"} src={helpIcon} alt="image" />
            </Tooltip>
          </div>
          <Input
            value={value}
            onChange={onInputChange}
            hasErrorMessage={false}
            error={getErrorJSX()}
            leftIcon={null}
            placeholder={t(localeKeys.commission)}
          />
        </div>
      </div>
    </ModalEnhanced>
  );
};
