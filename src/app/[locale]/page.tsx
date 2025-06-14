"use client";
import { redirect, usePathname } from "next/navigation";

// This page only renders when the app is built statically (output: 'export')
export default function RootPage() {
  const pathname = usePathname();

  const locale = pathname.split("/")[1] || "vi";
  redirect(`/${locale}/home`);
}
