"use client";

import Image from "next/image";
import FullLogo from "../assets/logo/full-logo.svg";
import LogoOnly from "../assets/logo/Only-logo.svg";
import HambugerIcon from "../assets/icons/hambugerIcon.svg";
import Link from "next/link";
import { useTranslations } from "next-intl";
import SwitchLocale from "./SwitchLocale";
import { getNavItems, NavItem } from "../constants/navItems";
import { useEffect, useRef, useState } from "react";
import {
  fetchApartmentTypes,
  fetchProjects,
  fetchAreas,
  ApartmentType,
  Project,
  Area,
} from "../lib/api";

type SubMenuItem = { name: string; href: string };
type SubItem = { name: string; subMenuItem: SubMenuItem[] };

function RenderSubMenu({
  subItems,
  onItemClick,
}: {
  subItems: SubItem[];
  onItemClick?: () => void;
}) {
  return (
    <ul className="p-2">
      {subItems.map((subItem, index) => (
        <li key={`submenu-${index}`}>
          <div className="font-bold">{subItem.name}</div>
          {subItem.subMenuItem?.length > 0 && (
            <ul>
              {subItem.subMenuItem.map((subMenu, subMenuIndex) => (
                <li key={`submenu-item-${index}-${subMenuIndex}`}>
                  <Link href={subMenu.href} onClick={onItemClick}>
                    {subMenu.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

function MobileMenu({ navItems }: { navItems: NavItem[] }) {
  const mobileMenuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        // Close the mobile dropdown by removing focus
        const dropdownButton = document.querySelector(
          ".dropdown .btn-ghost"
        ) as HTMLElement;
        if (dropdownButton) {
          dropdownButton.blur();
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closeMobileDropdown = () => {
    // Multiple approaches to ensure dropdown closes
    const dropdownButton = document.querySelector(
      ".dropdown .btn-ghost"
    ) as HTMLElement;
    const dropdown = document.querySelector(".dropdown") as HTMLElement;

    if (dropdownButton) {
      dropdownButton.blur();
    }

    // Force remove focus from any focused element within dropdown
    if (dropdown) {
      const focusedElement = dropdown.querySelector(":focus") as HTMLElement;
      if (focusedElement) {
        focusedElement.blur();
      }
    }

    // Trigger a click outside to close dropdown
    setTimeout(() => {
      document.body.click();
    }, 10);
  };

  return (
    <ul
      ref={mobileMenuRef}
      tabIndex={0}
      className="menu menu-sm dropdown-content bg-neutral rounded-box z-50 mt-3 w-52 p-2 shadow"
    >
      {navItems.map((item, index) => (
        <li key={`mobile-nav-${index}`}>
          {!item.subItems ? (
            <Link href={item.href!} onClick={closeMobileDropdown}>
              {item.name}
            </Link>
          ) : (
            <>
              <a>{item.name}</a>
              <RenderSubMenu
                subItems={item.subItems}
                onItemClick={closeMobileDropdown}
              />
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

function DesktopMenu({ navItems }: { navItems: NavItem[] }) {
  const menuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        const allDetails = menuRef.current.querySelectorAll("details");
        allDetails.forEach((detail) => {
          (detail as HTMLDetailsElement).removeAttribute("open");
        });
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closeAllDropdowns = () => {
    const allDetails = menuRef.current?.querySelectorAll("details");
    allDetails?.forEach((detail) => {
      (detail as HTMLDetailsElement).removeAttribute("open");
    });
  };

  return (
    <ul className="menu menu-horizontal px-1" ref={menuRef}>
      {navItems.map((item, index) => (
        <li className="mr-5 text-base relative" key={`desktop-nav-${index}`}>
          {!item.subItems ? (
            <Link href={item.href!}>{item.name}</Link>
          ) : (
            <details className="group">
              <summary className="cursor-pointer">{item.name}</summary>
              <ul
                className="menu xl:menu-horizontal bg-neutral rounded-box lg:min-w-max absolute left-1/2 z-50 mt-2"
                style={{ transform: "translateX(-50%)" }}
              >
                {item.subItems.map((subItem, subIndex) => (
                  <li key={`desktop-sub-${index}-${subIndex}`}>
                    <div className="font-bold">{subItem.name}</div>
                    {subItem.subMenuItem?.length > 0 && (
                      <ul>
                        {subItem.subMenuItem.map((subMenu, subMenuIndex) => (
                          <li
                            key={`desktop-submenu-${index}-${subIndex}-${subMenuIndex}`}
                          >
                            <Link
                              href={subMenu.href}
                              onClick={closeAllDropdowns}
                            >
                              {subMenu.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function Navigation() {
  const t = useTranslations("Navigation");
  const [areas, setAreas] = useState<Area[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [apartmentTypes, setApartmentTypes] = useState<ApartmentType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [areasData, projectsData, apartmentTypesData] = await Promise.all(
          [fetchAreas(), fetchProjects(), fetchApartmentTypes()]
        );
        setAreas(areasData);
        setProjects(projectsData);
        setApartmentTypes(apartmentTypesData);
      } catch (error) {
        console.error("Error fetching navigation data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const navItems: NavItem[] = getNavItems(t, areas, projects, apartmentTypes);
  if (loading) {
    return (
      <div className="flex w-full flex-col z-50">
        <SwitchLocale />
        <div className="divider bg-neutral m-0"></div>
        <div className="navbar bg-neutral shadow-sm py-5">
          <div className="container mx-auto flex flex-row items-center justify-center">
            <div className="loading loading-spinner loading-md"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col z-50">
      <SwitchLocale />
      <div className="divider bg-neutral m-0"></div>
      <div className="navbar bg-neutral shadow-sm py-5">
        <div className="container mx-auto flex flex-row items-center justify-start">
          <div className="navbar-start">
            <div className="dropdown">
              <div className="flex flex-row">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost lg:hidden"
                >
                  <Image
                    src={HambugerIcon}
                    alt="hambuger icon"
                    className="invert brightness-0"
                  />
                </div>
                <div className="lg:hidden">
                  <Link href="/">
                    <Image src={LogoOnly} className="w-10" alt="Logo only" />
                  </Link>
                </div>
              </div>
              <MobileMenu navItems={navItems} />
            </div>
            <Link className="max-lg:hidden" href="/">
              <Image src={FullLogo} alt="full logo" />
            </Link>
          </div>
          <div className="navbar-center hidden lg:flex">
            <DesktopMenu navItems={navItems} />
          </div>
        </div>
      </div>
    </div>
  );
}
