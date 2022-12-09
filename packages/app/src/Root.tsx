import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { notification, Spinner } from "@darwinia/ui";
import { useWallet } from "@darwinia/app-wallet";
import { useAppTranslation, localeKeys } from "@package/app-locale";
import Header from "./components/Header";
import Footer from "./components/Footer";

const Root = () => {
  const { isConnecting, error } = useWallet();

  /* Set this value to control the minimum content width on PC to avoid the
   * UI from collapsing on PC when the browser size is small */
  // const mainContentMinWidth = "lg:min-w-[1000px]";
  const mainContentMinWidth = "";
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(isConnecting);
  }, [isConnecting]);

  useEffect(() => {
    if (error) {
      notification.error({
        message: <div>{error.message}</div>,
      });
    }
  }, [error]);

  return (
    <Spinner isLoading={loading}>
      <div className={"flex h-screen justify-center flex-1"}>
        <div className={"flex flex-1 flex-col"}>
          <Header />
          {/*Main Content*/}
          <div className={"min-h-screen flex flex-col"}>
            <div className={"flex flex-1 wrapper-padding justify-center pt-[50px] lg:pt-[60px]"}>
              <div className={"flex-1 container flex bg-link"}>
                <div className={"flex flex-1"}>
                  <Outlet />
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </Spinner>
  );
};

export default Root;
