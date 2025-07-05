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
    const areas = searchParams.getAll("area"); // Lấy tất cả area params
    const investors = searchParams.getAll("investor"); // Lấy tất cả investor params
    const apartmentType = searchParams.get("apartmentType");
    const project = searchParams.get("project"); // Thêm project filter

    const filter: Record<string, unknown> = {};
    if (type) filter.type = type;
    if (areas.length > 0) {
      if (areas.length === 1) {
        filter.area = areas[0];
      } else {
        // Nếu có nhiều hơn 1 area, sử dụng $in operator
        filter.area = { $in: areas };
      }
    }
    if (investors.length > 0) {
      if (investors.length === 1) {
        filter.investor = investors[0];
      } else {
        // Nếu có nhiều hơn 1 investor, sử dụng $in operator
        filter.investor = { $in: investors };
      }
    }
    if (apartmentType) filter.apartmentType = apartmentType;
    if (project) filter.name = project; // Filter theo name field

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
