"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { LoadingProvider } from "@/contexts/LoadingContext";

type Props = {
  children: ReactNode;
};

export default function ConditionalLayout({ children }: Props) {
  const pathname = usePathname();

  const isAdmin = pathname.includes("/admin");
  const isAbout = pathname.includes("/about");

  // Admin layout - no Navigation, no Footer, no container
  if (isAdmin) {
    return <>{children}</>;
  }

  // About page - with Navigation and Footer, but no container
  if (isAbout) {
    return (
      <>
        <LoadingProvider>
          <Navigation />
          {children}
          <Footer />
        </LoadingProvider>
      </>
    );
  }

  // Regular pages - with Navigation, Footer, and container
  return (
    <>
      <LoadingProvider>
        <Navigation />
        <div className="container mx-auto h-full">{children}</div>
        <Footer />
      </LoadingProvider>
    </>
  );
}
