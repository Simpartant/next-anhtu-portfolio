import { Metadata } from "next";

import { fetchBlogById } from "@/lib/blogs";
import BlogDetail from "@/components/Blogs/BlogDetail";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await fetchBlogById(id);
  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      type: "article",
      url: `${process.env.PROD_URL}/blogs/${id}`,
      images: [
        {
          url: "https://blog.myoceancity.vn/wp-content/uploads/lich-su-ttbds-2.jpg",
          width: 1200,
          height: 630,
          alt: data.title,
        },
      ],
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { id } = await params;
  const blog = await fetchBlogById(id);

  const prevPage = [
    { name: "Trang chủ", href: "/" },
    { name: "Blogs", href: "/blogs" },
  ];

  return <BlogDetail data={blog} prevPage={prevPage} />;
}
