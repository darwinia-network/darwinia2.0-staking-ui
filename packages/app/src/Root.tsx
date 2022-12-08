import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { notification, Spinner } from "@darwinia/ui";
import { useWallet } from "@darwinia/app-wallet";
import { useAppTranslation, localeKeys } from "@package/app-locale";

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
      <div className={"flex h-screen flex-col"}>
        <div>Header</div>
        {/*Main Content*/}
        <div className={"flex-1 flex flex-col"}>
          <div style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }} className={"flex-1"}>
            <div
              style={{
                position: "absolute",
                top: "0px",
                bottom: "0px",
                left: "0px",
                right: "0px",
              }}
              className={"dw-custom-scrollbar flex"}
            >
              <div className={`${mainContentMinWidth} flex flex-1 p-[0.9375rem] pt-0 lg:p-[1.875rem] lg:pt-0`}>
                <Outlet />
              </div>
            </div>
          </div>
        </div>
        <div>Footer</div>
      </div>
    </Spinner>
  );
};

export default Root;
