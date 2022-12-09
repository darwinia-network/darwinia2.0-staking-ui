import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { notification, Spinner } from "@darwinia/ui";
import { useWallet } from "@darwinia/app-wallet";
import { useAppTranslation, localeKeys } from "@package/app-locale";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Scrollbars } from "react-custom-scrollbars";

const Root = () => {
  const { isConnecting, error } = useWallet();
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
          <Scrollbars className={"flex flex-1"}>
            <div className={"flex flex-1 flex-col h-full"}>
              <div className={"flex flex-1 wrapper-padding justify-center"}>
                <div className={"flex flex-1 app-container"}>
                  <Outlet />
                </div>
              </div>
              <Footer />
            </div>
          </Scrollbars>
        </div>
      </div>
    </Spinner>
  );
};

export default Root;
