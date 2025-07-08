"use client";
import OurTeam from "@/assets/team-member.png";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useLoading } from "@/contexts/LoadingContext";

export default function Discover() {
  const t = useTranslations("Discover");
  const { loading } = useLoading();

  if (loading) {
    return (
      <div className="py-4 px-6 xl:px-0 md:py-20">
        <div className="skeleton h-10 w-1/3 mb-4 rounded" />
        <div className="skeleton h-6 w-2/3 mb-8 rounded" />
        <div className="skeleton w-full max-w-[80rem] h-80 mx-auto rounded-[80rem]" />
      </div>
    );
  }

  return (
    <div className="py-4 px-6 xl:px-0 md:py-20">
      <div className="text-3xl">{t("title")}</div>
      <div className="text-lg text-gray-500 mt-2 mb-6 lg:mt-5 lg:mb-20">
        {t("description")}
      </div>
      <Image
        src={OurTeam}
        alt="Our Team"
        className="w-[80rem] rounded-[80rem] place-items-center mx-auto object-cover"
      />
    </div>
  );
}
