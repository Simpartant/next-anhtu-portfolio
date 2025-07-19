"use client";
import { useTranslations } from "next-intl";
import BlogCard from "./BlogCard";
import { useEffect, useState } from "react";

interface Blog {
  _id: string;
  title: string;
  image: string;
  description: string;
  createdAt: string;
}

interface RelatedBlogsProps {
  id: string;
}

function getRandomBlogs(arr: Blog[], n: number) {
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

export default function RelatedBlogs({ id }: RelatedBlogsProps) {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const t = useTranslations("BlogPage");

  const randomThreeBlogs = getRandomBlogs(blogs, 3);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/blogs");
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const data = await response.json();
        // Lọc bỏ blog có cùng id
        const filteredBlogs = data.filter((blog: Blog) => blog._id !== id);
        setBlogs(filteredBlogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, [id]);

  return (
    <div className="py-4 px-6 xl:px-0 md:py-20">
      <div className="text-3xl">{t("relatedBlogs")}</div>
      <div className="flex flex-col gap-8 lg:flex-row justify-between mt-12">
        {randomThreeBlogs.map((blog, index) => (
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
    </div>
  );
}
