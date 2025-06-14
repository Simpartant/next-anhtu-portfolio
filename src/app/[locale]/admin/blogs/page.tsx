import PageLayout from "@/components/Admin/PageLayout";
import Link from "next/link";

export default function BlogsAdminPage() {
  return (
    <PageLayout>
      <div className="container">
        <h1 className="text-2xl font-bold mb-4">Blogs Admin Page</h1>
        <p>This is the admin page for managing blogs.</p>
        {/* Add your blog management components here */}
        <Link href={"/admin/blogs/create-blog"}>Create a blog</Link>
      </div>
    </PageLayout>
  );
}
