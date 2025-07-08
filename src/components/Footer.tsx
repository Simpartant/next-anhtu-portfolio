import Image from "next/image";
import LogoOnly from "@/assets/logo/Only-logo.svg";
import TextLogo from "@/assets/logo/text-logo.svg";
import Facebook from "@/assets/icons/social/facebook.svg";
import Tiktok from "@/assets/icons/social/tiktok.svg";
import Youtube from "@/assets/icons/social/youtube.svg";
import { useTranslations } from "next-intl";
import { useLoading } from "@/contexts/LoadingContext";

const SocialLinks = () => (
  <div className="flex flex-row items-center justify-start gap-6 mt-10">
    <Image src={Facebook} alt="facebook" />
    <Image src={Youtube} alt="youtube" />
    <Image src={Tiktok} alt="tiktok" />
  </div>
);

const NavLinks = ({ t }: { t: (key: string) => string }) => (
  <nav className="flex flex-col gap-8">
    <a className="link link-hover">{t("home")}</a>
    <a className="link link-hover">{t("about")}</a>
    <a className="link link-hover">{t("product")}</a>
    <a className="link link-hover">{t("blogs")}</a>
    <a className="link link-hover">{t("contact")}</a>
  </nav>
);

const PolicyLinks = ({ t }: { t: (key: string) => string }) => (
  <nav className="flex flex-col gap-8 mt-6 sm:mt-0">
    <a className="link link-hover">{t("privacyPolicy")}</a>
    <a className="link link-hover">{t("termOfService")}</a>
  </nav>
);

export default function Footer() {
  const t = useTranslations("Footer");
  const { loading } = useLoading();

  if (loading) {
    return (
      <div className="flex w-full flex-col">
        <footer className="footer sm:footer-horizontal bg-neutral text-neutral-content p-10">
          <div className="container mx-auto flex flex-col sm:flex-row justify-between">
            <aside>
              <div className="flex flex-col gap-4">
                <div className="skeleton w-16 h-16 rounded-xl mb-2" />
                <div className="skeleton h-8 w-40 rounded mb-2" />
              </div>
              <div className="flex flex-row items-center justify-start gap-6 mt-10">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="skeleton w-10 h-10 rounded-full" />
                ))}
              </div>
            </aside>
            <div className="flex flex-col sm:flex-row gap-10 text-base mt-10 gap-0 sm:gap-30 sm:mt-0">
              <div className="flex flex-col gap-8">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div key={idx} className="skeleton h-6 w-24 rounded mb-2" />
                ))}
              </div>
              <div className="flex flex-col gap-8 mt-6 sm:mt-0">
                {Array.from({ length: 2 }).map((_, idx) => (
                  <div key={idx} className="skeleton h-6 w-32 rounded mb-2" />
                ))}
              </div>
            </div>
          </div>
        </footer>
        <div className="divider bg-neutral m-0"></div>
        <div className="card bg-neutral rounded-box grid h-20 place-items-center">
          <div className="skeleton h-4 w-40 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col">
      <footer className="footer sm:footer-horizontal bg-neutral text-neutral-content p-10">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between">
          <aside>
            <div className="flex flex-col gap-4">
              <Image src={LogoOnly} alt="Logo only" />
              <Image
                src={TextLogo}
                className="md:w-[15rem] xl:w-full"
                alt="Text Logo"
              />
            </div>
            <SocialLinks />
          </aside>
          <div className="flex flex-col sm:flex-row gap-10 text-base mt-10 gap-0 sm:gap-30 sm:mt-0">
            <NavLinks t={t} />
            <PolicyLinks t={t} />
          </div>
        </div>
      </footer>
      <div className="divider bg-neutral m-0"></div>
      <div className="card bg-neutral rounded-box grid h-20 place-items-center">
        {t("copyright")}
      </div>
    </div>
  );
}
