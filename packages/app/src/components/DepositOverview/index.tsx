import { useEffect } from "react";

const DepositOverview = () => {
  useEffect(() => {
    console.log("deposit mounted");
  }, []);
  return <div>deposit overview</div>;
};

export default DepositOverview;
