"use client";
import Image from "next/image";
import ActionComponent from "../ActionComponent";
import Breadcrumbs from "../Breadcrumbs";
import ContactMe from "../ContactMe";
import RelatedBlogs from "./Related-Blog";
import { useTranslations } from "next-intl";

interface Props {
  data: BlogDetailProps;
  prevPage: { name: string; href: string }[];
}

interface BlogDetailProps {
  _id: string;
  title: string;
  image: string;
  description: string;
  content: string;
  author: string;
  createdAt: string;
}

export default function BlogDetail({ data, prevPage }: Props) {
  const t = useTranslations("BlogPage.detail");

  return (
    <div className="container mx-auto px-6 xl:px-0">
      <div className="py-10 lg:py-20">
        <Breadcrumbs prevPage={prevPage} currentPage={data.title} />

        <div className="flex justify-center py-5 lg:py-10">
          <Image
            src={data.image}
            alt="Blog"
            width={1200}
            height={800}
            className="w-full h-[20rem] lg:h-[50rem] border border-gray-800 mb-4 bg-zinc-900 object-contain"
          />
        </div>

        <div className="flex flex-col gap-3">
          <div className="text-3xl font-bold">{data.title}</div>
          <div className="text-base text-gray-400">
            <div className="my-4">{data.description}</div>
            <div>
              {t("author")}: {data.author}
            </div>
            <div>
              {t("createDate")}:{" "}
              {new Date(data.createdAt).toLocaleDateString("vi-VN")}
            </div>
          </div>
        </div>

        <div className="py-5 lg:py-10 prose prose-invert">
          <div dangerouslySetInnerHTML={{ __html: data.content }} />
        </div>
      </div>

      <RelatedBlogs id={data._id} />
      <ActionComponent />
      <ContactMe />
    </div>
  );
}
