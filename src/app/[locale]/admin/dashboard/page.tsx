"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import PageLayout from "@/components/Admin/PageLayout";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

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
    <PageLayout>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white p-2 rounded"
      >
        Logout
      </button>
    </PageLayout>
  );
}
