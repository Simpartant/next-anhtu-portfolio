"use client";
import { useRouter } from "next/navigation";
import BlogCard from "./BlogCard";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  image: string;
  description: string;
  createdAt: string;
}

export default function Blogs() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const t = useTranslations("BlogPage");

  const firstThreeBlogs = blogs.slice(0, 3);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/blogs");
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const data = await response.json();
        // Here you can set the fetched blogs to state if needed
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="py-4 max-sm:px-6 md:py-20">
      <div className="text-3xl">{t("title")}</div>
      <div className="flex flex-col gap-8 lg:flex-row justify-between mt-12">
        {firstThreeBlogs.map((blog, index) => (
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
          className="btn btn-primary-2 shadow-none text-white border-none
 rounded-xl"
          onClick={() => router.push("/blogs")}
        >
          {t("seeAllBlogs")}
        </button>
      </div>
    </div>
  );
}
