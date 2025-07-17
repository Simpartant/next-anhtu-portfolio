"use client";
import ActionComponent from "@/components/ActionComponent";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContactMe from "@/components/ContactMe";
import { ProjectType } from "@/models/Product";
import { decodeId } from "@/utils/hash";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Head from "next/head";

// Types
interface ProductData {
  _id: string;
  name: string;
  area: string;
  investor: string;
  detail: string;
  type: ProjectType;
  apartmentType: string;
  acreage: string;
  listImages: string[] | string;
}

interface ProductResponse {
  data: ProductData;
}

// Custom hooks
const useProduct = (id: string) => {
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!id || id.length < 24) {
      router.replace("/404");
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        router.replace("/404");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, router]);

  return { product, loading };
};

// Utility functions
const parseImages = (listImages: string[] | string): string[] => {
  if (Array.isArray(listImages)) {
    return listImages;
  }

  if (typeof listImages === "string") {
    try {
      return JSON.parse(listImages);
    } catch {
      return [];
    }
  }

  return [];
};

// Components
const ImageGallery = ({
  images,
  selectedImage,
  onImageSelect,
}: {
  images: string[];
  selectedImage: string | null;
  onImageSelect: (image: string) => void;
}) => {
  if (!selectedImage || images.length === 0) return null;

  return (
    <div className="py-5 lg:py-10">
      {/* Main Image */}
      <div className="mb-4 flex justify-center">
        <img
          src={selectedImage}
          alt="Product"
          className="w-full h-[20rem] lg:h-[50rem] border border-gray-800 mb-4 bg-zinc-900 object-contain"
        />
      </div>

      {/* Desktop Thumbnails */}
      <div className="hidden xl:flex gap-2 justify-between">
        {images.map((img: string, idx: number) => (
          <ThumbnailImage
            key={idx}
            src={img}
            alt={`Thumbnail ${idx + 1}`}
            isSelected={selectedImage === img}
            onClick={() => onImageSelect(img)}
            className="w-36 h-36"
          />
        ))}
      </div>

      {/* Mobile/Tablet Carousel */}
      <div className="xl:hidden">
        <div className="carousel carousel-center max-w-full p-4 space-x-4">
          {images.map((img: string, idx: number) => (
            <div key={idx} className="carousel-item">
              <ThumbnailImage
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                isSelected={selectedImage === img}
                onClick={() => onImageSelect(img)}
                className="w-24 h-24 md:w-32 md:h-32 lg:w-28 lg:h-28"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ThumbnailImage = ({
  src,
  alt,
  isSelected,
  onClick,
  className,
}: {
  src: string;
  alt: string;
  isSelected: boolean;
  onClick: () => void;
  className: string;
}) => (
  <img
    src={src}
    alt={alt}
    className={`${className} object-cover rounded cursor-pointer border ${
      isSelected ? "border-blue-500" : "border-gray-200"
    }`}
    onClick={onClick}
  />
);

const ProductInfo = ({
  product,
  t,
}: {
  product: ProductData;
  t: (key: string) => string;
}) => (
  <>
    <div className="flex flex-col items-start gap-6 py-5 lg:py-10">
      <div className="text-3xl">{product.investor}</div>
      <div className="text-base text-gray-400">
        {t("project")} {product.name} {t("in")} {product.area}
      </div>
    </div>

    <div className="divider"></div>

    <div className="flex flex-row justify-between lg:justify-start lg:gap-50 py-5 lg:py-10">
      <InfoItem label={t("area")} value={product.acreage} />
      <InfoItem label={t("typeOfApartment")} value={product.apartmentType} />
      <InfoItem label={t("time")} value={product.type} />
    </div>
  </>
);

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-3 items-start">
    <div className="text-gray-400">{label}</div>
    <strong>{value}</strong>
  </div>
);

const ProductDetail = ({
  detail,
  t,
}: {
  detail: string;
  t: (key: string) => string;
}) => (
  <div className="py-5 lg:py-10">
    <div className="font-bold text-2xl">{t("information")}</div>
    <div
      className="prose prose-lg text-base/8 max-w-none mt-4 
        prose-headings:text-white 
        prose-p:text-gray-300 
        prose-a:text-blue-400 prose-a:underline hover:prose-a:text-blue-300
        prose-ul:text-gray-300 prose-ol:text-gray-300
        prose-li:text-gray-300 prose-li:marker:text-gray-400
        prose-strong:text-white
        prose-em:text-gray-300
        [&_img]:w-[65rem]
        [&_img]:py-6
        [&_a]:text-blue-400 [&_a]:underline [&_a:hover]:text-blue-300
        [&_ul]:list-disc [&_ul]:ml-6
        [&_ol]:list-decimal [&_ol]:ml-6"
      dangerouslySetInnerHTML={{ __html: detail }}
    />
  </div>
);

// Skeleton component
const ProductSkeleton = () => (
  <div className="animate-pulse">
    {/* Breadcrumbs skeleton */}
    <div className="h-6 w-40 bg-base-300 rounded mb-8 skeleton"></div>

    {/* Image skeleton */}
    <div className="mb-4 flex justify-center">
      <div className="w-full h-[20rem] lg:h-[50rem] bg-base-300 rounded skeleton"></div>
    </div>
    <div className="hidden xl:flex gap-2 justify-between mb-8">
      {[...Array(5)].map((_, idx) => (
        <div key={idx} className="w-36 h-36 bg-base-300 rounded skeleton"></div>
      ))}
    </div>
    <div className="xl:hidden flex gap-2 mb-8">
      {[...Array(3)].map((_, idx) => (
        <div
          key={idx}
          className="w-24 h-24 md:w-32 md:h-32 lg:w-28 lg:h-28 bg-base-300 rounded skeleton"
        ></div>
      ))}
    </div>

    {/* Info skeleton */}
    <div className="flex flex-col items-start gap-6 py-5 lg:py-10">
      <div className="h-8 w-48 bg-base-300 rounded skeleton"></div>
      <div className="h-4 w-64 bg-base-300 rounded skeleton"></div>
    </div>
    <div className="divider"></div>
    <div className="flex flex-row justify-between lg:justify-start lg:gap-50 py-5 lg:py-10">
      {[...Array(3)].map((_, idx) => (
        <div key={idx} className="flex flex-col gap-3 items-start">
          <div className="h-4 w-20 bg-base-300 rounded skeleton"></div>
          <div className="h-6 w-24 bg-base-300 rounded skeleton"></div>
        </div>
      ))}
    </div>

    {/* Detail skeleton */}
    <div className="py-5 lg:py-10">
      <div className="h-6 w-40 bg-base-300 rounded skeleton mb-4"></div>
      <div className="space-y-3">
        {[...Array(5)].map((_, idx) => (
          <div
            key={idx}
            className="h-4 w-full bg-base-300 rounded skeleton"
          ></div>
        ))}
      </div>
    </div>
  </div>
);

// Main component
export default function ProductDetailPage() {
  const params = useParams();
  const id = decodeId(params?.id as string);
  const t = useTranslations("ProductPage.detail");

  const { product, loading } = useProduct(id);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Set initial selected image when product loads
  useEffect(() => {
    if (product?.data?.listImages) {
      const images = parseImages(product.data.listImages);
      if (images.length > 0) {
        setSelectedImage(images[0]);
      }
    }
  }, [product]);

  if (!id || loading) return <ProductSkeleton />;

  const prevPage = [
    { name: t("home"), href: "/" },
    { name: t("products"), href: "/products" },
  ];

  const images = parseImages(product?.data?.listImages || []);
  const mainImage = images[0];

  return (
    <>
      <Head>
        <title>{product?.data?.name}</title>
        <meta property="og:title" content={product?.data?.name} />
        <meta property="og:image" content={mainImage} />
        <meta
          property="og:description"
          content={`Khu vực: ${product?.data?.area} - Chủ đầu tư: ${product?.data?.investor}`}
        />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={typeof window !== "undefined" ? window.location.href : ""}
        />
      </Head>
      <div className="container mx-auto px-6 xl:px-0">
        <div className="py-10 lg:py-20">
          <Breadcrumbs
            prevPage={prevPage}
            currentPage={product?.data?.name ?? "Product Details"}
          />

          <ImageGallery
            images={images}
            selectedImage={selectedImage}
            onImageSelect={setSelectedImage}
          />

          {product?.data && (
            <>
              <ProductInfo product={product.data} t={t} />
              {product.data.detail && (
                <ProductDetail detail={product.data.detail} t={t} />
              )}
            </>
          )}
        </div>
      </div>
      <ActionComponent />
      <ContactMe />
    </>
  );
}
