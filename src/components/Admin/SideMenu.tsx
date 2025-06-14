import Link from "next/link";

export default function SideMenu() {
  return (
    <>
      <Link href={"/admin/dashboard"}>Dashboard</Link>
      <Link href={"/admin/blogs"}>Blogs</Link>
      <Link href={"/admin/projecs"}>Project</Link>
    </>
  );
}
