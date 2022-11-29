import metamaskLogo from "../../assets/images/metamask-logo.svg";
import { Button } from "@darwinia/ui";
import { useWallet } from "@darwinia/app-wallet";
import { useAppTranslation, localeKeys } from "@package/app-locale";

const ConnectWallet = ({ onConnected }: { onConnected: () => void }) => {
  const { t } = useAppTranslation();
  const { connectWallet } = useWallet();
  const onConnectWallet = () => {
    connectWallet();
    // onConnected();
  };
  return (
    <div
      className={
        "card lg:min-h-[25rem] lg:px-[18.625rem] flex flex-col justify-center items-center gap-[0.9375rem] lg:gap-[1.875reem]"
      }
    >
      <div className={"w-[5.3125rem] h-[5.3125rem]"}>
        <img className={"w-full"} src={metamaskLogo} alt="image" />
      </div>
      <div>
        <Button className={"px-[0.9375rem]"} onClick={onConnectWallet}>
          {t(localeKeys.connectMetamask)}
        </Button>
      </div>
      <div className={"text-center"}>{t(localeKeys.loginInfo)}</div>
    </div>
  );
};

export default ConnectWallet;
