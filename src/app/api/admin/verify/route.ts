import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET() {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "No token" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    return NextResponse.json({ success: true, user: decoded });
  } catch (err) {
    console.error("Token verification error:", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
