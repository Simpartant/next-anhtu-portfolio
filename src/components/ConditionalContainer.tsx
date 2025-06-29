"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function ConditionalContainer({ children }: Props) {
  const pathname = usePathname();

  const isAdmin = pathname.includes("/admin");
  const isAbout = pathname.includes("/about");

  if (isAdmin) {
    return <>{children}</>;
  }

  if (isAbout) {
    return <>{children}</>;
  }

  return <div className="container mx-auto h-full">{children}</div>;
}
