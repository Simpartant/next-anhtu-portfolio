import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  // Gắn cứng tài khoản
  if (username === "admin" && password === "admin123") {
    const token = jwt.sign({ role: "admin" }, SECRET, { expiresIn: "1h" });

    const res = NextResponse.json({ success: true });
    res.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 3600, // 1 hour
      path: "/",
    });

    return res;
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
