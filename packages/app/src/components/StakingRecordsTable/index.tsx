import {
  Button,
  Column,
  Table,
  Tooltip,
  Popover,
  ModalEnhanced,
  Input,
  CheckboxGroup,
  notification,
} from "@darwinia/ui";
import { localeKeys, useAppTranslation } from "@darwinia/app-locale";
import { useStorage, useWallet } from "@darwinia/app-providers";
import JazzIcon from "../JazzIcon";
import warningIcon from "../../assets/images/warning.svg";
import plusIcon from "../../assets/images/plus-square.svg";
import minusIcon from "../../assets/images/minus-square.svg";
import helpIcon from "../../assets/images/help.svg";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Deposit, Delegate } from "@darwinia/app-types";
import { formatToWei, isValidNumber, prettifyNumber } from "@darwinia/app-utils";
import BigNumber from "bignumber.js";
import { BigNumber as EthersBigNumber } from "ethers";
import { TransactionResponse } from "@ethersproject/providers";
import SelectCollatorModal, { SelectCollatorRefs } from "../SelectCollatorModal";

const StakingRecordsTable = () => {
  const selectCollatorModalRef = useRef<SelectCollatorRefs>(null);
  const { t } = useAppTranslation();
  const { selectedNetwork } = useWallet();
  const { stakedAssetDistribution } = useStorage();
  const [showBondTokenModal, setShowBondTokenModal] = useState<boolean>(false);
  const [showSessionKeyUpdateModal, setShowSessionKeyUpdateModal] = useState<boolean>(false);
  const [showUndelegateModal, setShowUndelegateModal] = useState<boolean>(false);
  const [showBondDepositModal, setShowBondDepositModal] = useState<boolean>(false);
  const [bondModalType, setBondModalType] = useState<BondModalType>("bondMore");
  const [tokenSymbolToUpdate, setTokenSymbolToUpdate] = useState<string>("RING");
  const delegateToUpdate = useRef<Delegate | null>(null);
  const { deposits, stakedDepositsIds, calculatePower } = useStorage();
  const [dataSource, setDataSource] = useState<Delegate[]>([]);

  const onCloseBondTokenModal = () => {
    delegateToUpdate.current = null;
    setShowBondTokenModal(false);
  };

  const onCloseSessionKeyUpdateModal = () => {
    setShowSessionKeyUpdateModal(false);
  };

  const onCloseUndelegateModal = () => {
    setShowUndelegateModal(false);
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

  const onShowUndelegateModal = (delegate: Delegate) => {
    delegateToUpdate.current = delegate;
    // trigger click to auto close the popover
    document.body.click();
    setShowUndelegateModal(true);
  };

  const onConfirmBondToken = () => {
    console.log("confirm bond token======");
  };

  const onConfirmSessionKeyUpdate = () => {
    console.log("confirm session key update====");
  };

  const onConfirmUndelegation = () => {
    console.log("confirm undelegation======");
  };

  const onConfirmBondDeposit = () => {
    console.log("confirm bond token======");
  };

  const onCancelDepositUnbonding = () => {
    console.log("cancel deposit unbonding====");
  };

  const onCancelTokenUnbonding = () => {
    console.log("cancel token unbonding====");
  };

  const onReleaseDeposit = () => {
    console.log("release deposit=====");
  };

  const onReleaseToken = () => {
    console.log("release token=====");
  };

  const onShowSelectCollatorModal = () => {
    selectCollatorModalRef.current?.toggle();
  };

  const onCollatorSelected = () => {
    selectCollatorModalRef.current?.toggle();
  };

  useEffect(() => {
    if (!selectedNetwork || !stakedAssetDistribution) {
      return;
    }
    const stakedRing = stakedAssetDistribution.ring.bonded;
    const stakedDeposits = stakedAssetDistribution.ring.totalStakingDeposit ?? BigNumber(0);
    /* This is supposed to be the total amount of power invested in a certain collator
     * but for now since the user can only choose one collator, here it will only show the
     * total power that has been used in staking */
    const totalStakedPower = calculatePower({
      kton: stakedAssetDistribution.kton.bonded,
      ring: stakedRing.plus(stakedDeposits),
    });

    setDataSource([
      {
        id: "1",
        collator: "chchainkoney.com",
        previousReward: "0/0",
        staked: totalStakedPower,
        bondedTokens: [
          {
            amount: stakedAssetDistribution.ring.bonded,
            symbol: selectedNetwork?.ring.symbol ?? "",
            isDeposit: false,
          },
          {
            amount: stakedAssetDistribution.ring.totalStakingDeposit ?? BigNumber(0),
            symbol: selectedNetwork?.ring.symbol ?? "",
            isDeposit: true,
          },
          {
            amount: stakedAssetDistribution.kton.bonded,
            symbol: selectedNetwork?.kton.symbol ?? "",
            isDeposit: false,
          },
        ],
        isMigrated: false,
        canChangeCollator: true,
      },
    ]);
  }, [selectedNetwork, stakedAssetDistribution]);

  const columns: Column<Delegate>[] = [
    {
      id: "1",
      title: <div>{t(localeKeys.collator)}</div>,
      key: "collator",
      render: (row) => {
        if (row.isMigrated) {
          return (
            <Button
              onClick={() => {
                onShowSelectCollatorModal();
              }}
              btnType={"secondary"}
              className={"!px-[15px] !h-[30px]"}
            >
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
              <div className={"text-halfWhite"}>
                {prettifyNumber({
                  number: row.staked,
                  precision: 0,
                  shouldFormatToEther: false,
                })}
              </div>
              <Tooltip message={t(localeKeys.powerNotWorking)}>
                <img className={"w-[20px]"} src={helpIcon} alt="image" />
              </Tooltip>
            </div>
          );
        }

        return (
          <div>
            {prettifyNumber({
              number: row.staked,
              precision: 0,
              shouldFormatToEther: false,
            })}
          </div>
        );
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
              let message: JSX.Element = <div />;
              if (item.isDeposit) {
                // create a message for unbonding deposits
                message = (
                  <div className={"flex flex-col gap-[10px] text-14-bold !text-[10px] !leading-[15px]"}>
                    <div>
                      {t(localeKeys.depositsToBeReleased, { amount: "11", token: "RING", timeLeft: "7 days" })}
                      <span
                        onClick={() => {
                          onCancelDepositUnbonding();
                        }}
                        className={"text-primary pl-[8px] clickable"}
                      >
                        {t(localeKeys.cancelUnbonding)}
                      </span>
                    </div>
                    <div>
                      {t(localeKeys.depositsReadyToRelease, { amount: "11 RING" })}
                      <span
                        onClick={() => {
                          onReleaseDeposit();
                        }}
                        className={"text-primary clickable"}
                      >
                        &nbsp;{t(localeKeys.releaseThem)}&nbsp;
                      </span>
                      {t(localeKeys.toTermDeposit)}
                    </div>
                  </div>
                );
              } else {
                // create a message for unbonding RING
                message = (
                  <div className={"flex flex-col gap-[10px] text-14-bold !text-[10px] !leading-[15px]"}>
                    <div>
                      {t(localeKeys.tokensToBeReleased, { amount: "11 RING", timeLeft: "7 days" })}
                      <span
                        onClick={() => {
                          onCancelTokenUnbonding();
                        }}
                        className={"text-primary pl-[8px] clickable"}
                      >
                        {t(localeKeys.cancelUnbonding)}
                      </span>
                    </div>
                    <div>
                      {t(localeKeys.tokensReadyToRelease, { amount: "11 RING" })}
                      <span
                        onClick={() => {
                          onReleaseToken();
                        }}
                        className={"text-primary pl-[8px] clickable"}
                      >
                        {t(localeKeys.releaseNow)}
                      </span>
                    </div>
                  </div>
                );
              }
              const bondJSX = (
                <div className={"flex gap-[5px]"}>
                  <div>
                    <>
                      {prettifyNumber({
                        number: item.amount,
                        precision: 6,
                        shouldFormatToEther: true,
                      })}{" "}
                      {item.isDeposit ? t(localeKeys.deposit) : ""} {item.symbol.toUpperCase()}
                    </>
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
              return (
                <div className={"flex"} key={`${row.collator}-${index}`}>
                  <Tooltip extendTriggerToPopover={true} offset={[0, 0]} message={message}>
                    {bondJSX}
                  </Tooltip>
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

        const options = (
          <div className={"flex items-end flex-col gap-[5px]"}>
            <Button
              onClick={() => {
                onShowUndelegateModal(row);
              }}
              btnType={"secondary"}
            >
              {t(localeKeys.undelegate)}
            </Button>
          </div>
        );
        return (
          <div className={"flex gap-[10px]"}>
            <Button
              onClick={() => {
                onShowSelectCollatorModal();
              }}
              className={"!h-[36px] !px-[15px]"}
              btnType={"secondary"}
            >
              {t(localeKeys.changeCollator)}
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
        <Table
          headerSlot={<div className={"text-14-bold pb-[10px]"}>{t(localeKeys.stakingDelegations)}</div>}
          noDataText={t(localeKeys.noDelegations)}
          dataSource={dataSource}
          columns={columns}
        />
      </div>
      <SelectCollatorModal ref={selectCollatorModalRef} onCollatorSelected={onCollatorSelected} type={"update"} />
      <BondTokenModal
        symbol={tokenSymbolToUpdate}
        onCancel={onCloseBondTokenModal}
        onConfirm={onConfirmBondToken}
        type={bondModalType}
        isVisible={showBondTokenModal}
        onClose={onCloseBondTokenModal}
      />
      <BondDepositModal
        bondedDeposits={stakedDepositsIds ?? []}
        allDeposits={deposits ?? []}
        onCancel={onCloseBondDepositModal}
        onConfirm={onConfirmBondDeposit}
        type={bondModalType}
        isVisible={showBondDepositModal}
        onClose={onCloseBondDepositModal}
      />
      <UpdateSessionKeyModal
        onCancel={onCloseSessionKeyUpdateModal}
        onConfirm={onConfirmSessionKeyUpdate}
        isVisible={showSessionKeyUpdateModal}
        onClose={onCloseSessionKeyUpdateModal}
      />
      <UndelegationModal
        delegation={delegateToUpdate.current}
        onCancel={onCloseUndelegateModal}
        onConfirm={onConfirmUndelegation}
        isVisible={showUndelegateModal}
        onClose={onCloseUndelegateModal}
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
  const { balance, calculatePower } = useStorage();
  const { selectedNetwork } = useWallet();
  const [power, setPower] = useState<BigNumber>(BigNumber(0));
  const isRing = symbol.toLowerCase().includes("ring");

  const getErrorJSX = () => {
    return hasError ? <div /> : null;
  };

  useEffect(() => {
    setValue("");
    setPower(BigNumber(0));
    setLoading(false);
    setHasError(false);
  }, [isVisible]);

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setHasError(false);
    const value = event.target.value;
    const isValidAmount = isValidNumber(value);
    if (isValidAmount) {
      const ringAmount = isRing ? BigNumber(formatToWei(value).toString()) : BigNumber(0);
      const ktonAmount = isRing ? BigNumber(0) : BigNumber(formatToWei(value).toString());
      const power = calculatePower({
        ring: ringAmount,
        kton: ktonAmount,
      });
      setPower(power);
    } else {
      setPower(BigNumber(0));
    }
    setValue(event.target.value);
  };

  const onConfirmBonding = () => {
    const isValidAmount = isValidNumber(value);
    if (!isValidAmount) {
      if (isRing) {
        notification.error({
          message: <div>{t(localeKeys.invalidRingAmount, { ringSymbol: selectedNetwork?.ring.symbol })}</div>,
        });
      } else {
        notification.error({
          message: <div>{t(localeKeys.invalidKtonAmount, { ktonSymbol: selectedNetwork?.kton.symbol })}</div>,
        });
      }
      setHasError(true);
      return;
    }
    setValue(value);
    console.log(value);
    setLoading(true);
    // onConfirm();
  };

  const balanceAmount = isRing ? balance?.ring ?? BigNumber(0) : balance?.kton ?? BigNumber(0);

  return (
    <ModalEnhanced
      modalTitle={type === "bondMore" ? t(localeKeys.bondMore) : t(localeKeys.unbond)}
      cancelText={t(localeKeys.cancel)}
      confirmText={type === "bondMore" ? t(localeKeys.bond) : t(localeKeys.unbond)}
      onConfirm={onConfirmBonding}
      isLoading={isLoading}
      isCancellable={false}
      isVisible={isVisible}
      onClose={onClose}
      onCancel={onCancel}
      className={"!max-w-[400px]"}
      confirmDisabled={value === ""}
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
            bottomTip={
              <div className={"text-primary"}>
                {type === "bondMore" ? "+" : "-"}
                {prettifyNumber({
                  number: power,
                  precision: 0,
                  shouldFormatToEther: false,
                })}{" "}
                {t(localeKeys.power)}
              </div>
            }
            leftIcon={null}
            placeholder={t(localeKeys.balanceAmount, {
              amount: prettifyNumber({
                number: balanceAmount,
                precision: 6,
                shouldFormatToEther: true,
              }),
            })}
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
  bondedDeposits: number[];
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
    setLoading(false);
    let deposits: Deposit[] = [];
    if (type === "bondMore") {
      /* filter out all deposits that have already been bonded, only take the unbonded deposits */
      deposits = allDeposits.filter((item) => {
        /* only take the deposit if it is not bonded yet */
        return !bondedDeposits.includes(item.id);
      });
    } else {
      /*show bonded deposits so that the user can check them to unbond them*/
      deposits = allDeposits.filter((item) => {
        return bondedDeposits.includes(item.id);
      });
    }
    setRenderDeposits(deposits);
  }, [isVisible]);

  const depositRenderer = (option: Deposit) => {
    return (
      <div className={"flex justify-between"}>
        <div>ID#{option.id}</div>
        <div>
          {prettifyNumber({
            number: option.value,
            precision: 3,
          })}
        </div>
      </div>
    );
  };

  const onDepositSelectionChange = (selectedItem: Deposit, allItems: Deposit[]) => {
    setSelectedDeposit(allItems);
  };

  const onConfirmUndelegate = () => {
    onConfirm();
  };

  return (
    <ModalEnhanced
      modalTitle={type === "bondMore" ? t(localeKeys.bondMoreDeposits) : t(localeKeys.unbondDeposits)}
      cancelText={t(localeKeys.cancel)}
      confirmText={type === "bondMore" ? t(localeKeys.bond) : t(localeKeys.unbond)}
      onConfirm={onConfirmUndelegate}
      confirmLoading={isLoading}
      isCancellable={false}
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

interface SessionKeyProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}
/*update session key*/
const UpdateSessionKeyModal = ({ isVisible, onClose, onConfirm, onCancel }: SessionKeyProps) => {
  const { t } = useAppTranslation();
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    setValue("");
    setLoading(false);
    setHasError(false);
  }, [isVisible]);

  const onInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setHasError(false);
    setValue(event.target.value);
  };

  const onConfirmUpdate = () => {
    const sessionKey = value.trim();
    if (sessionKey.length === 0) {
      setHasError(true);
      notification.error({
        message: <div>{t(localeKeys.invalidSessionKey)}</div>,
      });
      return;
    }

    console.log(sessionKey);
    setLoading(true);
    // onConfirm();
  };

  return (
    <ModalEnhanced
      modalTitle={t(localeKeys.updateSessionKey)}
      cancelText={t(localeKeys.cancel)}
      confirmText={t(localeKeys.update)}
      onConfirm={onConfirmUpdate}
      isLoading={isLoading}
      isCancellable={false}
      isVisible={isVisible}
      onClose={onClose}
      onCancel={onCancel}
      confirmDisabled={value.length === 0}
      className={"!max-w-[400px]"}
    >
      <div className={"divider border-b pb-[20px]"}>
        <div className={"flex flex-col gap-[10px]"}>
          <div className={"flex items-center gap-[10px]"}>
            <div className={"text-12-bold"}>{t(localeKeys.sessionKey)}</div>
          </div>
          <textarea
            value={value}
            placeholder={t(localeKeys.sessionKey)}
            onChange={onInputChange}
            className={`bg-blackSecondary resize-none ${
              hasError ? "border-[red]" : "border-white"
            } border h-[180px] py-[2px] px-[10px]`}
          />
        </div>
      </div>
    </ModalEnhanced>
  );
};

interface UndelegationProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  delegation: Delegate | null;
}

/*Bond more or less deposits*/
const UndelegationModal = ({ isVisible, onClose, onConfirm, onCancel }: UndelegationProps) => {
  const { t } = useAppTranslation();
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(false);
  }, [isVisible]);

  const onConfirmUndelegation = () => {
    onConfirm();
  };

  return (
    <ModalEnhanced
      modalTitle={t(localeKeys.sureToUndelegate)}
      cancelText={t(localeKeys.cancel)}
      confirmText={t(localeKeys.undelegate)}
      onConfirm={onConfirmUndelegation}
      confirmLoading={isLoading}
      isCancellable={false}
      isVisible={isVisible}
      onClose={onClose}
      onCancel={onCancel}
      className={"!max-w-[400px]"}
    >
      <div className={"pb-[20px] divider border-b text-12"}>
        {t(localeKeys.undelegationConfirmInfo, { unbondingTime: "14 days" })}
      </div>
    </ModalEnhanced>
  );
};
