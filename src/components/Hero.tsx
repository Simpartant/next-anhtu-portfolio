"use client";
import { useTranslations } from "next-intl";
import Button from "./Button";
import Image from "next/image";
import heroImage from "@/assets/avatar/hero-image.svg";
import { useLoading } from "@/contexts/LoadingContext";

export default function Hero() {
  const t = useTranslations("Hero");

  const { loading } = useLoading();

  if (loading) {
    return (
      <div className="w-full py-10 lg:py-20">
        <div className="flex flex-col lg:flex-row-reverse items-center justify-between">
          <div className="skeleton w-[20rem] md:w-[30rem] lg:w-[40rem] h-72 rounded-xl" />
          <div className="flex flex-col p-8 lg:p-0 gap-2 lg:gap-5 items-start lg:w-180 w-full">
            <div className="skeleton h-12 w-2/3 rounded" />
            <div className="skeleton h-6 w-full rounded my-2" />
            <div className="skeleton h-10 w-32 rounded mt-4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-10 lg:py-20 ">
      <div className="flex flex-col lg:flex-row-reverse items-center justify-between">
        <Image
          src={heroImage}
          alt="hero-image"
          priority
          className="w-max-[20rem] md:w-[30rem] lg:w-[40rem]"
        />
        <div className="flex flex-col p-8 lg:p-0 gap-2 lg:gap-5 items-start lg:w-180">
          <h1 className="text-5xl font-bold leading-[1.3]">{t("title")}</h1>
          <p className="py-6">{t("description")}</p>
          <Button variant="primary" className="font-normal">
            {t("contactNow")}
          </Button>
        </div>
      </div>
    </div>
  );
}
