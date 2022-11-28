import Root from "./Root";
import { WalletProvider } from "@darwinia/app-wallet";

const App = () => {
  return (
    <WalletProvider>
      <Root />
    </WalletProvider>
  );
};

export default App;
