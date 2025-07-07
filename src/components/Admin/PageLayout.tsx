import { ReactNode } from "react";
import SideMenu from "./SideMenu";

type Props = {
  children?: ReactNode;
};

export default function PageLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen bg-base-100">
      <aside className="min-w-[200px] p-4 bg-neutral">
        <SideMenu />
      </aside>
      <main className="flex-1 bg-primary-2 p-6">{children}</main>
    </div>
  );
}
