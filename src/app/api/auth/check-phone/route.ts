import { NextResponse } from "next/server";

const ADMIN_PHONE = process.env.ADMIN_PHONE;

export async function POST(req: Request) {
  const { phone } = await req.json();
  if (phone === ADMIN_PHONE) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: "Invalid phone number" }, { status: 401 });
}
