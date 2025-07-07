import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const ADMIN_PHONE = process.env.ADMIN_PHONE;
const ADMIN_PASSWORD_PATH = path.join(process.cwd(), "data", "admin.json");

export async function POST(req: Request) {
  const { phone, newPassword } = await req.json();

  if (phone !== ADMIN_PHONE) {
    return NextResponse.json(
      { error: "Invalid phone number" },
      { status: 401 }
    );
  }

  await fs.writeFile(
    ADMIN_PASSWORD_PATH,
    JSON.stringify({ password: newPassword }),
    "utf-8"
  );
  return NextResponse.json({ success: true });
}
