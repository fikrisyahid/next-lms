"use client";

import { IconChevronDown, IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useState } from "react";

type NavbarItemsProps = {
  label: string;
  leftIcon: ReactNode;
  href?: string;
  subItems?: { label: string; href: string }[];
  onClick?: () => void;
};

export default function NavbarItems({
  label,
  leftIcon,
  href,
  subItems,
  onClick,
}: NavbarItemsProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const isActive = href && pathname === href;

  // If there are no subItems, render a simple link
  if (!subItems || subItems.length === 0) {
    return (
      <Link
        href={href || "#"}
        className={`flex items-center w-full px-3 py-2 text-left rounded-lg transition hover:bg-gray-800 text-gray-200 ${
          isActive ? "bg-gray-800" : ""
        }`}
        onClick={onClick}
      >
        {leftIcon}
        <span className="flex-1 text-sm">{label}</span>
      </Link>
    );
  }

  // Render a collapsible menu for items with subItems
  return (
    <div className="text-gray-200">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center w-full px-3 py-2 text-left hover:bg-gray-800 rounded-lg transition"
      >
        {leftIcon}
        <span className="flex-1 text-sm">{label}</span>
        {open ? (
          <IconChevronDown className="w-4 h-4 opacity-70" />
        ) : (
          <IconChevronRight className="w-4 h-4 opacity-70" />
        )}
      </button>

      {open && (
        <div className="mt-1 ml-5 flex flex-col gap-1 border-l border-gray-700 pl-3">
          {subItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClick}
              className={`block px-2 py-1 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition ${
                pathname === item.href ? "bg-gray-800" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
