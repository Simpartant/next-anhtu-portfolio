"use client";
import { useRouter } from "next/navigation";
import BlogCard from "./BlogCard";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useLoading } from "@/contexts/LoadingContext";

interface Blog {
  _id: string;
  title: string;
  image: string;
  description: string;
  createdAt: string;
}

export default function Blogs() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const t = useTranslations("BlogPage");
  const { loading, setLoading } = useLoading();

  const firstThreeBlogs = blogs.slice(0, 3);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/blogs");
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="py-4 px-6 xl:px-0 md:py-20">
      <div className="text-3xl">{t("title")}</div>
      <div className="flex flex-col gap-8 lg:flex-row justify-between mt-12">
        {loading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-4 p-4 rounded-xl bg-primary-2 bg-opacity-10 shadow-lg w-full"
              >
                <div className="skeleton h-48 w-full rounded-xl" />
                <div className="skeleton h-6 w-2/3" />
                <div className="skeleton h-4 w-1/2" />
                <div className="skeleton h-4 w-1/3" />
              </div>
            ))
          : firstThreeBlogs.map((blog, index) => (
              <BlogCard
                key={index + blog._id}
                id={blog._id}
                title={blog.title}
                imageUrl={blog.image}
                description={blog.description}
                createdAt={blog.createdAt}
              />
            ))}
      </div>
      <div className="flex justify-center mt-8">
        <button
          className="btn btn-primary-2 shadow-none text-white border-none rounded-xl"
          onClick={() => router.push("/blogs")}
        >
          {t("seeAllBlogs")}
        </button>
      </div>
    </div>
  );
}
