"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "./ProductCard";
import { useTranslations } from "next-intl";
import { useLoading } from "@/contexts/LoadingContext";

interface ProductProps {
  _id: string;
  name: string;
  area: string;
  investor: string;
  defaultImage: string;
  slug: string;
}

export default function Products() {
  const router = useRouter();
  const t = useTranslations("ProductPage");
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [apartmentTypes, setApartmentTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const { loading, setLoading } = useLoading();

  // Fetch apartment types và products đồng thời, dùng chung loading
  const fetchAll = async (apartmentType?: string) => {
    try {
      setLoading(true);
      const [typesRes, productsRes] = await Promise.all([
        fetch("/api/products/apartment-type"),
        fetch(
          apartmentType
            ? `/api/products?apartmentType=${encodeURIComponent(apartmentType)}`
            : "/api/products"
        ),
      ]);
      const typesData = await typesRes.json();
      const productsData = await productsRes.json();
      setApartmentTypes(typesData.apartmentTypes || []);
      setProducts(productsData);
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedType !== null) {
      fetchAll(selectedType);
    } else {
      fetchAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType]);

  return (
    <div className="py-4 px-6 xl:px-0 md:py-20">
      <div className="text-3xl">{t("title")}</div>
      <div className="mt-12 flex flex-wrap gap-2">
        {loading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="skeleton h-10 w-24 rounded-xl" />
          ))
        ) : (
          <>
            <button
              className={`btn btn-primary-2 shadow-none text-white border-none rounded-xl ${
                selectedType === null
                  ? "font-bold border-2 border-solid border-gray-600"
                  : "font-normal"
              }`}
              onClick={() => setSelectedType(null)}
            >
              All
            </button>
            {apartmentTypes.map((type) => (
              <button
                key={type}
                className={`btn btn-primary-2 shadow-none text-white border-none rounded-xl ${
                  selectedType === type
                    ? "font-bold border-2 border-solid border-gray-600"
                    : "font-normal"
                }`}
                onClick={() => setSelectedType(type)}
              >
                {type}
              </button>
            ))}
          </>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {loading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-2 p-4 rounded-xl bg-primary-2 bg-opacity-10 shadow-lg"
            >
              <div className="skeleton h-40 w-full rounded-xl" />
              <div className="skeleton h-6 w-2/3" />
              <div className="skeleton h-4 w-1/2" />
              <div className="skeleton h-4 w-1/3" />
            </div>
          ))
        ) : (
          <>
            {products.slice(0, 5).map((product) => (
              <ProductCard key={product.name} {...product} />
            ))}
            <div className="flex items-center justify-center">
              <button
                className="btn btn-primary-2 shadow-none text-white border-none rounded-xl"
                onClick={() => router.push("/products")}
              >
                {t("seeAllProducts")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
