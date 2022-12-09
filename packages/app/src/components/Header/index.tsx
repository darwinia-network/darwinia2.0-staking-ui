import { Link } from "react-router-dom";
import logoIcon from "../../assets/images/logo.svg";
import menuToggleIcon from "../../assets/images/menu-toggle.svg";
import closeIcon from "../../assets/images/close.svg";
import { useState } from "react";
import { Drawer } from "@darwinia/ui";
import { useAppTranslation, localeKeys } from "@package/app-locale";

const Header = () => {
  const [isDrawerVisible, setDrawerVisibility] = useState(false);
  const { t } = useAppTranslation();

  const toggleMobileNavigation = () => {
    setDrawerVisibility((isVisible) => !isVisible);
  };

  const onDrawerClosed = () => {
    setDrawerVisibility(false);
  };
  return (
    <div className={`shrink-0 h-[50px] lg:h-[60px] fixed w-full z-[50]`}>
      {/*mobile navigation bar*/}
      <div className={"justify-center wrapper-padding flex h-full left-0 right-0 top-0"}>
        <div className={"container bg-primary"}>
          <div className={"flex flex-1 h-full shrink-0 items-center justify-between pl-[0.625rem]"}>
            {/*Logo*/}
            <div className={"shrink-0 h-full"}>
              <Link className={"h-full flex"} to={"/"}>
                <img className={"self-center w-[9.25rem]"} src={logoIcon} alt="image" />
              </Link>
            </div>
            {/*Navigation toggle*/}
            <div
              onClick={() => {
                toggleMobileNavigation();
              }}
              className={"shrink-0 h-full flex pr-[0.625rem] pl-[1.2rem]"}
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
