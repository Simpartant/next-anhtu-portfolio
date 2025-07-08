import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";

export async function GET() {
  try {
    await connectDB();
    // Lấy tất cả apartmentType duy nhất
    const apartmentTypes = await Product.distinct("apartmentType");
    return NextResponse.json({ apartmentTypes });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
