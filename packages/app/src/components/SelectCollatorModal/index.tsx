import { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Button, Column, Input, ModalEnhanced, Tab, Table, Tabs, Tooltip } from "@darwinia/ui";
import { localeKeys, useAppTranslation } from "@darwinia/app-locale";
import { Collator } from "@darwinia/app-types";
import JazzIcon from "../JazzIcon";
import copyIcon from "../../assets/images/copy.svg";
import { copyToClipboard, isValidNumber, prettifyNumber } from "@darwinia/app-utils";
import helpIcon from "../../assets/images/help.svg";
import { useStorage } from "@darwinia/app-providers";

export interface SelectCollatorRefs {
  toggle: () => void;
}

interface SelectCollatorProps {
  type: "set" | "update";
  onCollatorSelected: (collator: Collator) => void;
  selectedCollator?: Collator;
}

const SelectCollatorModal = forwardRef<SelectCollatorRefs, SelectCollatorProps>(
  ({ type, selectedCollator, onCollatorSelected }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [activeTabId, setActiveTabId] = useState<string>("1");
    const [keywords, setKeywords] = useState<string>("");
    const [selectedRowsIds, setSelectedRowsIds] = useState<string[]>([]);
    const selectedCollatorsList = useRef<Collator[]>([]);
    const [commission, setCommission] = useState<string>("");
    const [commissionHasError, setCommissionHasError] = useState<boolean>(false);
    const [sessionKey, setSessionKey] = useState<string>("");
    const [sessionKeyHasError, setSessionKeyHasError] = useState<boolean>(false);
    const { t } = useAppTranslation();
    const { collators } = useStorage();

    useEffect(() => {
      if (selectedCollator) {
        selectedCollatorsList.current = [{ ...selectedCollator }];
      }
    }, []);

    const tabs: Tab[] = [
      {
        id: "1",
        title: t(localeKeys.activePool),
      },
      {
        id: "2",
        title: t(localeKeys.waitingPool),
      },
      {
        id: "3",
        title: t(localeKeys.joinCollator),
      },
    ];

    const visibleCollators = useMemo(() => {
      if (activeTabId !== "1" && activeTabId !== "2") {
        return [];
      }
      const isActive = activeTabId === "1";
      let filteredCollators: Collator[] = [];
      if (isActive) {
        filteredCollators =
          collators?.filter((item) => {
            return (
              item.isActive &&
              (item.accountAddress.toLowerCase().includes(keywords.toLowerCase()) ||
                item.accountName?.toLowerCase().includes(keywords.toLowerCase()))
            );
          }) ?? [];
      } else {
        filteredCollators =
          collators?.filter((item) => {
            return (
              !item.isActive &&
              (item.accountAddress.toLowerCase().includes(keywords.toLowerCase()) ||
                item.accountName?.toLowerCase().includes(keywords.toLowerCase()))
            );
          }) ?? [];
      }
      return filteredCollators;
    }, [activeTabId, keywords, collators]);

    useEffect(() => {
      if (activeTabId === "1" || activeTabId === "2") {
        setKeywords("");
      }
    }, [activeTabId]);

    const onCopyCollator = (item: Collator) => {
      copyToClipboard(item.accountAddress);
      console.log(item);
    };

    const columns: Column<Collator>[] = [
      {
        id: "1",
        title: <div>{t(localeKeys.collator)}</div>,
        key: "accountAddress",
        render: (row) => {
          return (
            <div className={"flex gap-[5px] items-center flex-ellipsis"}>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className={"shrink-0"}
              >
                <JazzIcon size={20} address={row.accountAddress} />
              </div>
              <div className={"flex-1 cursor-default clickable"}>
                {row.accountName ? row.accountName : row.accountAddress}
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onCopyCollator(row);
                }}
                className={"shrink-0 clickable"}
              >
                <img className={"w-[16px]"} src={copyIcon} alt="copy" />
              </div>
            </div>
          );
        },
      },
      {
        id: "2",
        title: <div className={"w-[150px]"}>{t(localeKeys.totalStaked)}</div>,
        key: "totalStaked",
        render: (row) => {
          return (
            <div>
              {prettifyNumber({
                number: row.totalStaked,
                shouldFormatToEther: false,
                precision: 0,
              })}
            </div>
          );
        },
        width: "190px",
      },
      {
        id: "3",
        title: <div>{t(localeKeys.commission)}</div>,
        key: "commission",
        render: (row) => {
          return <div>{row.commission}</div>;
        },
        width: "180px",
      },
      {
        id: "4",
        title: <div className={"capitalize"} dangerouslySetInnerHTML={{ __html: t(localeKeys.blocksLastSession) }} />,
        key: "totalStaked",
        render: (row) => {
          return <div>{row.lastSessionBlocks}</div>;
        },
        width: "150px",
      },
    ];

    const toggleModal = () => {
      setSessionKey("");
      setCommission("");
      setSessionKeyHasError(false);
      setCommissionHasError(false);
      setActiveTabId("1");
      setIsVisible((oldStatus) => !oldStatus);
    };

    const onClose = () => {
      setIsVisible(false);
    };

    const onTabChange = (selectedTab: Tab) => {
      setActiveTabId(selectedTab.id);
    };

    const onCollatorRowClick = (row: Collator) => {
      // currently, we only support selecting one collator
      selectedCollatorsList.current = [{ ...row }];
      setSelectedRowsIds([row.id]);
      if (type === "set") {
        /*if the dialog is opened in the set mode, close it immediately after the
         * user has picked the collator, if he is on the update mode, then the
         * dialog will be closed after the user has signed the transaction on MetaMask */
        onCollatorSelected(row);
        onClose();
        return;
      }
    };

    const onCommissionValueChange = (event: ChangeEvent<HTMLInputElement>) => {
      setCommissionHasError(false);
      setCommission(event.target.value);
    };

    const getCommissionErrorJSX = () => {
      return commissionHasError ? <div /> : null;
    };

    const onSessionKeyValueChange = (event: ChangeEvent<HTMLInputElement>) => {
      setSessionKeyHasError(false);
      setSessionKey(event.target.value);
    };

    const getSessionKeyErrorJSX = () => {
      return sessionKeyHasError ? <div /> : null;
    };

    const onJoinCollator = () => {
      if (sessionKey.trim().length === 0) {
        setSessionKeyHasError(true);
        return;
      }

      const isValidCommission = isValidNumber(commission);
      if (!isValidCommission) {
        setCommissionHasError(true);
        return;
      }
      console.log("join collator");
    };

    useImperativeHandle(ref, () => {
      return {
        toggle: toggleModal,
      };
    });

    return (
      <ModalEnhanced
        className={"!max-w-[790px]"}
        contentClassName={"h-[421px]"}
        onClose={onClose}
        modalTitle={t(localeKeys.selectCollator)}
        isVisible={isVisible}
      >
        <div>
          <Tabs onChange={onTabChange} tabs={tabs} activeTabId={activeTabId} />
          {/*Tabs content*/}
          {(activeTabId === "1" || activeTabId === "2") && (
            <div className={"flex flex-col gap-[10px] pt-[10px]"}>
              <div className={"flex flex-col lg:flex-row gap-[10px] lg:gap-[5px] lg:items-center"}>
                <div className={"flex-1 text-halfWhite text-12"}>
                  {activeTabId === "1" ? t(localeKeys.activePoolInfo) : ""}
                </div>
                <div className={"w-full lg:w-[205px]"}>
                  <Input
                    onChange={(e) => {
                      setKeywords(e.target.value);
                    }}
                    value={keywords}
                    className={"!h-[30px] text-12"}
                    placeholder={t(localeKeys.searchForCollator)}
                  />
                </div>
              </div>
              <Table
                className={"!p-[0px]"}
                maxHeight={"300px"}
                minWidth={"700px"}
                dataSource={visibleCollators}
                columns={columns}
                selectedRowsIds={selectedRowsIds}
                selectedRowClass={"bg-primary"}
                onRowClick={onCollatorRowClick}
              />
              {type === "update" && (
                <div className={"flex gap-[10px]"}>
                  <Button>{t(localeKeys.confirm)}</Button>
                  {/*<Button>{t(localeKeys.cancel)}</Button>*/}
                </div>
              )}
            </div>
          )}
          {activeTabId === "3" && (
            <div>
              <div className={"flex flex-col gap-[10px] py-[10px]"}>
                <div>{t(localeKeys.sessionKey)}</div>
                <div>
                  <Input
                    value={sessionKey}
                    onChange={onSessionKeyValueChange}
                    hasErrorMessage={false}
                    error={getSessionKeyErrorJSX()}
                    leftIcon={null}
                    placeholder={t(localeKeys.sessionKey)}
                  />
                </div>
                <div
                  className={"text-halfWhite text-12"}
                  dangerouslySetInnerHTML={{
                    __html: t(localeKeys.howToJoinCollator, { url: "https://www.baidu.com" }),
                  }}
                />
                <div className={"flex items-center gap-[10px]"}>
                  {t(localeKeys.commission)} (%){" "}
                  <Tooltip message={t(localeKeys.commissionPercentInfo)}>
                    <img className={"w-[16px]"} src={helpIcon} alt="image" />
                  </Tooltip>
                </div>
                <div>
                  <Input
                    value={commission}
                    onChange={onCommissionValueChange}
                    hasErrorMessage={false}
                    error={getCommissionErrorJSX()}
                    leftIcon={null}
                    placeholder={t(localeKeys.commission)}
                    rightSlot={<div className={"flex items-center px-[10px] text-white"}>%</div>}
                  />
                </div>
                <Button onClick={onJoinCollator}>{t(localeKeys.joinCollator)}</Button>
              </div>
            </div>
          )}
        </div>
      </ModalEnhanced>
    );
  }
);

SelectCollatorModal.displayName = "SelectCollator";

export default SelectCollatorModal;
