"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/Admin/PageLayout";
import * as XLSX from "xlsx";
import { useTranslations } from "next-intl";

type Contact = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  project: string;
  message: string;
};

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const router = useRouter();

  const t = useTranslations("Admin");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch("/api/contacts");
        const data = await res.json();
        setContacts(data.data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleRowClick = (id: string) => {
    router.push(`/admin/contacts/${id}`);
  };

  const handleExport = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(filteredContacts);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");
      XLSX.writeFile(workbook, "contacts.xlsx");
      setToastMsg(t("Contact.exportSuccess"));
    } catch (err) {
      setToastMsg(t("Contact.exportError"));
      console.error(err);
    }
  };

  useEffect(() => {
    if (toastMsg) {
      const timer = setTimeout(() => setToastMsg(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [toastMsg]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 10;

  // Filtered contacts
  const filteredContacts = contacts.filter((contact) => {
    const term = searchTerm.toLowerCase();
    return (
      contact.name.toLowerCase().includes(term) ||
      contact.email.toLowerCase().includes(term) ||
      contact.phone.toLowerCase().includes(term) ||
      contact.project.toLowerCase().includes(term)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * contactsPerPage,
    currentPage * contactsPerPage
  );

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <PageLayout>
      {/* Toast daisyUI */}
      <div className="toast toast-top toast-end z-50">
        {toastMsg && (
          <div className="alert alert-success text-white">
            <span>{toastMsg}</span>
          </div>
        )}
      </div>
      <div className="container">
        <h1 className="text-2xl font-bold mb-4">{t("Contact.namePage")}</h1>
        <div className="mb-4 flex justify-between items-center gap-4">
          <input
            type="text"
            placeholder={t("Search.contacts")}
            className="input input-bordered border-gray-700 shadow-none bg-primary-2 w-[34rem] max-w-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleExport}
            disabled={loading || filteredContacts.length === 0}
          >
            {t("Contact.exportExcel")}
          </button>
        </div>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="text-white">
                <tr>
                  <th>{t("Contact.name")}</th>
                  <th>{t("Contact.email")}</th>
                  <th>{t("Contact.phone")}</th>
                  <th>{t("Contact.project")}</th>
                  <th>{t("Contact.message")}</th>
                </tr>
              </thead>
              <tbody>
                {paginatedContacts.map((contact) => (
                  <tr
                    key={contact._id}
                    onClick={() => handleRowClick(contact._id)}
                    className="cursor-pointer hover:bg-gray-700 border-b-gray-700"
                  >
                    <td>{contact.name}</td>
                    <td>{contact.email}</td>
                    <td>{contact.phone}</td>
                    <td>{contact.project}</td>
                    <td className="truncate max-w-xs">{contact.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredContacts.length === 0 && !loading && (
              <div className="text-center py-4 text-gray-500">
                {searchTerm
                  ? t("Contact.noContactFound")
                  : t("Contact.noContactAvailable")}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="join">
                  <button
                    className="join-item btn"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    «
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      className={`join-item btn ${
                        currentPage === i + 1 ? "btn-active" : ""
                      }`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    className="join-item btn"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    »
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
