"use client";

import PageLayout from "@/components/Admin/PageLayout";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Blog {
  _id: string;
  title: string;
  description: string;
  author: string;
}

export default function BlogsAdminPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 10;
  const t = useTranslations("Admin");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs", { credentials: "include" });
        const data = await res.json();
        setBlogs(data);
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleDeleteClick = (blog: Blog) => setBlogToDelete(blog);

  const handleConfirmDelete = async () => {
    if (!blogToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/blogs/${blogToDelete._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setBlogs(blogs.filter((b) => b._id !== blogToDelete._id));
        setBlogToDelete(null);
        setShowToast(true); // Hiển thị toast khi xoá thành công
        setTimeout(() => setShowToast(false), 2500); // Ẩn toast sau 2.5s
      }
    } catch (error) {
      console.error("Delete error", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => setBlogToDelete(null);

  // Filter blogs based on search term
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * blogsPerPage,
    currentPage * blogsPerPage
  );

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <PageLayout>
      <div className="container">
        {/* Toast thông báo xoá thành công */}
        {showToast && (
          <div className="toast toast-top toast-end z-50">
            <div className="alert alert-success">
              <span>{t("Blog.deleteSuccess")}</span>
            </div>
          </div>
        )}
        <h1 className="text-2xl font-bold mb-4">{t("Blog.namePage")}</h1>
        <div className="mb-4 flex justify-between items-center gap-4">
          <input
            type="text"
            placeholder={t("Search.blogs")}
            className="input input-bordered border-gray-700 shadow-none bg-primary-2 w-[34rem] max-w-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link
            href="/admin/blogs/create-blog"
            className="btn btn-primary shadow-none text-black border-none"
          >
            {t("Blog.create")}
          </Link>
        </div>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="text-white">
                <tr>
                  <th>{t("Blog.title")}</th>
                  <th>{t("Blog.description")}</th>
                  <th>{t("Blog.author")}</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBlogs.map((blog) => (
                  <tr
                    className="hover:bg-gray-700 border-b-gray-700"
                    key={blog._id}
                  >
                    <td>{blog.title}</td>
                    <td>{blog.description}</td>
                    <td>{blog.author}</td>
                    <td>
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/blogs/${blog._id}`}
                          className="btn btn-sm btn-info"
                        >
                          {t("Action.edit")}
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(blog)}
                          className="btn btn-sm btn-error"
                        >
                          {t("Action.delete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredBlogs.length === 0 && !loading && (
              <div className="text-center py-4 text-gray-500">
                {searchTerm ? t("Blog.noBlogFound") : t("Blog.noBlogAvailable")}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="join">
                  <button
                    className="join-item btn"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    «
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      className={`join-item btn ${
                        currentPage === i + 1 ? "btn-active" : ""
                      }`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    className="join-item btn"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    »
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {/* Delete Confirmation Modal */}
        {blogToDelete && (
          <div className="modal modal-open">
            <div className="modal-box bg-neutral">
              <h3 className="font-bold text-lg">{t("Blog.deleteTitle")}</h3>
              <p className="py-4">
                {t("Blog.deleteMessage", { title: blogToDelete.title })}
              </p>
              <div className="modal-action">
                <button
                  onClick={handleCancelDelete}
                  className="btn btn-outline"
                  disabled={isDeleting}
                >
                  {t("Action.cancel")}
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="btn btn-error"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    t("Action.delete")
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
