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

  const formData = await req.formData();

  const name = formData.get("name") as string;
  const area = formData.get("area") as string;
  const investor = formData.get("investor") as string;
  const defaultImage = formData.get("defaultImage") as string;
  const listImagesString = formData.get("listImages") as string;
  const detail = formData.get("detail") as string;
  const type = formData.get("type") as string;
  const apartmentType = formData.get("apartmentType") as string;
  const acreage = formData.get("acreage") as string;

  // Parse listImages từ string JSON
  let listImages: string[] = [];
  try {
    listImages = JSON.parse(listImagesString);
  } catch (error) {
    console.error("Error parsing listImages:", error);
    return NextResponse.json(
      { error: "Invalid listImages format" },
      { status: 400 }
    );
  }

  if (
    !name ||
    !area ||
    !investor ||
    !defaultImage ||
    !Array.isArray(listImages) ||
    !detail ||
    !type ||
    !apartmentType ||
    !acreage
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

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .select("name area investor defaultImage slug apartmentType") // thêm apartmentType
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit); // giới hạn 50 sản phẩm

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
