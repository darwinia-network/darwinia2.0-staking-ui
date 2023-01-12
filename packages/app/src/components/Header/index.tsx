import { Link, useLocation, useSearchParams } from "react-router-dom";
import logoIcon from "../../assets/images/logo.png";
import caretIcon from "../../assets/images/caret-down.svg";
import { useEffect, useRef, useState } from "react";
import { Button, Popover } from "@darwinia/ui";
import { useAppTranslation, localeKeys } from "@darwinia/app-locale";
import { useStorage, useWallet } from "@darwinia/app-providers";
import { supportedNetworks } from "@darwinia/app-config";
import { ChainConfig } from "@darwinia/app-types";
import { toShortAddress } from "@darwinia/app-utils";
import JazzIcon from "../JazzIcon";
import { ethers } from "ethers";
import JoinCollatorModal, { JoinCollatorRefs } from "../JoinCollatorModal";
import ManageCollatorModal, { ManageCollatorRefs } from "../ManageCollatorModal";

const Header = () => {
  const [networkOptionsTrigger, setNetworkOptionsTrigger] = useState<HTMLDivElement | null>(null);
  const { t } = useAppTranslation();
  const { selectedNetwork, changeSelectedNetwork, selectedAccount, connectWallet, forceSetAccountAddress } =
    useWallet();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const joinCollatorModalRef = useRef<JoinCollatorRefs>(null);
  const [moreOptionsTrigger, setMoreOptionsTrigger] = useState<HTMLDivElement | null>(null);
  const [moreOptionsTriggerMobile, setMoreOptionsTriggerMobile] = useState<HTMLDivElement | null>(null);
  const manageCollatorModalRef = useRef<ManageCollatorRefs>(null);
  const { collators } = useStorage();

  /* set the wallet network accordingly */
  useEffect(() => {
    const searchString = window.location.href.split("?")[1];
    if (searchString) {
      const searchParams = new URLSearchParams(searchString);
      const network = searchParams.get("network");
      const account = searchParams.get("account");
      if (network) {
        // the URL contains the network param
        const foundNetwork = supportedNetworks.find((item) => item.name.toLowerCase() === network.toLowerCase());
        if (foundNetwork) {
          changeConnectedNetwork(foundNetwork);
        }
      }
      if (account) {
        forceSetAccountAddress(account);
      }
    } else {
      /* use test network by default */
      const index = supportedNetworks.findIndex((network) => network.name === "Pangolin");
      changeConnectedNetwork(supportedNetworks[index]);
    }
  }, []);

  useEffect(() => {
    if (!selectedNetwork) {
      return;
    }

    searchParams.set("network", selectedNetwork.name);
    setSearchParams(searchParams);
  }, [selectedNetwork]);

  const changeConnectedNetwork = (network: ChainConfig) => {
    //close any popover
    document.body.click();
    changeSelectedNetwork(network);
  };

  const onShowJoinCollatorModal = () => {
    document.body.click();
    joinCollatorModalRef.current?.show();
  };

  const onShowManageCollatorModal = () => {
    document.body.click();
    manageCollatorModalRef.current?.show();
  };

  const onCollatorJoined = () => {
    console.log("collator joined");
  };

  const isUserACollator = () => {
    return collators?.some((collator) => collator.accountAddress.toLowerCase() === selectedAccount?.toLowerCase());
  };

  const accountOptions = () => {
    const joinCollatorClass = isUserACollator() ? "text-halfWhite cursor-no-drop" : "cursor-pointer  clickable";
    const manageCollatorClass = isUserACollator() ? "cursor-pointer  clickable" : "text-halfWhite cursor-no-drop";
    return (
      <div className={"border bg-black flex flex-col gap-[10px] border-primary p-[20px] select-none"}>
        <div
          onClick={() => {
            if (!isUserACollator()) {
              onShowJoinCollatorModal();
            }
          }}
          className={`capitalize ${joinCollatorClass}`}
        >
          {t(localeKeys.joinCollator)}
        </div>
        <div
          onClick={() => {
            if (isUserACollator()) {
              onShowManageCollatorModal();
            }
          }}
          className={`capitalize ${manageCollatorClass}`}
        >
          {t(localeKeys.manageCollator)}
        </div>
      </div>
    );
  };

  return (
    <div className={`shrink-0 h-[66px] lg:h-[60px] w-full fixed top-0 left-0 right-0 z-[30] bg-black`}>
      <div className={"justify-center flex h-full wrapper-padding"}>
        <div className={"app-container w-full"}>
          <div className={"flex flex-1 h-full shrink-0 items-center justify-between"}>
            {/*Logo*/}
            {/*Logo will only show on the PC*/}
            <div className={"shrink-0 h-full hidden lg:flex"}>
              <Link className={"h-full flex"} to={`/staking${location.search}`}>
                <img className={"self-center w-[146px]"} src={logoIcon} alt="image" />
              </Link>
            </div>
            {/*This connect wallet button / selected account info will only be shown on mobile phones*/}
            <div className={"shrink-0 h-full flex items-center lg:hidden"}>
              {selectedAccount ? (
                <div className={"border-primary border pl-[15px]"}>
                  <div className={"flex items-center gap-[10px]"}>
                    <JazzIcon size={20} address={ethers.utils.getAddress(selectedAccount)} />
                    <div ref={setMoreOptionsTriggerMobile} className={"select-none pr-[15px] py-[7px] flex gap-[10px]"}>
                      <div>{toShortAddress(ethers.utils.getAddress(selectedAccount))}</div>
                      <img className={"w-[16px]"} src={caretIcon} alt="image" />
                    </div>
                    <Popover offset={[0, 5]} triggerElementState={moreOptionsTriggerMobile} triggerEvent={"click"}>
                      <div>{accountOptions()}</div>
                    </Popover>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    connectWallet();
                  }}
                  className={"!px-[15px]"}
                  btnType={"secondary"}
                >
                  {t(localeKeys.connectWallet)}
                </Button>
              )}
            </div>
            {/*PC network switch and wallet connection*/}
            <div className={"hidden lg:flex items-center gap-[40px]"}>
              {supportedNetworks.map((network) => {
                const activeNetworkClass =
                  network.name.toLowerCase() === selectedNetwork?.name.toLowerCase() ? `after:block` : `after:hidden`;
                return (
                  <div
                    onClick={() => {
                      changeConnectedNetwork(network);
                    }}
                    className={`cursor-pointer relative h-[36px] flex items-center after:absolute after:left-0 after:right-0 after:h-[2px] after:bottom-0 after:bg-primary ${activeNetworkClass}`}
                    key={`${network.name}-${network.displayName}`}
                  >
                    {network.displayName}
                  </div>
                );
              })}
              {selectedAccount ? (
                <div className={"border-primary border pl-[15px]"}>
                  <div className={"flex items-center gap-[10px]"}>
                    <JazzIcon size={20} address={ethers.utils.getAddress(selectedAccount)} />
                    <div
                      ref={setMoreOptionsTrigger}
                      className={"select-none cursor-pointer pr-[15px] py-[5px] flex gap-[10px]"}
                    >
                      <div>{toShortAddress(ethers.utils.getAddress(selectedAccount))}</div>
                      <img className={"w-[16px]"} src={caretIcon} alt="image" />
                    </div>
                    <Popover offset={[0, 5]} triggerElementState={moreOptionsTrigger} triggerEvent={"click"}>
                      <div>{accountOptions()}</div>
                    </Popover>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    connectWallet();
                  }}
                  className={"!h-[36px] !px-[15px]"}
                  btnType={"secondary"}
                >
                  {t(localeKeys.connectWallet)}
                </Button>
              )}
            </div>
            {/*network switch toggle*/}
            <div
              ref={setNetworkOptionsTrigger}
              className={"shrink-0 h-full items-center flex pr-[0.625rem] pl-[1.2rem] lg:hidden"}
            >
              <div className={"border-primary border px-[15px] py-[7px]"}>
                <div className={"flex items-center gap-[10px]"}>
                  <div>{selectedNetwork?.displayName}</div>
                  <img src={caretIcon} alt="image" />
                </div>
              </div>
            </div>
            <Popover offset={[-10, -7]} triggerElementState={networkOptionsTrigger} triggerEvent={"click"}>
              <div className={"border border-primary p-[15px] flex flex-col gap-[15px] bg-black"}>
                {supportedNetworks.map((network) => {
                  return (
                    <div
                      onClick={() => {
                        changeConnectedNetwork(network);
                      }}
                      key={`${network.name}-${network.displayName}`}
                    >
                      {network.displayName}
                    </div>
                  );
                })}
              </div>
            </Popover>
          </div>
        </div>
      </div>
      <JoinCollatorModal ref={joinCollatorModalRef} onCollatorJoined={onCollatorJoined} />
      <ManageCollatorModal ref={manageCollatorModalRef} />
    </div>
  );
};

export default Header;
