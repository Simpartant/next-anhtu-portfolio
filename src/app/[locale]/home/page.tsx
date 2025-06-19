import Blogs from "@/components/Blogs/Blogs";
import Hero from "@/components/Hero";
import ListLogo from "@/components/ListLogo";

export default function HomePage() {
  return (
    <div className="container mx-auto">
      <Hero />
      <ListLogo />
      {/* <Discover /> */}
      <Blogs />
      {/* <Products />
      <ActionComponent />
      <ClientFeedback />
      <ContactMe /> */}
    </div>
  );
}
