import { ApartmentType, Project, Area } from "../lib/api";

// Define the translation function type directly, as next-intl does not export TFunction
type TFunction = (key: string) => string;

export type SubMenuItem = { name: string; href: string };
export type SubItem = { name: string; subMenuItem: SubMenuItem[] };
export type NavItem = {
  name: string;
  href?: string;
  subItems?: SubItem[];
};

export function getNavItems(
  t: TFunction,
  areas: Area[] = [],
  projects: Project[] = [],
  apartmentTypes: ApartmentType[] = []
): NavItem[] {
  // Ensure all parameters are arrays
  const safeAreas = Array.isArray(areas) ? areas : [];
  const safeProjects = Array.isArray(projects) ? projects : [];
  const safeApartmentTypes = Array.isArray(apartmentTypes)
    ? apartmentTypes
    : [];

  return [
    { name: t("home"), href: "/" },
    { name: t("about"), href: "/about" },
    {
      name: t("product"),
      subItems: [
        {
          name: t("subMenuHeading.area"),
          subMenuItem: safeAreas.map((area) => ({
            name: area.name,
            href: `/products?area=${area.name}`,
          })),
        },
        {
          name: t("subMenuHeading.products"),
          subMenuItem: safeProjects.map((project) => ({
            name: project.name,
            href: `/products?project=${project.name}`,
          })),
        },
        {
          name: t("subMenuHeading.typeOfApartments"),
          subMenuItem: safeApartmentTypes.map((type) => ({
            name: type.name,
            href: `/products?apartmentType=${type.name}`,
          })),
        },
      ],
    },
    { name: t("blogs"), href: "/blogs" },
    { name: t("contact"), href: "/contact" },
  ];
}
