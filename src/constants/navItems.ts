// Define the translation function type directly, as next-intl does not export TFunction
type TFunction = (key: string) => string;

export type SubMenuItem = { name: string; href: string };
export type SubItem = { name: string; subMenuItem: SubMenuItem[] };
export type NavItem = {
  name: string;
  href?: string;
  subItems?: SubItem[];
};

export function getNavItems(t: TFunction): NavItem[] {
  return [
    { name: t("home"), href: "/" },
    { name: t("about"), href: "/about" },
    {
      name: t("product"),
      subItems: [
        {
          name: t("subMenuHeading.area"),
          subMenuItem: [
            { name: "Thành phố Hồ Chí Minh", href: "/products" },
            { name: "Bình Dương", href: "/" },
            { name: "Đà Nẵng", href: "/" },
          ],
        },
        {
          name: t("subMenuHeading.projects"),
          subMenuItem: [
            { name: "Vinhome city", href: "/" },
            { name: "The sóng", href: "/" },
            { name: "Celadon city", href: "/" },
          ],
        },
        {
          name: t("subMenuHeading.typeOfApartments"),
          subMenuItem: [
            { name: "Căn hộ chung cư", href: "/" },
            { name: "Duplex", href: "/" },
            { name: "Nhà mặt tiền", href: "/" },
            { name: "Nhà Phố", href: "/" },
          ],
        },
      ],
    },
    { name: t("blogs"), href: "/blogs" },
    { name: t("contact"), href: "/contact" },
  ];
}
