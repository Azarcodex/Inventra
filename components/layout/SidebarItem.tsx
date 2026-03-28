"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  label: string;
  href: string;
}

export const SidebarItem = ({ label, href }: Props) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center p-3 rounded-lg transition-colors ${
        isActive
          ? "bg-blue-600 text-white font-bold"
          : "text-gray-400 hover:bg-gray-800 hover:text-white"
      }`}
    >
      <span>{label}</span>
    </Link>
  );
};
