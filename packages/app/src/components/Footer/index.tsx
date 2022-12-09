import { useAppTranslation, localeKeys } from "@package/app-locale";

const Footer = () => {
  const { t } = useAppTranslation();
  return (
    <div className={"flex justify-center pt-[30px] pb-[20px]"}>
      <div className={"app-container flex justify-between w-full h-[30px] items-center"}>
        <div className={"text-halfWhite"}>
          &copy; {new Date().getFullYear()} {t(localeKeys.darwiniaNetwork)}
        </div>
        <div>Social network</div>
      </div>
    </div>
  );
};

export default Footer;
