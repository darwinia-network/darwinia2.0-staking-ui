import { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useWallet } from "@darwinia/app-wallet";

const Protected = ({ children }: PropsWithChildren) => {
  const { isWalletConnected, isConnecting } = useWallet();
  const location = useLocation();
  //if the user isn't connected to the wallet, redirect to the homepage
  if (!isWalletConnected && !isConnecting) {
    return <Navigate to={`/${location.search}`} replace={true} state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default Protected;
