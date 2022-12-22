import { Button, Column, Table, Tooltip, ModalEnhanced } from "@darwinia/ui";
import { localeKeys, useAppTranslation } from "@darwinia/app-locale";
import { useWallet } from "@darwinia/app-providers";
import helpIcon from "../../assets/images/help.svg";
import { useEffect, useRef, useState } from "react";
import { Deposit } from "@darwinia/app-types";
import { formatDate } from "@darwinia/app-utils";

const DepositRecordsTable = () => {
  const { t } = useAppTranslation();
  const { selectedNetwork } = useWallet();
  const [showEarlyWithdrawModal, setShowEarlyWithdrawModal] = useState<boolean>(false);
  const depositToWithdraw = useRef<Deposit | null>(null);

  const onCloseEarlyWithdrawModal = () => {
    setShowEarlyWithdrawModal(false);
  };

  const onShowEarlyWithdrawModal = (deposit: Deposit) => {
    depositToWithdraw.current = deposit;
    setShowEarlyWithdrawModal(true);
  };

  const onConfirmWithdraw = () => {
    console.log("confirm withdraw======");
  };

  const onConfirmEarlyWithdraw = () => {
    console.log("confirm early withdraw======");
  };

  const dataSource: Deposit[] = [
    {
      id: "1",
      amount: "200",
      endTime: "1671926400000",
      startTime: "1669852800000",
      reward: "1234",
      isTimeOver: false,
    },
    {
      id: "2",
      amount: "200",
      endTime: "1671926400000",
      startTime: "1669852800000",
      reward: "1234",
      isTimeOver: false,
    },
    {
      id: "3",
      amount: "200",
      endTime: "1671926400000",
      startTime: "1669852800000",
      reward: "1234",
      isTimeOver: false,
    },
    {
      id: "4",
      amount: "200",
      endTime: "1671926400000",
      startTime: "1669852800000",
      reward: "1234",
      isTimeOver: false,
    },
    {
      id: "5",
      amount: "200",
      endTime: "1671926400000",
      startTime: "1669852800000",
      reward: "1234",
      isTimeOver: false,
    },
  ];

  const columns: Column<Deposit>[] = [
    {
      id: "1",
      title: <div>{t(localeKeys.serialNumber)}</div>,
      key: "id",
      render: (row) => {
        return (
          <a target={"_blank"} className={"text-primary"} href="#">
            ID# {row.id}
          </a>
        );
      },
      width: "150px",
    },
    {
      id: "2",
      title: <div>{t(localeKeys.duration)}</div>,
      key: "startTime",
      width: "350px",
      render: (row) => {
        const startDate = formatDate(Number(row.startTime));
        const endDate = formatDate(Number(row.endTime));
        const totalTimeRange = Number(row.endTime) - Number(row.startTime);
        const timeRangeSoFar = new Date().getTime() - Number(row.startTime);
        const percentage = (timeRangeSoFar / totalTimeRange) * 100;

        return (
          <div className={"flex flex-col gap-[3px]"}>
            <div>
              {startDate} - {endDate}
            </div>
            <div className={"bg-[rgba(255,0,31,0.3)] w-full h-[4px] rounded-[2px] relative"}>
              <div
                style={{ width: `${percentage}%` }}
                className={"absolute rounded-[2px] left-0 top-0 h-full bg-primary"}
              />
            </div>
          </div>
        );
      },
    },
    {
      id: "3",
      title: <div>{t(localeKeys.amount)}</div>,
      key: "amount",
      render: (row) => {
        return (
          <div>
            {row.amount} {selectedNetwork?.ring.symbol.toUpperCase()}
          </div>
        );
      },
    },
    {
      id: "4",
      title: <div>{t(localeKeys.reward)}</div>,
      key: "reward",
      render: (row) => {
        return (
          <div>
            {row.reward} {selectedNetwork?.kton.symbol.toUpperCase()}
          </div>
        );
      },
    },
    {
      id: "5",
      title: <div>{t(localeKeys.action)}</div>,
      key: "reward",
      width: "240px",
      render: (row) => {
        return (
          <div className={"flex items-center gap-[10px]"}>
            <Button
              onClick={() => {
                onShowEarlyWithdrawModal(row);
              }}
              btnType={"secondary"}
              className={"!h-[30px]"}
            >
              {t(localeKeys.withdrawEarlier)}
            </Button>
            <Tooltip message={t(localeKeys.earlyWithdrawMessage)}>
              <img className={"w-[16px]"} src={helpIcon} alt="image" />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <div className={"flex flex-col"}>
      <div className={"flex flex-col mt-[20px]"}>
        <Table
          headerSlot={<div className={"text-14-bold pb-[10px]"}>{t(localeKeys.activeDepositRecords)}</div>}
          noDataText={t(localeKeys.noDepositRecords)}
          dataSource={dataSource}
          columns={columns}
        />
      </div>
      <EarlyWithdrawModal
        onCancel={onCloseEarlyWithdrawModal}
        onConfirm={onConfirmEarlyWithdraw}
        isVisible={showEarlyWithdrawModal}
        onClose={onCloseEarlyWithdrawModal}
        deposit={depositToWithdraw.current}
      />
    </div>
  );
};

export default DepositRecordsTable;

interface EarlyWithdrawProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  deposit: Deposit | null;
}

const EarlyWithdrawModal = ({ isVisible, onClose, onConfirm, onCancel, deposit }: EarlyWithdrawProps) => {
  const { t } = useAppTranslation();
  const [isLoading, setLoading] = useState<boolean>(false);
  const { selectedNetwork, depositContract } = useWallet();

  useEffect(() => {
    setLoading(false);

    const estimateGas = async () => {
      const gasFee = await depositContract?.estimateGas.claim();
      console.log("gasFee=====", gasFee);
    };

    if (isVisible) {
      // estimate gas fee
      estimateGas().catch((e) => {
        console.log(e);
      });
    }
  }, [isVisible]);

  const onConfirmWithdraw = () => {
    onConfirm();
  };

  const fineAmount = 5.67;

  return (
    <ModalEnhanced
      modalTitle={t(localeKeys.sureToWithdraw)}
      cancelText={t(localeKeys.cancel)}
      confirmText={t(localeKeys.payAmount, { amount: `${fineAmount} ${selectedNetwork?.kton.symbol.toUpperCase()}` })}
      onConfirm={onConfirmWithdraw}
      confirmLoading={isLoading}
      isVisible={isVisible}
      onClose={onClose}
      onCancel={onCancel}
      className={"!max-w-[400px]"}
    >
      <div className={"pb-[20px] divider border-b text-12"}>
        {t(localeKeys.earlyWithdrawInfo, {
          ktonSymbol: selectedNetwork?.kton.symbol.toUpperCase(),
          ringSymbol: selectedNetwork?.ring.symbol.toUpperCase(),
        })}
      </div>
    </ModalEnhanced>
  );
};
