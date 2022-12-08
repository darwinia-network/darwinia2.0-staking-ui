import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { notification, Spinner } from "@darwinia/ui";
import { useWallet } from "@darwinia/app-wallet";
import { useAppTranslation, localeKeys } from "@package/app-locale";

const Root = () => {
  const { isConnecting, error } = useWallet();
  const { t } = useAppTranslation();
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("");
  const pagesPathTitleMap = {
    "/": t(localeKeys.overview),
    "/relayers-overview": t(localeKeys.relayersOverview),
    "/relayer-dashboard": t(localeKeys.relayerDashboard),
    "/orders": t(localeKeys.orders),
    "/relayers-overview/details": t(localeKeys.relayerDetails),
    "/orders/details": () => {
      const params = new URLSearchParams(location.search);
      const orderId = params.get("orderId") ?? "";
      return t(localeKeys.orderNumberDetails, { orderNumber: orderId });
    },
  };

  useEffect(() => {
    const pathname = location.pathname as keyof typeof pagesPathTitleMap;
    setPageTitle(pagesPathTitleMap[pathname] ?? t(localeKeys.overview));
  }, [location]);
  /* Set this value to control the minimum content width on PC to avoid the
   * UI from collapsing on PC when the browser size is small */
  // const mainContentMinWidth = "lg:min-w-[1000px]";
  const mainContentMinWidth = "";
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(isConnecting);
  }, [isConnecting]);

  useEffect(() => {
    console.log(error);
    if (error) {
      notification.error({
        message: <div>{error.message}</div>,
      });
    }
  }, [error]);

  return (
    <Spinner isLoading={loading}>
      <div className={"flex"}>
        {/*Sidebar*/}
        <div className={"hidden lg:flex w-[12.5rem]"}>
          <Sidebar />
        </div>
        {/*Main Content*/}
        <div className={"h-screen flex-1 flex flex-col"}>
          {/*The fixed page title that displays on the PC version is rendered in the Header component */}
          <Header title={pageTitle} />

          <div style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }} className={"flex-1"}>
            <div
              style={{
                position: "absolute",
                top: "0px",
                bottom: "0px",
                left: "0px",
                right: "0px",
              }}
              className={"dw-custom-scrollbar"}
            >
              <div className={`${mainContentMinWidth} p-[0.9375rem] pt-0 lg:p-[1.875rem] lg:pt-0`}>
                This is the section that can be scrolled horizontally
                <div>
                  <div>
                    The mobile phone page title that scrolls with the page content Lorem ipsum dolor sit amet,
                    consectetur adipisicing elit. Aliquid, consequuntur deleniti id molestias natus saepe sint veniam?
                    Aliquam architecto debitis dolorum, eaque esse impedit, itaque minus, nesciunt nobis officiis
                    repudiandae.
                    <div>
                      <div className={"lg:hidden page-title py-[0.9375rem] lg:mt-0"}>{pageTitle}</div>
                      <Outlet />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Spinner>
  );
};

export default Root;
