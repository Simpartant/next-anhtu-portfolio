import OurTeam from "@/assets/team-member.png";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function Discover() {
  const t = useTranslations("Discover");
  return (
    <div className="py-4 max-sm:px-6 md:py-20">
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
