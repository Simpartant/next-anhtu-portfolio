"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "./ProductCard";
import { useTranslations } from "next-intl";

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

  const fetchProducts = async (apartmentType?: string) => {
    try {
      let url = "/api/products";
      if (apartmentType) {
        url += `?apartmentType=${encodeURIComponent(apartmentType)}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    const fetchApartmentTypes = async () => {
      try {
        const res = await fetch("/api/products/apartment-type");
        const data = await res.json();
        setApartmentTypes(data.apartmentTypes || []);
      } catch (error) {
        console.error("Failed to fetch apartment types:", error);
      }
    };

    fetchApartmentTypes();
    fetchProducts();
  }, []);

  // Fetch products when selectedType changes
  useEffect(() => {
    fetchProducts(selectedType || undefined);
  }, [selectedType]);

  return (
    <div className="py-4 max-sm:px-6 md:py-20">
      <div className="text-3xl">{t("title")}</div>
      {apartmentTypes.length > 0 && (
        <div className="mt-12 flex flex-wrap gap-2">
          <button
            className={`btn btn-primary-2 rounded-xl ${
              selectedType === null
                ? "font-bold border-2 border-gray-600"
                : "font-normal"
            }`}
            onClick={() => setSelectedType(null)}
          >
            All
          </button>
          {apartmentTypes.map((type) => (
            <button
              key={type}
              className={`btn btn-primary-2 rounded-xl ${
                selectedType === type
                  ? "font-bold border-2 border-gray-600"
                  : "font-normal"
              }`}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {products.slice(0, 5).map((product) => (
          <ProductCard key={product.slug} {...product} />
        ))}
        <div className="flex items-center justify-center">
          <button
            className="btn btn-primary-2 rounded-xl"
            onClick={() => router.push("/products")}
          >
            {t("seeAllProducts")}
          </button>
        </div>
      </div>
    </div>
  );
}
