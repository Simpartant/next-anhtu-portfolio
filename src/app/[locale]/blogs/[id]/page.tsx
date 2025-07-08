"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Image from "next/image";
import RelatedBlogs from "@/components/Blogs/Related-Blog";
import ActionComponent from "@/components/ActionComponent";
import ContactMe from "@/components/ContactMe";
import { useTranslations } from "use-intl";
import { useLoading } from "@/contexts/LoadingContext";

interface BlogData {
  _id: string;
  title: string;
  content: string;
  author: string;
  image: string;
  description: string;
  createdAt: string;
}

export default function BlogDetail() {
  const { id } = useParams();
  const [data, setData] = useState<BlogData | null>(null);
  const t = useTranslations("BlogPage.detail");
  const { loading, setLoading } = useLoading();
  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`/api/blogs/${id}`)
        .then((res) => res.json())
        .then((res) => setData(res.data))
        .finally(() => setLoading(false));
    }
  }, [id]);
  const prevPage = [
    { name: t("home"), href: "/" },
    { name: t("blogs"), href: "/blogs" },
  ];

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  }
  if (loading || !data) {
    return (
      <div className="container mx-auto px-6 xl:px-0 py-10 lg:py-20">
        {/* Skeleton for breadcrumbs */}
        <div className="skeleton h-6 w-1/3 mb-8" />
        {/* Skeleton for image */}
        <div className="flex justify-center py-5 lg:py-10">
          <div className="skeleton w-full h-[20rem] lg:h-[50rem] rounded-lg" />
        </div>
        {/* Skeleton for title and meta */}
        <div className="flex flex-col gap-3">
          <div className="skeleton h-10 w-2/3 mb-2" />
          <div className="skeleton h-6 w-1/4 mb-2" />
          <div className="skeleton h-6 w-1/6 mb-2" />
          <div className="skeleton h-6 w-1/5 mb-2" />
        </div>
        {/* Skeleton for content */}
        <div className="py-5 lg:py-10">
          <div className="skeleton h-8 w-1/4 mb-4" />
          <div className="space-y-4">
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-5/6" />
            <div className="skeleton h-4 w-2/3" />
            <div className="skeleton h-4 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-6 xl:px-0">
        <div className="py-10 lg:py-20">
          <Breadcrumbs
            prevPage={prevPage}
            currentPage={data.title ?? "Blog Details"}
          />
          <div className="flex justify-center py-5 lg:py-10">
            <Image
              src={
                data.image.startsWith("data:")
                  ? data.image
                  : `data:image/jpeg;base64,${data.image}`
              }
              alt="Product"
              width={1200} // set to your image's width
              height={800} // set to your image's height
              className="w-full h-[20rem] lg:h-[50rem] border border-gray-800 mb-4 bg-zinc-900 object-contain"
            />
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-3xl font-bold">{data.title}</div>
            <div className="text-base text-gray-400">
              <div className="my-4">{data.description}</div>
              <div className="">
                {t("author")}: {data.author}
              </div>

              <div>
                {t("createDate")}: {formatDate(data.createdAt)}
              </div>
            </div>
          </div>
          <div className="py-5 lg:py-10">
            <div className="font-bold text-2xl">{t("information")}</div>
            <div
              className="prose prose-lg text-base/8 max-w-none mt-4 
        prose-headings:text-white 
        prose-p:text-gray-300 
        prose-a:text-blue-400 prose-a:underline hover:prose-a:text-blue-300
        prose-ul:text-gray-300 prose-ol:text-gray-300
        prose-li:text-gray-300 prose-li:marker:text-gray-400
        prose-strong:text-white
        prose-em:text-gray-300
        [&_img]:w-[65rem]
        [&_img]:py-6
        [&_a]:text-blue-400 [&_a]:underline [&_a:hover]:text-blue-300
        [&_ul]:list-disc [&_ul]:ml-6
        [&_ol]:list-decimal [&_ol]:ml-6"
              dangerouslySetInnerHTML={{ __html: data.content }}
            />
          </div>
        </div>
      </div>
      <RelatedBlogs id={data._id} />
      <ActionComponent />
      <ContactMe />
    </>
  );
}
