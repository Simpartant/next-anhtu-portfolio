"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import Phone from "@/assets/icons/phone.svg";
import EnFlag from "@/assets/icons/en-flag.svg";
import VnFlag from "@/assets/icons/vi-flag.svg";
import Image from "next/image";
import { useLoading } from "@/contexts/LoadingContext";

const LOCALES = [
  { code: "en", label: "EN", flag: EnFlag },
  { code: "vi", label: "VI", flag: VnFlag },
];

type SwitchLocaleProps = {
  role?: string;
};

export default function SwitchLocale({ role = "" }: SwitchLocaleProps) {
  const t = useTranslations("Navigation");
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1] || "en";
  const { loading } = useLoading();

  const handleChangeLocale = (locale: string) => {
    if (locale !== currentLocale) {
      const newPath = pathname.replace(/^\/(en|vi)/, `/${locale}`);
      router.push(newPath);
    }
  };

  if (loading) {
    return (
      <div className="bg-neutral">
        <div className="container mx-auto px-6 xl:px-0 pt-5 pb-3 font-bold text-sm">
          <div className="flex flex-row justify-between items-center max-sm:flex-col max-sm:items-center max-sm:gap-5">
            <div className="skeleton h-6 w-32 rounded" />
            <div className="flex flex-row">
              <div className="skeleton h-6 w-32 rounded mr-4" />
              <div className="skeleton h-6 w-16 rounded mr-4" />
              <div className="skeleton h-6 w-16 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {role == "admin" && (
        <div className="mt-3">
          {LOCALES.map(({ code, label, flag }) => (
            <div
              key={code}
              className={`flex flex-row items-center cursor-pointer transition-opacity ${
                currentLocale === code ? "opacity-100" : "opacity-50"
              }`}
              onClick={() => handleChangeLocale(code)}
            >
              <Image src={flag} alt={`${code}-flag`} />
              <div className="font-normal ml-2">{label}</div>
            </div>
          ))}
        </div>
      )}
      {role === "" && (
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
      )}
    </>
  );
}
