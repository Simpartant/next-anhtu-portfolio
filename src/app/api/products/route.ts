import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { checkToken } from "@/lib/checkToken";

export async function POST(req: NextRequest) {
  const user = checkToken(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();

  const {
    name,
    area,
    investor,
    defaultImage,
    listImages,
    detail,
    type,
    apartmentType,
    acreage,
    slug,
  } = await req.json();

  if (
    !name ||
    !area ||
    !investor ||
    !defaultImage ||
    !Array.isArray(listImages) ||
    !detail ||
    !type ||
    !apartmentType ||
    !acreage ||
    !slug
  ) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const newProduct = await Product.create({
      name,
      area,
      investor,
      defaultImage,
      listImages,
      detail,
      type,
      apartmentType,
      acreage,
      slug,
    });
    return NextResponse.json(newProduct, { status: 201 });
  } catch (err) {
    console.error("Error creating product:", err);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const area = searchParams.get("area");
    const investor = searchParams.get("investor");
    const apartmentType = searchParams.get("apartmentType");

    const filter: Record<string, string> = {};
    if (type) filter.type = type;
    if (area) filter.area = area;
    if (investor) filter.investor = investor;
    if (apartmentType) filter.apartmentType = apartmentType;

    const products = await Product.find(filter).sort({ createdAt: -1 });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
