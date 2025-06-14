import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function verifyToken(token: string): "valid" | "expired" | "invalid" {
  try {
    const checkValid = jwt.verify(token, JWT_SECRET!);
    console.log("🚀 ~ verifyToken ~ checkValid:", checkValid);

    return "valid";
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "name" in err &&
      (err as { name: string }).name === "TokenExpiredError"
    ) {
      return "expired";
    }
    return "invalid";
  }
}
