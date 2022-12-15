import { useAppTranslation, localeKeys } from "@darwinia/app-locale";
import twitter from "../../assets/images/twitter.svg";
import telegram from "../../assets/images/telegram.svg";
import discord from "../../assets/images/discord.svg";
import element from "../../assets/images/element.svg";
import github from "../../assets/images/github.svg";
import medium from "../../assets/images/medium.svg";
import email from "../../assets/images/email.svg";
import earth from "../../assets/images/earth.svg";

interface SocialNetwork {
  id: number;
  logo: string;
  url: string;
}

const socialNetworks: SocialNetwork[] = [
  {
    id: 1,
    logo: twitter,
    url: "https://google.com",
  },
  {
    id: 2,
    logo: telegram,
    url: "https://google.com",
  },
  {
    id: 3,
    logo: discord,
    url: "https://google.com",
  },
  {
    id: 4,
    logo: element,
    url: "https://google.com",
  },
  {
    id: 5,
    logo: github,
    url: "https://google.com",
  },
  {
    id: 6,
    logo: medium,
    url: "https://google.com",
  },
  {
    id: 7,
    logo: email,
    url: "https://google.com",
  },
];

const Footer = () => {
  const { t } = useAppTranslation();

  const getSocialNetworksJSX = () => {
    return socialNetworks.map((socialNetwork) => {
      return (
        <a className={"clickable"} target="_blank" key={socialNetwork.id} href={socialNetwork.url} rel="noreferrer">
          <img className={"w-[20px] h-[20px]"} src={socialNetwork.logo} alt="image" />
        </a>
      );
    });
  };

  return (
    <div className={"flex justify-center pt-[30px] pb-[20px] wrapper-padding"}>
      <div
        className={"app-container flex flex-1 flex-col gap-[15px] lg:gap-0 lg:flex-row lg:items-center justify-between"}
      >
        <div className={"text-halfWhite"}>
          &copy; {new Date().getFullYear()} {t(localeKeys.darwiniaNetwork)}
        </div>
        <div>
          <div className={"flex gap-[20px] items-center"}>
            {getSocialNetworksJSX()}
            <div className={"text-halfWhite items-center flex gap-[5px]"}>
              <img className={"w-[20px] h-[20px]"} src={earth} alt="image" />
              <div>EN</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
