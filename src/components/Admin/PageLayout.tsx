import { ReactNode } from "react";
import SideMenu from "./SideMenu";

type Props = {
  children?: ReactNode;
};

export default function PageLayout({ children }: Props) {
  return (
    <div>
      <SideMenu />
      <div>{children}</div>
    </div>
  );
}
