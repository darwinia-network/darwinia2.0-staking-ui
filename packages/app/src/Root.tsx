import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { notification, Spinner } from "@darwinia/ui";
import { useWallet } from "@darwinia/app-wallet";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { getStore, setStore } from "@darwinia/app-utils";

const Root = () => {
  const { isRequestingWalletConnection, error, connectWallet, isWalletConnected, selectedNetwork } = useWallet();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  /*This lock will prevent the app from infinite redirecting sometimes */
  const isUserAuthed = useRef(false);

  useEffect(() => {
    setLoading(isRequestingWalletConnection);
  }, [isRequestingWalletConnection, isWalletConnected]);

  /*Monitor wallet connection and redirect to the required location */
  useEffect(() => {
    /* if the user has just connected to the wallet, this will redirect to the
     * staking page */
    if (isWalletConnected && !isUserAuthed.current) {
      setStore("isConnectedToWallet", isWalletConnected);
      if (location.pathname === "/") {
        /* This user is connected to wallet already but trying to go to the homepage,
         * force redirect him to the staking page  */
        isUserAuthed.current = true;
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
      <div className={"w-full"}>
        <Header />
        <div className={"flex flex-col min-h-screen justify-center flex-1 pt-[80px] lg:pt-[90px]"}>
          {/*apply padding*/}
          <div className={"flex flex-1 flex-col wrapper-padding items-center"}>
            {/*apply max-width*/}
            <div className={"flex flex-col flex-1 app-container w-full"}>
              <Outlet />
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </Spinner>
  );
};

export default Root;
