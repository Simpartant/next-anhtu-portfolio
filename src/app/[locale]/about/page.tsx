import Image from "next/image";
import ContactImage01 from "@/assets/avatar/contact-01.svg";
import About02 from "@/assets/avatar/about-02.svg";
import About03 from "@/assets/avatar/about-03.svg";
import About04 from "@/assets/avatar/about-04.svg";
import { useTranslations } from "next-intl";
import ActionComponent from "@/components/ActionComponent";

export default function AboutPage() {
  const t = useTranslations("AboutPage");
  return (
    <>
      <section className="relative w-full min-h-[80vh] flex items-end bg-black text-white overflow-hidden">
        {/* Overlay for desktop */}
        <div className="absolute inset-0 bg-gradient-to-r from-black from-15% via-black via-30% to-transparent z-10 hidden md:block" />

        {/* Overlay for mobile */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-10 block md:hidden" />

        {/* Full width image */}
        <Image
          src={ContactImage01}
          alt="Nguyễn Anh Tú"
          fill
          className="object-cover object-right z-0"
          priority
          draggable={false}
        />

        {/* Main contents */}
        <div className="relative container mx-auto z-20 w-full px-4 sm:px-6 md:px-8 py-10 md:py-16 grid grid-cols-1 grid-cols-12 gap-10 items-end">
          {/* Text bên trái */}
          <div className="md:col-span-12 col-span-11 space-y-4 md:space-y-6">
            <h2 className="text-sm md:text-lg lg:m-0 lg:mb-12 uppercase tracking-widest text-white/70">
              {t("title")}
            </h2>
            <h1 className="text-3xl md:text-6xl lg:m-0 lg:mb-12 font-bold">
              NGUYỄN ANH TÚ
            </h1>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-6 text-xs md:text-sm lg:text-base text-justify leading-relaxed">
              <p>{t("aboutIntroduce01")}</p>
              <p>{t("aboutIntroduce02")}</p>
              <p>{t("aboutIntroduce03")}</p>
              <p>{t("aboutIntroduce04")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Middle Section with team image and quote */}
      <section className="mx-auto py-20 space-y-6 flex flex-col xl:flex-row lg:gap-20 gap-10 items-center">
        <Image
          src={About02}
          priority
          draggable={false}
          alt="Three professionally dressed men engaged in a friendly lively conversation outside an office building"
          className="object-obtain w-[80rem] "
        />
        <div className="flex flex-col px-6 lg:px-0 gap-10">
          <blockquote className="text-white text-lg italic border-l-4 border-white pl-6 max-w-4xl mx-auto">
            {t("saySentence01")}
          </blockquote>
          <p className="max-w-4xl mx-auto text-sm italic">
            {t("saySentence02")}
          </p>
        </div>
      </section>

      {/* Call to Action Section */}
      <div className="container mx-auto">
        <ActionComponent />
      </div>

      <Image
        src={About03}
        priority
        draggable={false}
        alt="Man is working"
        className="object-cover w-full "
      />

      {/* Bottom Section with two images and text */}
      <section className="container mx-auto px-6 xl:px-0 py-20 space-y-10 flex flex-col lg:flex-row lg:gap-20 lg:justify-between gap-10 items-center">
        <div className="flex flex-col gap-8">
          <div className="text-3xl/12 max-w-2xl font-bold">
            {t("aboutTitle")}
          </div>
          <div className="text-base/8 font-light flex flex-col gap-4 text-justify">
            <span>{t("about1")}</span>
            <span>{t("about2")}</span>
            <span>{t("about3")}</span>
          </div>
        </div>
        <Image
          src={About04}
          priority
          draggable={false}
          alt="Stand avatar"
          className="object-cover w-[200rem]"
        />
      </section>
    </>
  );
}
