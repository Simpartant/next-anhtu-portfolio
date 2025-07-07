"use client";

import { useState, useEffect } from "react";
import BlogCard from "@/components/Blogs/BlogCard";
import { useTranslations } from "next-intl";

interface Blog {
  _id: string;
  title: string;
  image: string;
  description: string;
  createdAt: string;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const t = useTranslations("BlogPage");

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        // Thay đổi URL API theo endpoint của bạn
        const response = await fetch("/api/blogs");

        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }

        const data = await response.json();
        setBlogs(data);
        setFilteredBlogs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Filter blogs based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter((blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBlogs(filtered);
    }
  }, [searchTerm, blogs]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 lg:py-20 px-6 xl:px-0">
        <div className="text-4xl mb-16">{t("title")}</div>
        <div className="text-center">Loading blogs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 lg:py-20 px-6 xl:px-0">
        <div className="text-4xl mb-16">{t("title")}</div>
        <div className="text-center text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 lg:py-20 px-6 xl:px-0">
      <div className="text-4xl mb-8">{t("title")}</div>

      {/* Search Input */}
      <div className="mb-10 lg:mb-16">
        <label className="input w-full lg:w-[50%] h-[4em] bg-primary-2">
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
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            type="search"
            value={searchTerm}
            onChange={handleSearchChange}
            className="bg-primary-2"
            placeholder={t("searchBlogByTitle") || "Search blog by title"}
          />
        </label>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <BlogCard
              key={blog._id}
              id={blog._id}
              title={blog.title}
              imageUrl={blog.image}
              description={blog.description}
              createdAt={blog.createdAt}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            {searchTerm ? t("noBlogFound") : t("noBlogAvailable")}
          </div>
        )}
      </div>
    </div>
  );
}
