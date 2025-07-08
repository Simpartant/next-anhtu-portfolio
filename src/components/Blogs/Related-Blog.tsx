"use client";
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

export default function RelatedBlogs({ id }: RelatedBlogsProps) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  //   const t = useTranslations("BlogPage");

  const firstThreeBlogs = blogs.slice(0, 3);

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
      <div className="text-3xl">RELATED BLOGS</div>
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
    </div>
  );
}
