"use client";

import { useTranslations } from "next-intl";
import Button from "./Button";
import FullLogo from "@/assets/logo/full-logo.svg";
import PhoneIcon from "@/assets/icons/social/phone.svg";
import EmailIcon from "@/assets/icons/social/email.svg";
import FacebookIcon from "@/assets/icons/social/facebook.svg";
import TiktokIcon from "@/assets/icons/social/tiktok.svg";
import YoutubeIcon from "@/assets/icons/social/youtube.svg";
import Image from "next/image";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

const IconInput = ({
  name,
  type,
  placeholder,
  pattern,
  minLength,
  maxLength,
  title,
  icon,
  validationMsg,
}: {
  name: string;
  type: string;
  placeholder: string;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  title?: string;
  icon?: React.ReactNode;
  validationMsg: string;
}) => (
  <div className="mb-4">
    <label className="input validator bg-primary-2 w-full h-[4em]">
      {icon}
      <input
        name={name}
        type={type}
        required
        placeholder={placeholder}
        pattern={pattern}
        minLength={minLength}
        maxLength={maxLength}
        title={title}
        className="bg-primary-2"
      />
    </label>
    <p className="validator-hint hidden">{validationMsg}</p>
  </div>
);

import type { StaticImageData } from "next/image";
import { useLoading } from "@/contexts/LoadingContext";

const ContactItem = ({
  icon,
  text,
}: {
  icon: StaticImageData | string;
  text: string;
}) => (
  <div className="flex items-center gap-4">
    <Image src={icon} alt={text} />
    <span className="ml-2">{text}</span>
  </div>
);

export default function ContactMe() {
  const t = useTranslations("ContactMe");
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
  const { loading } = useLoading();

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts)
      .catch((err) => console.error("Failed to fetch products", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values: Record<string, string> = {};
    formData.forEach((value, key) => {
      values[key] = value.toString();
    });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to send");
      toast.success("Gửi thành công!");
      e.currentTarget.reset();
    } catch (err) {
      console.log(err);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  if (loading) {
    return (
      <section className="lg:mx-auto py-10 lg:py-20 px-6 xl:px-0">
        <div className="skeleton h-12 w-1/3 mb-8 rounded" />
        <div className="flex flex-col lg:flex-row gap-20 lg:gap-45 mt-12">
          <div className="w-full lg:w-1/2">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="skeleton h-4 w-full mb-4 rounded" />
            ))}
            <div className="skeleton h-24 w-full mb-8 rounded" />
            <div className="skeleton h-12 w-40 mb-4 rounded" />
          </div>

          <div className="flex flex-col">
            <div className="skeleton w-[278px] h-24 hidden lg:block mb-8 rounded-xl" />
            <div className="flex flex-col gap-8 mt-6">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="skeleton h-8 w-64 rounded" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="lg:mx-auto py-10 lg:py-20 px-6 xl:px-0">
      <h1 className="text-4xl">{t("title")}</h1>
      <div className="flex flex-col lg:flex-row gap-20 lg:gap-45 mt-12">
        <form className="w-full lg:w-1/2" onSubmit={handleSubmit}>
          <IconInput
            name="name"
            type="text"
            placeholder={t("name")}
            pattern="^[A-Za-zÀ-ỹà-ỹĐđ\s\-]+$"
            minLength={3}
            maxLength={30}
            title="Only letters, numbers or dash"
            icon={
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </g>
              </svg>
            }
            validationMsg={`${t("validation.nameMustBe3or30Characters")}\n${t(
              "validation.nameNotIncludeNumber"
            )}`}
          />

          <IconInput
            name="email"
            type="email"
            placeholder="mail@site.com"
            icon={
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </g>
              </svg>
            }
            validationMsg={t("validation.emailMustBeValid")}
          />

          <IconInput
            name="phone"
            type="tel"
            placeholder="Phone"
            pattern="[0-9]*"
            minLength={10}
            maxLength={10}
            title="Must be 10 digits"
            icon={
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
              >
                <g fill="none">
                  <path
                    d="M7.25 11.5C6.83579 11.5 6.5 11.8358 6.5 12.25C6.5 12.6642 6.83579 13 7.25 13H8.75C9.16421 13 9.5 12.6642 9.5 12.25C9.5 11.8358 9.16421 11.5 8.75 11.5H7.25Z"
                    fill="currentColor"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6 1C4.61929 1 3.5 2.11929 3.5 3.5V12.5C3.5 13.8807 4.61929 15 6 15H10C11.3807 15 12.5 13.8807 12.5 12.5V3.5C12.5 2.11929 11.3807 1 10 1H6ZM10 2.5H9.5V3C9.5 3.27614 9.27614 3.5 9 3.5H7C6.72386 3.5 6.5 3.27614 6.5 3V2.5H6C5.44771 2.5 5 2.94772 5 3.5V12.5C5 13.0523 5.44772 13.5 6 13.5H10C10.5523 13.5 11 13.0523 11 12.5V3.5C11 2.94772 10.5523 2.5 10 2.5Z"
                    fill="currentColor"
                  />
                </g>
              </svg>
            }
            validationMsg={t("validation.phoneValidate")}
          />

          <div className="mb-4">
            <select
              name="project"
              defaultValue=""
              className="select w-full h-[4em] bg-primary-2"
            >
              <option disabled value="">
                {t("selectProject")}
              </option>
              {products.map((product, idx) => (
                <option key={product.id || idx} value={product.name}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-8">
            <textarea
              name="message"
              placeholder={t("messagePlaceholder")}
              className="textarea h-24 lg:h-48 bg-primary-2 w-full"
            />
          </div>

          <Button variant="primary" className="font-bold" type="submit">
            {t("sendMessage")}
          </Button>
        </form>

        <div className="flex flex-col">
          <Image
            src={FullLogo}
            alt="full logo"
            className="w-[28rem] hidden lg:block"
          />
          <div className="flex flex-col gap-8 mt-6">
            <ContactItem icon={EmailIcon} text="example@email.com" />
            <ContactItem icon={PhoneIcon} text="0912345678" />
            <ContactItem icon={FacebookIcon} text="facebook.com/nguyenanhtu" />
            <ContactItem icon={YoutubeIcon} text="youtube.com/nguyenanhtu" />
            <ContactItem icon={TiktokIcon} text="tiktok.com/nguyenanhtu" />
          </div>
        </div>
      </div>
    </section>
  );
}
