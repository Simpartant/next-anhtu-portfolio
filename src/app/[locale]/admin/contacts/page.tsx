"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/Admin/PageLayout";

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
  const router = useRouter();

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

  const filteredContacts = contacts.filter((contact) => {
    const term = searchTerm.toLowerCase();
    return (
      contact.name.toLowerCase().includes(term) ||
      contact.email.toLowerCase().includes(term) ||
      contact.phone.toLowerCase().includes(term) ||
      contact.project.toLowerCase().includes(term)
    );
  });

  return (
    <PageLayout>
      <div className="container">
        <h1 className="text-2xl font-bold mb-4">Admin Contacts</h1>
        <div className="mb-4 flex justify-between items-center gap-4">
          <input
            type="text"
            placeholder="Search by name, email, phone, or project..."
            className="input input-bordered border-gray-700 shadow-none bg-primary-2 w-[34rem] max-w-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="text-white">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Project</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact) => (
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
                  ? "No contacts found matching your search."
                  : "No contacts available."}
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
