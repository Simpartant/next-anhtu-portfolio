import { NextResponse } from "next/server";

interface Product {
  name: string;
}

export async function GET() {
  try {
    const baseUrl = process.env.PROD_URL || "http://localhost:3000";

    const url = baseUrl + "/api/products";
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 }
      );
    }

    const data = await res.json();
    const products = data || [];

    const projects = Array.from(new Set(products.map((p: Product) => p.name)));

    return NextResponse.json({ projects });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
