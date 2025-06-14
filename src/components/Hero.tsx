import { useTranslations } from "next-intl";
import Button from "./Button";
import Image from "next/image";
import heroImage from "@/assets/avatar/hero-image.svg";

export default function Hero() {
  const t = useTranslations("Hero");

  return (
    <div className="w-full py-10 lg:py-20">
      <div className="flex flex-col lg:flex-row-reverse items-center justify-between">
        <Image src={heroImage} alt="hero-image" />
        <div className="flex flex-col gap-2 lg:gap-6 items-start w-180">
          <h1 className="text-5xl font-bold">{t("title")}</h1>
          <p className="py-6">{t("description")}</p>
          <Button variant="primary">{t("contactNow")}</Button>
        </div>
      </div>
    </div>
  );
}
