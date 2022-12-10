import { Link, useLocation, useNavigation, useSearchParams } from "react-router-dom";
import logoIcon from "../../assets/images/logo.png";
import menuToggleIcon from "../../assets/images/menu-toggle.svg";
import closeIcon from "../../assets/images/close.svg";
import { useEffect, useState } from "react";
import { Button, Drawer } from "@darwinia/ui";
import { useAppTranslation, localeKeys } from "@package/app-locale";
import { useWallet } from "@darwinia/app-wallet";
import { supportedNetworks } from "@darwinia/app-config";
import { ChainConfig } from "@darwinia/app-types";

const Header = () => {
  const [isDrawerVisible, setDrawerVisibility] = useState(false);
  const { t } = useAppTranslation();
  const { selectedNetwork, changeSelectedNetwork } = useWallet();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  /* use the first network by default */
  useEffect(() => {
    changeConnectedNetwork(supportedNetworks[1]);
  }, []);

  useEffect(() => {
    if (!selectedNetwork) {
      return;
    }

    searchParams.set("network", selectedNetwork.name);
    setSearchParams(searchParams);
  }, [selectedNetwork]);

  const toggleMobileNavigation = () => {
    setDrawerVisibility((isVisible) => !isVisible);
  };

  const changeConnectedNetwork = (network: ChainConfig) => {
    changeSelectedNetwork(network);
  };

  const onDrawerClosed = () => {
    setDrawerVisibility(false);
  };
  return (
    <div className={`shrink-0 h-[66px] lg:h-[60px] w-full z-[50]`}>
      <div className={"justify-center flex h-full wrapper-padding"}>
        <div className={"app-container w-full"}>
          <div className={"flex flex-1 h-full shrink-0 items-center justify-between"}>
            {/*Logo*/}
            <div className={"shrink-0 h-full"}>
              <Link className={"h-full flex"} to={`/staking${location.search}`}>
                <img className={"self-center w-[146px]"} src={logoIcon} alt="image" />
              </Link>
            </div>
            {/*PC network switch and wallet connection*/}
            <div className={"hidden lg:flex items-center gap-[40px]"}>
              {supportedNetworks.map((network) => {
                const activeNetworkClass = network.name === selectedNetwork?.name ? `after:block` : `after:hidden`;
                return (
                  <div
                    onClick={() => {
                      changeConnectedNetwork(network);
                    }}
                    className={`cursor-pointer relative h-[36px] flex items-center after:absolute after:left-0 after:right-0 after:h-[4px] after:bottom-0 after:bg-primary ${activeNetworkClass}`}
                    key={`${network.name}-${network.displayName}`}
                  >
                    {network.displayName}
                  </div>
                );
              })}
              <Button className={"!h-[36px] !px-[15px]"} btnType={"secondary"}>
                {t(localeKeys.connectWallet)}
              </Button>
            </div>
            {/*network switch toggle*/}
            <div
              onClick={() => {
                toggleMobileNavigation();
              }}
              className={"shrink-0 h-full flex pr-[0.625rem] pl-[1.2rem] lg:hidden"}
            >
              <img className={"self-center w-[1rem] h-[0.875rem]"} src={menuToggleIcon} alt="image" />
            </div>
          </div>
        </div>
      </div>

      {/*Navigation drawer only shows on mobile devices*/}
      <Drawer
        onClose={() => {
          onDrawerClosed();
        }}
        isVisible={isDrawerVisible}
      >
        <div className={"flex flex-col h-full"}>
          {/*Nav header*/}
          <div className={"h-[3.125rem] p-[0.9375rem] pr-0 bg-black flex justify-between items-center shrink-0"}>
            <div className={"shrink-0 text-18-bold uppercase"}>{t(localeKeys.menu)}</div>
            <div
              onClick={() => {
                toggleMobileNavigation();
              }}
              className={"shrink-0 pr-[0.625rem]"}
            >
              <img className={"w-[2.125rem] h-[2.125rem]"} src={closeIcon} alt="" />
            </div>
          </div>
          {/*Menu, this menu will only be visible on mobile phones,no need to use
            the custom scrollbar since the mobile phone scrollbar is nice by default*/}
          <div className={"flex-1 overflow-auto"}>Some Menu</div>
          {/*Nav footer*/}
        </div>
      </Drawer>
    </div>
  );
};

export default Header;
