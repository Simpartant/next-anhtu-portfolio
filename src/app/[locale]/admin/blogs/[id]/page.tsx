"use client";

import PageLayout from "@/components/Admin/PageLayout";
import { useEffect, useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import imageCompression from "browser-image-compression";
import { Editor } from "@tinymce/tinymce-react";

const EMPTY_BLOG = {
  title: "",
  content: "",
  image: "",
  description: "",
};

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const blogId = params.id;
  const isCreateMode =
    pathname?.includes("create-blog") || blogId === "create-blog";

  const [blog, setBlog] = useState({ ...EMPTY_BLOG });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isCreateMode);
  const [error, setError] = useState("");

  // Fetch blog data if edit mode
  useEffect(() => {
    if (!isCreateMode && blogId) {
      setLoading(true);
      fetch(`/api/blogs/${blogId}`)
        .then((res) => res.json())
        .then((data) => {
          setBlog(data.data);
        })
        .catch(() => setError("Failed to fetch blog"))
        .finally(() => setLoading(false));
    }
  }, [blogId, isCreateMode]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBlog((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      setImageFile(file);
      // Nếu muốn xóa ảnh cũ khi chọn ảnh mới:
      setBlog((prev) => ({ ...prev, image: "" }));
    }
    e.target.value = "";
  };

  async function fileToBase64(file: File): Promise<string> {
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
    });
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(compressedFile);
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      let imageBase64 = blog.image;
      if (imageFile) {
        imageBase64 = await fileToBase64(imageFile);
      }
      const payload = {
        ...blog,
        image: imageBase64,
      };
      let res;
      if (isCreateMode) {
        res = await fetch("/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/blogs/${blogId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok)
        throw new Error(
          isCreateMode ? "Failed to create blog" : "Failed to update blog"
        );
      router.push("/admin/blogs");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="container max-w-2xl">
          <div className="py-12">Loading...</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">
          {isCreateMode ? "Create Blog" : "Edit Blog"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={blog.title}
              onChange={handleInputChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <input
              type="text"
              name="description"
              value={blog.description}
              onChange={handleInputChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Content</label>
            <Editor
              apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
              value={blog.content}
              onEditorChange={(content) =>
                setBlog((prev) => ({ ...prev, content }))
              }
              init={{
                height: 300,
                menubar: false,
                plugins: ["link", "lists", "code"],
                toolbar:
                  "undo redo | bold italic underline | bullist numlist | link | code",
              }}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Image</label>
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleImageChange}
              className="file-input file-input-bordered w-full"
            />
            {/* Hiển thị ảnh cũ nếu có */}
            {blog.image && !imageFile && (
              <img
                src={blog.image}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover rounded"
              />
            )}
            {/* Hiển thị ảnh mới nếu vừa chọn */}
            {imageFile && (
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover rounded"
              />
            )}
          </div>
          {error && <div className="text-red-500">{error}</div>}
          <div className="flex gap-4 justify-end">
            <button
              type="submit"
              className="btn bg-green-600 text-white"
              disabled={saving}
            >
              {saving
                ? isCreateMode
                  ? "Saving..."
                  : "Updating..."
                : isCreateMode
                ? "Create"
                : "Update"}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => router.push("/admin/blogs")}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
