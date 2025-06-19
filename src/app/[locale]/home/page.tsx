import Blogs from "@/components/Blogs/Blogs";
import Discover from "@/components/Discover";
import Hero from "@/components/Hero";
import ListLogo from "@/components/ListLogo";
import ActionComponent from "@/components/ActionComponent";
import ClientFeedback from "@/components/ClientFeedback";
import ContactMe from "@/components/ContactMe";
import Products from "@/components/Products/Products";

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
