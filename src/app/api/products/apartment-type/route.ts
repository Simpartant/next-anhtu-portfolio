import { NextResponse } from "next/server";
interface Product {
  apartmentType: string;
}
export async function GET() {
  // Gọi API nội bộ (chỉ nên dùng khi không thể import trực tiếp)
  const url = "http://localhost:3000/api/products";
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    // Nếu cần truyền cookie/session thì phải truyền thêm credentials
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }

  const data = await res.json();
  const products = data || [];

  const apartmentTypes = Array.from(
    new Set(products.map((p: Product) => p.apartmentType))
  );

  return NextResponse.json({ apartmentTypes });
}
