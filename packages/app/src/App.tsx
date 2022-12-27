import Root from "./Root";
import { WalletProvider, StorageProvider, GraphQLProvider } from "@darwinia/app-providers";
import { i18nTranslationInit } from "@darwinia/app-locale";

i18nTranslationInit();

const App = () => {
  return (
    <WalletProvider>
      <GraphQLProvider>
        <StorageProvider>
          <Root />
        </StorageProvider>
      </GraphQLProvider>
    </WalletProvider>
  );
};

export default App;
