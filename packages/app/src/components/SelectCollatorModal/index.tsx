import { forwardRef, useImperativeHandle, useState } from "react";
import { Button, Column, Input, ModalEnhanced, Tab, Table, Tabs } from "@darwinia/ui";
import { localeKeys, useAppTranslation } from "@darwinia/app-locale";
import { Collator } from "@darwinia/app-types";
import JazzIcon from "../JazzIcon";
import copyIcon from "../../assets/images/copy.svg";
import { copyToClipboard } from "@darwinia/app-utils";

export interface SelectCollatorRefs {
  toggle: () => void;
}

interface SelectCollatorProps {
  type: string;
}

const SelectCollatorModal = forwardRef<SelectCollatorRefs, SelectCollatorProps>(({ type }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTabId, setActiveTabId] = useState<string>("1");
  const { t } = useAppTranslation();
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

  const collators: Collator[] = [
    {
      id: "0xF4b22D8a5FfCF2EdC54A9580a2BBC674839F9155",
      accountAddress: "0xF4b22D8a5FfCF2EdC54A9580a2BBC674839F9155",
      commission: 45,
      accountName: "darwinia",
      totalStaked: "34678",
      lastSessionBlocks: 67,
      isActive: true,
    },
    {
      id: "0xB4b22D8a5FfCF2EdC54A9580a2BBC674839F9156",
      accountAddress: "0xB4b22D8a5FfCF2EdC54A9580a2BBC674839F9156",
      commission: 45,
      accountName: "darwinia",
      totalStaked: "34678",
      lastSessionBlocks: 67,
      isActive: true,
    },
  ];

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
          <div className={"flex gap-[5px] items-center"}>
            <div className={"shrink-0"}>
              <JazzIcon size={20} address={row.accountAddress} />
            </div>
            <div className={"flex-1"}>{row.accountName ? row.accountName : row.accountAddress}</div>
            <div
              onClick={() => {
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
        return <div>{row.totalStaked}</div>;
      },
      width: "190px",
    },
    {
      id: "3",
      title: <div>{t(localeKeys.commission)}</div>,
      key: "commission",
      render: (row) => {
        return <div>{row.commission}%</div>;
      },
      width: "180px",
    },
    {
      id: "4",
      title: <div className={"capitalize"} dangerouslySetInnerHTML={{ __html: t(localeKeys.blocksLastSession) }} />,
      key: "totalStaked",
      render: (row) => {
        return <div>{row.totalStaked}</div>;
      },
      width: "150px",
    },
  ];

  const toggleModal = () => {
    setActiveTabId("1");
    setIsVisible((oldStatus) => !oldStatus);
  };

  const onClose = () => {
    setIsVisible(false);
  };

  const onTabChange = (selectedTab: Tab) => {
    setActiveTabId(selectedTab.id);
  };

  useImperativeHandle(ref, () => {
    return {
      toggle: toggleModal,
    };
  });

  return (
    <ModalEnhanced
      className={"!max-w-[790px]"}
      onClose={onClose}
      modalTitle={t(localeKeys.selectCollator)}
      isVisible={isVisible}
    >
      <div>
        <Tabs onChange={onTabChange} tabs={tabs} activeTabId={activeTabId} />
        {/*Tabs content*/}
        <div className={"flex flex-col gap-[10px] pt-[10px]"}>
          <div className={"flex flex-col lg:flex-row gap-[10px] lg:gap-[5px] lg:items-center"}>
            <div className={"flex-1 text-halfWhite text-12"}>{t(localeKeys.activePoolInfo)}</div>
            <div className={"w-full lg:w-[205px]"}>
              <Input className={"!h-[30px] text-12"} placeholder={t(localeKeys.searchForCollator)} />
            </div>
          </div>
          <Table
            className={"!p-[0px]"}
            maxHeight={"300px"}
            minWidth={"700px"}
            dataSource={collators}
            columns={columns}
          />
          <div className={"flex gap-[10px]"}>
            <Button>{t(localeKeys.confirm)}</Button>
            {/*<Button>{t(localeKeys.cancel)}</Button>*/}
          </div>
        </div>
      </div>
    </ModalEnhanced>
  );
});

SelectCollatorModal.displayName = "SelectCollator";

export default SelectCollatorModal;
