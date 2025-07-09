"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ArrowBack from "@/assets/icons/arrow-back.svg";
import PageLayout from "@/components/Admin/PageLayout";
import Image from "next/image";

type Contact = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  project: string;
  message: string;
};

export default function AdminContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchContact = async () => {
      try {
        const res = await fetch(`/api/contacts/${id}`);
        const data = await res.json();
        setContact(data.data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setContact(null);
      } finally {
        setLoading(false);
      }
    };
    fetchContact();
  }, [id]);

  return (
    <PageLayout>
      <div className="w-full max-w-xl mx-0 mt-10 p-0">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.push("/admin/contacts")}
            className="flex items-center gap-2 text-sm text-white hover:bg-white/10 hover:text-white px-3 py-2 rounded transition"
          >
            <Image src={ArrowBack} className="w-5 h-5 text-white" alt="" />
            Trở về danh sách
          </button>
          <h1 className="text-2xl font-bold text-left">Chi tiết liên hệ</h1>
        </div>
        <div className="flex justify-start">
          <div className="shadow-lg rounded-xl p-8 w-full border border-gray-700">
            {loading ? (
              <div className="text-gray-500">Đang tải...</div>
            ) : contact ? (
              <div className="space-y-5">
                <div>
                  <span className="block text-xs text-gray-400 uppercase mb-1">
                    Tên
                  </span>
                  <span className="text-lg font-semibold">{contact.name}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-400 uppercase mb-1">
                    Email
                  </span>
                  <span className="text-base">{contact.email}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-400 uppercase mb-1">
                    Số điện thoại
                  </span>
                  <span className="text-base">{contact.phone}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-400 uppercase mb-1">
                    Dự án
                  </span>
                  <span className="text-base">{contact.project}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-400 uppercase mb-1">
                    Tin nhắn
                  </span>
                  <div className="rounded text-base">{contact.message}</div>
                </div>
              </div>
            ) : (
              <div className="text-red-500">Không tìm thấy liên hệ.</div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
