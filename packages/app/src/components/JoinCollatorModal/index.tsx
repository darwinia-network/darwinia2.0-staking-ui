import { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Button, Column, Input, ModalEnhanced, notification, Tab, Table, Tabs, Tooltip } from "@darwinia/ui";
import { localeKeys, useAppTranslation } from "@darwinia/app-locale";
import { Collator } from "@darwinia/app-types";
import JazzIcon from "../JazzIcon";
import copyIcon from "../../assets/images/copy.svg";
import { copyToClipboard, isValidNumber, prettifyNumber } from "@darwinia/app-utils";
import helpIcon from "../../assets/images/help.svg";
import { useStorage, useWallet } from "@darwinia/app-providers";
import BigNumber from "bignumber.js";
import { BigNumber as EthersBigNumber } from "@ethersproject/bignumber/lib/bignumber";
import { TransactionResponse } from "@ethersproject/providers";

export interface JoinCollatorRefs {
  show: () => void;
}

export interface JoinCollatorProps {
  onCollatorJoined: () => void;
}

const JoinCollatorModal = forwardRef<JoinCollatorRefs, JoinCollatorProps>(({ onCollatorJoined }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [commission, setCommission] = useState<string>("");
  const [commissionHasError, setCommissionHasError] = useState<boolean>(false);
  const [sessionKey, setSessionKey] = useState<string>("");
  const [sessionKeyHasError, setSessionKeyHasError] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const { t } = useAppTranslation();
  const { stakingContract } = useWallet();

  const showModal = () => {
    setSessionKey("");
    setCommission("");
    setSessionKeyHasError(false);
    setCommissionHasError(false);
    setLoading(false);
    setIsVisible((oldStatus) => !oldStatus);
  };

  const onClose = () => {
    setIsVisible(false);
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

  const onSetCommission = async () => {
    const isValidCommission = isValidNumber(commission);
    if (!isValidCommission) {
      notification.error({
        message: <div>{t(localeKeys.invalidCommission)}</div>,
      });
      setCommissionHasError(true);
      return;
    }

    const commissionAmount = Number(commission);
    if (commissionAmount < 0 || commissionAmount > 100) {
      setCommissionHasError(true);
      notification.error({
        message: <div>{t(localeKeys.commissionOutOfRange)}</div>,
      });
      return;
    }

    try {
      setLoading(true);
      const response = (await stakingContract?.collect(
        EthersBigNumber.from(commission.toString())
      )) as TransactionResponse;
      await response.wait(1);
      setLoading(false);
      setCommission("");
      notification.success({
        message: <div>{t(localeKeys.operationSuccessful)}</div>,
      });
    } catch (e) {
      setLoading(false);
      notification.error({
        message: <div>{t(localeKeys.somethingWrongHappened)}</div>,
      });
      console.log(e);
    }
  };

  const onSetSessionKey = () => {
    if (sessionKey.trim().length === 0) {
      setSessionKeyHasError(true);
      notification.error({
        message: <div>{t(localeKeys.invalidSessionKey)}</div>,
      });
      return;
    }

    console.log("set session key");
  };

  useImperativeHandle(ref, () => {
    return {
      show: showModal,
    };
  });

  return (
    <ModalEnhanced
      className={"!max-w-[790px]"}
      contentClassName={"h-[400px]"}
      onClose={onClose}
      modalTitle={t(localeKeys.joinCollator)}
      isVisible={isVisible}
      isCancellable={false}
      isLoading={isLoading}
    >
      <div>
        <div className={"flex flex-col gap-[10px] py-[10px]"}>
          <div
            className={"text-halfWhite text-12 divider border-b pb-[10px]"}
            dangerouslySetInnerHTML={{
              __html: t(localeKeys.howToJoinCollator, {
                runNodeUrl: "https://www.baidu.com",
                tutorialUrl: "https://www.baidu.com",
              }),
            }}
          />
          <div className={"flex flex-col gap-[10px] divider border-b pb-[10px]"}>
            <div>{t(localeKeys.sessionKey)}</div>
            <Input
              value={sessionKey}
              onChange={onSessionKeyValueChange}
              hasErrorMessage={false}
              error={getSessionKeyErrorJSX()}
              leftIcon={null}
              placeholder={t(localeKeys.sessionKey)}
            />
            <Button disabled={sessionKey.length === 0} className={"capitalize"} onClick={onSetSessionKey}>
              {t(localeKeys.setSessionKey)}
            </Button>
          </div>

          <div className={"flex flex-col gap-[10px]"}>
            <div className={"flex items-center gap-[10px]"}>
              {t(localeKeys.commission)} (%){" "}
              <Tooltip message={t(localeKeys.commissionPercentInfo)}>
                <img className={"w-[16px]"} src={helpIcon} alt="image" />
              </Tooltip>
            </div>
            <Input
              value={commission}
              onChange={onCommissionValueChange}
              hasErrorMessage={false}
              error={getCommissionErrorJSX()}
              leftIcon={null}
              placeholder={t(localeKeys.commission)}
              rightSlot={<div className={"flex items-center px-[10px] text-white"}>%</div>}
            />
            <Button disabled={commission.length === 0} className={"capitalize"} onClick={onSetCommission}>
              {t(localeKeys.setCommission)}
            </Button>
          </div>
        </div>
      </div>
    </ModalEnhanced>
  );
});

JoinCollatorModal.displayName = "JoinCollator";

export default JoinCollatorModal;
