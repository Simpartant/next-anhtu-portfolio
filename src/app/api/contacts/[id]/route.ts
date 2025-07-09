import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await connectDB();
  const { id } = context.params;

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
