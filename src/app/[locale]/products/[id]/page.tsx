"use client";
import { decodeId } from "@/utils/hash";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = decodeId(params?.id as string);

  useEffect(() => {
    if (!id || id.length < 24) {
      router.replace("/404");
    }
  }, [id, router]);

  if (!id) return null; // Tránh render nội dung khi đang redirect

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold">Product Detail Page</h1>
      <p>This is the product detail page content.</p>
    </div>
  );
}
