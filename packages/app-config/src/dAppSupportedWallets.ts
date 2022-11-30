import metaMaskLogo from "./assets/images/metamask-logo.svg";
import { WalletConfig } from "@darwinia/app-types";

export const dAppSupportedWallets: WalletConfig[] = [
  {
    name: "MetaMask",
    logo: metaMaskLogo,
    extensions: [
      {
        browser: "Chrome",
        downloadURL: "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
      },
      {
        browser: "Firefox",
        downloadURL: "https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/",
      },
      {
        browser: "Brave",
        downloadURL: "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
      },
      {
        browser: "Edge",
        downloadURL:
          "https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm?hl=en-US",
      },
      {
        browser: "Opera",
        downloadURL: "https://addons.opera.com/en-gb/extensions/details/metamask-10/",
      },
    ],
  },
];
