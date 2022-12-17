import Root from "./Root";
import { WalletProvider, StorageProvider } from "@darwinia/app-providers";
import { i18nTranslationInit } from "@darwinia/app-locale";

i18nTranslationInit();

const App = () => {
  return (
    <WalletProvider>
      <StorageProvider>
        <Root />
      </StorageProvider>
    </WalletProvider>
  );
};

export default App;
