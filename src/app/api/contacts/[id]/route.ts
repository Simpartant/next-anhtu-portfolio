import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";

export async function GET(req: NextRequest) {
  await connectDB();

  const url = new URL(req.url);
  const id = url.pathname.split("/").pop(); // lấy id từ URL

  try {
    const contact = await Contact.findById(id).lean();
    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }
    return NextResponse.json({ data: contact });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
