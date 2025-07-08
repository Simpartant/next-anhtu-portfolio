"use client";

import PageLayout from "@/components/Admin/PageLayout";
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
      }
    } catch (error) {
      console.error("Delete error", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => setBlogToDelete(null);

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageLayout>
      <div className="container">
        <h1 className="text-2xl font-bold mb-4">Blogs Admin Page</h1>
        <div className="mb-4 flex justify-between items-center gap-4">
          <input
            type="text"
            placeholder="Search by title..."
            className="input input-bordered border-gray-700 shadow-none bg-primary-2 w-[34rem] max-w-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link
            href="/admin/blogs/create-blog"
            className="btn btn-primary shadow-none text-black border-none"
          >
            Create Blog
          </Link>
        </div>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="text-white">
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Author</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.map((blog) => (
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
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(blog)}
                          className="btn btn-sm btn-error"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredBlogs.length === 0 && !loading && (
              <div className="text-center py-4 text-gray-500">
                {searchTerm
                  ? "No blogs found matching your search."
                  : "No blogs available."}
              </div>
            )}
          </div>
        )}
        {/* Delete Confirmation Modal */}
        {blogToDelete && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Confirm Delete</h3>
              <p className="py-4">
                Are you sure you want to delete the blog &quot;
                {blogToDelete.title}&quot;? This action cannot be undone.
              </p>
              <div className="modal-action">
                <button
                  onClick={handleCancelDelete}
                  className="btn btn-outline"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="btn btn-error"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Delete"
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
