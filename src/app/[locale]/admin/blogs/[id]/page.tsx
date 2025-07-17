"use client";

import PageLayout from "@/components/Admin/PageLayout";
import { useEffect, useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import imageCompression from "browser-image-compression";
import { Editor } from "@tinymce/tinymce-react";
import { useTranslations } from "next-intl";

const EMPTY_BLOG = {
  title: "",
  content: "",
  author: "",
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
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const t = useTranslations("Admin");

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
      setToastType("success");
      setToastMessage(
        isCreateMode
          ? t("Blog.createSuccess") || "Blog created successfully!"
          : t("Blog.updateSuccess") || "Blog updated successfully!"
      );
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        router.push("/admin/blogs");
      }, 2000);
    } catch (err: unknown) {
      setToastType("error");
      setToastMessage(
        err instanceof Error
          ? err.message
          : t("Blog.error") || "Error occurred!"
      );
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
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
        {/* Toast daisyUI */}
        {showToast && (
          <div className="toast toast-top toast-end z-50">
            <div className={`alert alert-${toastType}`}>
              <span>{toastMessage}</span>
            </div>
          </div>
        )}
        <h1 className="text-2xl font-bold mb-4">
          {isCreateMode ? t("Blog.create") : t("Blog.edit")}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">{t("Blog.title")}</label>
            <input
              type="text"
              name="title"
              value={blog.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">
              {t("Blog.description")}
            </label>
            <input
              type="text"
              name="description"
              value={blog.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">{t("Blog.author")}</label>
            <input
              type="text"
              name="author"
              value={blog.author}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">
              {t("Blog.content")}
            </label>
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
            <label className="block mb-1 font-medium">{t("Blog.image")}</label>
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleImageChange}
              className="file-input file-input-bordered text-black w-full"
            />
            {/* Hiển thị ảnh cũ nếu có */}
            {blog.image && !imageFile && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={blog.image}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover rounded"
              />
            )}
            {/* Hiển thị ảnh mới nếu vừa chọn */}
            {imageFile && (
              // eslint-disable-next-line @next/next/no-img-element
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
                  ? t("Action.saving")
                  : t("Action.updating")
                : isCreateMode
                  ? t("Action.create")
                  : t("Action.update")}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => router.push("/admin/blogs")}
              disabled={saving}
            >
              {t("Action.cancel")}
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
