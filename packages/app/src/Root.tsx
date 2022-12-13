import { Outlet, useLocation, useNavigate, useNavigation } from "react-router-dom";
import { useEffect, useState } from "react";
import { notification, Spinner } from "@darwinia/ui";
import { useWallet } from "@darwinia/app-wallet";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Scrollbars } from "react-custom-scrollbars";
import { getStore, setStore } from "@darwinia/app-utils";

const Root = () => {
  const { isConnecting, error, connectWallet, isWalletConnected, selectedNetwork } = useWallet();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setLoading(isConnecting);
  }, [isConnecting, isWalletConnected]);

  /*Monitor wallet connection and redirect to the required location */
  useEffect(() => {
    /* if the user has just connected to the wallet, this will redirect to the
     * staking page */
    if (isWalletConnected) {
      setStore("isConnectedToWallet", isWalletConnected);
      if (location.pathname === "/") {
        /* This user is connected to wallet already but trying to go to the homepage,
         * force redirect him to the staking page  */
        navigate(`/staking${location.search}`, { replace: true });
        return;
      }

      /* only navigate if the user is supposed to be redirected to another URL */
      if (location.state && location.state.from) {
        const nextPath = location.state.from.pathname ? location.state.from.pathname : "/staking";
        navigate(`${nextPath}${location.search}`, { replace: true });
      }
    }
  }, [isWalletConnected, location.state]);

  useEffect(() => {
    if (error) {
      notification.error({
        message: <div>{error.message}</div>,
      });
    }
  }, [error]);

  //check if it should auto connect to wallet or wait for the user to click the connect wallet button
  useEffect(() => {
    const shouldAutoConnect = getStore<boolean>("isConnectedToWallet");
    if (shouldAutoConnect) {
      connectWallet();
    }
  }, [selectedNetwork]);

  return (
    <Spinner isLoading={loading}>
      <div className={"flex flex-col h-screen justify-center flex-1"}>
        <div className={"flex flex-1 flex-col"}>
          <Header />
          {/*Main Content*/}
          <Scrollbars className={"flex flex-1"}>
            <div className={"flex flex-1 flex-col h-full pt-[15px] lg:pt-[30px]"}>
              <div className={"flex flex-1 flex-col wrapper-padding items-center"}>
                <div className={"flex flex-col flex-1 app-container w-full"}>
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
