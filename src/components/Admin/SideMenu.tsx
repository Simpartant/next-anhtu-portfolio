"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SwitchLocale from "../SwitchLocale";
import { useTranslations } from "next-intl";

export default function SideMenu() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const t = useTranslations("Admin.SideMenu");

  const locale = pathname.split("/")[1] || "en";

  async function handleLogout() {
    await fetch(`/api/auth/logout`, { method: "POST" });
    router.push(`/${locale}/admin/login`);
  }

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/admin/verify");
      if (!res.ok) {
        router.push("/admin/login");
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <nav className="flex flex-col h-full">
      <ul className="menu bg-neutral rounded-box mb-4">
        <li>
          <Link href="/admin/dashboard" className="font-semibold">
            {t("dashboard")}
          </Link>
        </li>
        <li>
          <Link href="/admin/blogs" className="font-semibold">
            {t("blogs")}
          </Link>
        </li>
        <li>
          <Link href="/admin/products" className="font-semibold">
            {t("products")}
          </Link>
        </li>
        <li>
          <Link href="/admin/contacts" className="font-semibold">
            {t("contacts")}
          </Link>
        </li>
        <li>
          <SwitchLocale role={"admin"} />
        </li>
      </ul>
      <button onClick={handleLogout} className="btn btn-error mt-4 w-full">
        {t("logout")}
      </button>
    </nav>
  );
}
