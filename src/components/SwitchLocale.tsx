"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import Phone from "@/assets/icons/phone.svg";
import EnFlag from "@/assets/icons/en-flag.svg";
import VnFlag from "@/assets/icons/vi-flag.svg";
import Image from "next/image";

const LOCALES = [
  { code: "en", label: "EN", flag: EnFlag },
  { code: "vi", label: "VI", flag: VnFlag },
];

export default function SwitchLocale() {
  const t = useTranslations("Navigation");
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1] || "en";

  const handleChangeLocale = (locale: string) => {
    if (locale !== currentLocale) {
      const newPath = pathname.replace(/^\/(en|vi)/, `/${locale}`);
      router.push(newPath);
    }
  };

  return (
    <div className="bg-neutral">
      <div className="container mx-auto px-6 xl:px-0 pt-5 pb-3 font-bold text-sm">
        <div className="flex flex-row justify-between items-center max-sm:flex-col max-sm:items-center max-sm:gap-5">
          <div>{t("position")}</div>
          <div className="flex flex-row">
            <div className="flex flex-row">
              <Image src={Phone} alt="Phone" />
              <div className="font-normal ml-2">Hotline: +84 123456789</div>
            </div>
            {LOCALES.map(({ code, label, flag }) => (
              <div
                key={code}
                className={`flex flex-row items-center ml-5 cursor-pointer transition-opacity ${
                  currentLocale === code ? "opacity-100" : "opacity-50"
                }`}
                onClick={() => handleChangeLocale(code)}
              >
                <Image src={flag} alt={`${code}-flag`} />
                <div className="font-normal ml-2">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
