import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export function checkToken(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie") || "";
  const tokenMatch = cookieHeader.match(/(?:^|;\s*)token=([^;]*)/);
  const token = tokenMatch ? tokenMatch[1] : null;
  if (!token) return null;
  return verifyToken(token);
}
