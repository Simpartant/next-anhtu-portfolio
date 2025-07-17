"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import PageLayout from "@/components/Admin/PageLayout";
import { Editor } from "@tinymce/tinymce-react";
import imageCompression from "browser-image-compression";
import { useTranslations } from "next-intl";

interface Product {
  name: string;
  area: string;
  investor: string;
  defaultImage: string;
  listImages: string[];
  detail: string;
  type: string;
  apartmentType: string;
  acreage: string;
}

const EMPTY_PRODUCT: Product = {
  name: "",
  area: "",
  investor: "",
  defaultImage: "",
  listImages: [],
  detail: "",
  type: "",
  apartmentType: "",
  acreage: "",
};

export default function ProductsDetailAdminPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const isCreateMode = pathname?.includes("create-product");
  const productId = params.id;

  // State
  const [product, setProduct] = useState<Product>(EMPTY_PRODUCT);
  const [originalProduct, setOriginalProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [defaultImageFile, setDefaultImageFile] = useState<File | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showRequiredError, setShowRequiredError] = useState(false);

  const t = useTranslations("Admin");

  // --- Effects ---

  // Init for create mode
  useEffect(() => {
    if (isCreateMode) {
      setIsEditing(true);
      setProduct(EMPTY_PRODUCT);
      setOriginalProduct(null);
      setLoading(false);
    }
  }, [isCreateMode]);

  // Fetch product for edit mode
  useEffect(() => {
    if (!isCreateMode && productId) fetchProductData(productId as string);
  }, [productId, isCreateMode]);

  // Reset default image file when product.defaultImage changes
  useEffect(() => setDefaultImageFile(null), [product.defaultImage]);

  // Reset imageFiles when product.listImages changes
  useEffect(() => {
    if (product.listImages.length > 0) setImageFiles([]);
  }, [product.listImages]);

  // --- Handlers & Utils ---

  // Fetch product data
  async function fetchProductData(id: string) {
    setLoading(true);
    try {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) throw new Error("Failed to fetch product");
      const data = await response.json();
      const fixedData = { ...data.data };
      if (typeof fixedData.listImages === "string") {
        try {
          fixedData.listImages = JSON.parse(fixedData.listImages);
        } catch {
          fixedData.listImages = [];
        }
      }
      setProduct(fixedData);
      setOriginalProduct(fixedData);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  }

  // Input change handler
  function handleInputChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  }

  // File to base64 with compression
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

  // Image files change
  function handleImageFilesChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(
      (file) =>
        (file.type === "image/png" || file.type === "image/jpeg") &&
        (file.name.endsWith(".png") ||
          file.name.endsWith(".jpg") ||
          file.name.endsWith(".jpeg"))
    );
    // Tổng số ảnh hiện tại (ảnh mới + ảnh từ API)
    const totalImages = imageFiles.length + product.listImages.length;
    // Chỉ thêm số ảnh còn thiếu để không vượt quá 10
    const availableSlots = 10 - totalImages;
    const filesToAdd = validFiles.slice(0, availableSlots);
    setImageFiles((prev) => [...prev, ...filesToAdd]);
    e.target.value = "";
  }

  // Remove image file
  function handleRemoveImage(idx: number) {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  // Default image file change
  function handleDefaultImageFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (
      file &&
      (file.type === "image/png" || file.type === "image/jpeg") &&
      (file.name.endsWith(".png") ||
        file.name.endsWith(".jpg") ||
        file.name.endsWith(".jpeg"))
    ) {
      setDefaultImageFile(file);
      setProduct((prev) => ({ ...prev, defaultImage: "" }));
    }
    e.target.value = "";
  }

  // Remove default image file
  function handleRemoveDefaultImage() {
    setDefaultImageFile(null);
  }

  // Remove old default image
  function handleRemoveOldDefaultImage() {
    setProduct((prev) => ({ ...prev, defaultImage: "" }));
  }

  // Remove image from listImages
  function handleRemoveListImage(idx: number) {
    setProduct((prev) => ({
      ...prev,
      listImages: prev.listImages.filter((_, i) => i !== idx),
    }));
  }

  // Check if product changed
  function isProductChanged() {
    if (!originalProduct) return true;
    const fieldsChanged =
      JSON.stringify({
        ...product,
        listImages: originalProduct.listImages,
        defaultImage: originalProduct.defaultImage,
      }) !==
      JSON.stringify({
        ...originalProduct,
        listImages: originalProduct.listImages,
        defaultImage: originalProduct.defaultImage,
      });
    const listImagesChanged =
      JSON.stringify(product.listImages) !==
      JSON.stringify(originalProduct.listImages);
    return (
      fieldsChanged ||
      listImagesChanged ||
      imageFiles.length > 0 ||
      !!defaultImageFile
    );
  }

  // Cancel handler
  function handleCancel() {
    if (isCreateMode) {
      router.push("/admin/products");
      return;
    }
    if (isProductChanged()) setShowCancelModal(true);
    else setIsEditing(false);
  }

  // Confirm cancel
  function handleConfirmCancel() {
    if (originalProduct) {
      setProduct(originalProduct);
      setImageFiles([]);
      setDefaultImageFile(null);
    }
    setIsEditing(false);
    setShowCancelModal(false);
  }

  // Save handler
  async function handleSave() {
    setShowRequiredError(false);
    if (hasMissingRequiredFields()) {
      setShowRequiredError(true);
      setSaving(false);
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      // Append text fields
      Object.entries(product).forEach(([key, value]) => {
        if (key !== "listImages" && key !== "defaultImage")
          formData.append(key, value as string);
      });

      // Default image
      if (defaultImageFile) {
        const base64Image = await fileToBase64(defaultImageFile);
        formData.append("defaultImage", base64Image);
      }

      // Images
      const allImages: string[] = [];
      if (imageFiles.length > 0) {
        const base64Images = await Promise.all(
          imageFiles.map((file) => fileToBase64(file))
        );
        allImages.push(...base64Images);
      }
      if (product.listImages.length > 0) {
        allImages.push(...product.listImages);
      }
      formData.append("listImages", JSON.stringify(allImages));

      // API call
      let response;
      if (isCreateMode) {
        response = await fetch(`/api/products`, {
          method: "POST",
          body: formData,
        });
        if (!response.ok) throw new Error("Failed to create product");
        router.push("/admin/products");
        return;
      } else {
        response = await fetch(`/api/products/${productId}`, {
          method: "PATCH",
          body: formData,
        });
        if (!response.ok) throw new Error("Failed to update product");
        fetchProductData(productId as string);
        setIsEditing(false);
        setImageFiles([]);
        setDefaultImageFile(null);
        setShowCancelModal(false);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 2500);
      }
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setSaving(false);
    }
  }

  function hasMissingRequiredFields() {
    return (
      !product.name.trim() ||
      !product.area.trim() ||
      !product.investor.trim() ||
      !product.type.trim() ||
      !product.apartmentType.trim() ||
      !product.acreage.trim() ||
      !product.detail.trim() ||
      (!defaultImageFile && !product.defaultImage)
    );
  }

  // --- Render ---

  if (loading) {
    return (
      <PageLayout>
        <div className="container">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </PageLayout>
    );
  }

  const isFormDisabled = saving;

  return (
    <PageLayout>
      {/* Toast */}
      {showSuccessToast && (
        <div className="toast toast-top toast-end z-50">
          <div className="alert alert-success">
            <span>{t("Product.updateSuccess")}</span>
          </div>
        </div>
      )}

      <div className="container">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            {isCreateMode ? t("Product.create") : t("Product.edit")}
          </h1>
        </div>

        {showRequiredError && (
          <div className="mb-4 text-red-600 font-semibold">
            {t("Product.pleaseInputRequirefield")}
            <span className="text-red-500">*</span>
          </div>
        )}
        <div className="rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {[
                { label: t("Product.name"), name: "name", required: true },
                { label: t("Product.area"), name: "area", required: true },
                {
                  label: t("Product.investor"),
                  name: "investor",
                  required: true,
                },
                {
                  label: t("Product.type"),
                  name: "type",
                  type: "select",
                  required: true,
                  options: [
                    { value: "", label: t("Product.typeOptions.default") },
                    { value: "Đang mở bán", label: "Đang mở bán" },
                    { value: "Booking", label: "Booking" },
                    { value: "Đang bàn giao", label: "Đang bàn giao" },
                  ],
                },
                {
                  label: t("Product.typeOfApartment"),
                  name: "apartmentType",
                  required: true,
                },
                {
                  label: t("Product.acreage"),
                  name: "acreage",
                  required: true,
                },
              ].map((field) =>
                field.type === "select" ? (
                  <div key={field.name}>
                    <label className="block text-sm font-medium mb-2">
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <select
                      name={field.name}
                      value={product[field.name as keyof Product]}
                      onChange={handleInputChange}
                      disabled={!isEditing || isFormDisabled}
                      required={field.required}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div key={field.name}>
                    <label className="block text-sm font-medium mb-2">
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <input
                      type="text"
                      name={field.name}
                      value={product[field.name as keyof Product]}
                      onChange={handleInputChange}
                      disabled={!isEditing || isFormDisabled}
                      required={field.required}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Default Image */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("Product.mainImage")}
                </label>
                {isEditing && (
                  <>
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      className="file-input file-input-bordered text-black w-full max-w-xs"
                      onChange={handleDefaultImageFileChange}
                      disabled={
                        !!defaultImageFile ||
                        !!product.defaultImage ||
                        isFormDisabled
                      }
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {t("Product.mainImageDescription")}
                    </div>
                  </>
                )}
                <div className="flex gap-3 mt-2">
                  {defaultImageFile && (
                    <ImagePreview
                      src={URL.createObjectURL(defaultImageFile)}
                      alt={t("Product.mainImage")}
                      onRemove={
                        isEditing ? handleRemoveDefaultImage : undefined
                      }
                    />
                  )}
                  {!defaultImageFile && product.defaultImage && (
                    <ImagePreview
                      src={product.defaultImage}
                      alt={product.name}
                      onRemove={
                        isEditing ? handleRemoveOldDefaultImage : undefined
                      }
                    />
                  )}
                </div>
              </div>

              {/* List Images */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("Product.listImages")}
                </label>
                {isEditing && (
                  <div className="mb-2">
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      multiple
                      className="file-input file-input-bordered text-black w-full max-w-xs"
                      onChange={handleImageFilesChange}
                      disabled={
                        imageFiles.length + product.listImages.length >= 10 ||
                        isFormDisabled
                      }
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {t("Product.listImagesDescription", {
                        count: imageFiles.length + product.listImages.length,
                      })}
                    </div>
                  </div>
                )}
                <div className="flex flex-wrap gap-3">
                  {imageFiles.map((file, idx) => (
                    <ImagePreview
                      key={file.name + idx}
                      src={URL.createObjectURL(file)}
                      alt={`Hình ảnh ${idx + 1}`}
                      onRemove={
                        isEditing ? () => handleRemoveImage(idx) : undefined
                      }
                    />
                  ))}
                  {isEditing &&
                    product.listImages.map((img, idx) => (
                      <ImagePreview
                        key={img + idx}
                        src={img}
                        alt={`Hình ảnh ${idx + 1}`}
                        onRemove={() => handleRemoveListImage(idx)}
                      />
                    ))}
                  {!isEditing &&
                    product.listImages.map((img, idx) => (
                      <ImagePreview
                        key={img + idx}
                        src={img}
                        alt={`Hình ảnh ${idx + 1}`}
                      />
                    ))}
                </div>
                {isEditing &&
                  (imageFiles.length < 1 || imageFiles.length > 10) && (
                    <div className="text-red-500 text-xs mt-1">
                      {t("Product.editListImagesDescription")}
                    </div>
                  )}
              </div>

              {/* Detail */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("Product.discription")}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                  value={product.detail}
                  onEditorChange={(content) =>
                    setProduct((prev) => ({ ...prev, detail: content }))
                  }
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: ["link", "lists", "code"],
                    toolbar:
                      "undo redo | bold italic underline | bullist numlist | link",
                  }}
                  disabled={!isEditing || isFormDisabled}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end mt-6">
            {!isEditing && !isCreateMode && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={saving}
              >
                {t("Action.edit")}
              </button>
            )}
          </div>
          {(isEditing || isCreateMode) && (
            <div className="flex gap-4 pt-6 border-t mt-6 justify-end">
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center min-w-[140px]"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                    {isCreateMode ? t("Action.saving") : t("Action.updating")}
                  </>
                ) : isCreateMode ? (
                  t("Action.create")
                ) : (
                  t("Action.update")
                )}
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                disabled={saving}
              >
                {t("Action.cancel")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-2">
              {t("Action.modal.changeTitle")}
            </h3>
            <p className="mb-4">{t("Action.modal.changeMessage")}</p>
            <div className="modal-action">
              <button
                className="btn btn-success"
                onClick={() => {
                  setShowCancelModal(false);
                  handleSave();
                }}
              >
                {t("Action.modal.confirm")}
              </button>
              <button className="btn btn-outline" onClick={handleConfirmCancel}>
                {t("Action.modal.cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}

// --- Helper Component ---

function ImagePreview({
  src,
  alt,
  onRemove,
}: {
  src: string;
  alt: string;
  onRemove?: () => void;
}) {
  return (
    <div className="relative group">
      <img
        src={src}
        alt={alt}
        className="w-20 h-20 object-cover rounded border"
      />
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-80 hover:opacity-100"
          title="Xóa"
        >
          ×
        </button>
      )}
    </div>
  );
}
