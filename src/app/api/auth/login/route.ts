import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";

const SECRET = process.env.JWT_SECRET || "your-secret-key";
const ADMIN_PASSWORD_PATH = path.join(process.cwd(), "data", "admin.json");

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (username === "admin") {
    const data = await fs.readFile(ADMIN_PASSWORD_PATH, "utf-8");
    const { password: realPassword } = JSON.parse(data);

    if (password === realPassword) {
      const token = jwt.sign({ role: "admin" }, SECRET, { expiresIn: "1h" });

      const res = NextResponse.json({ success: true });
      res.cookies.set("token", token, {
        httpOnly: true,
        maxAge: 3600,
        path: "/",
      });

      return res;
    }
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
