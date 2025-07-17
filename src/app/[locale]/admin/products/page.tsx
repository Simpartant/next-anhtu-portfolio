"use client";

import PageLayout from "@/components/Admin/PageLayout";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  area: string;
  investor: string;
}

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const t = useTranslations("Admin");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products", {
          credentials: "include",
        });
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/products/${productToDelete._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setProducts(products.filter((p) => p._id !== productToDelete._id));
        setProductToDelete(null);
      } else {
        console.error("Delete failed");
      }
    } catch (error) {
      console.error("Delete error", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setProductToDelete(null);
  };

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.investor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <PageLayout>
      <div className="container">
        <h1 className="text-2xl font-bold mb-4">{t("Product.namePage")}</h1>

        <div className="mb-4 flex justify-between items-center gap-4">
          <div className="max-w-md">
            <input
              type="text"
              placeholder={t("Search.products")}
              className="input input-bordered border-gray-700 shadow-none bg-primary-2 w-[34rem]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Link
            href="/admin/products/create-product"
            className="btn btn-primary shadow-none text-black border-none"
          >
            {t("Product.create")}
          </Link>
        </div>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="text-white">
                  <th>{t("Product.name")}</th>
                  <th>{t("Product.area")}</th>
                  <th>{t("Product.investor")}</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product) => (
                  <tr
                    className="hover:bg-gray-700 border-b-gray-700"
                    key={product._id}
                  >
                    <td>{product.name}</td>
                    <td>{product.area}</td>
                    <td>{product.investor}</td>
                    <td>
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/products/${product._id}`}
                          className="btn btn-sm btn-info"
                        >
                          {t("Action.edit")}
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(product)}
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

            {filteredProducts.length === 0 && !loading && (
              <div className="text-center py-4 text-gray-500">
                {searchTerm
                  ? t("Product.noProductFound")
                  : t("Product.noProductAvailable")}
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
        {productToDelete && (
          <div className="modal modal-open">
            <div className="modal-box bg-neutral">
              <h3 className="font-bold text-lg">{t("Product.deleteTitle")}</h3>
              <p className="py-4">
                {t("Product.deleteMessage", {
                  title: productToDelete.name,
                })}
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
