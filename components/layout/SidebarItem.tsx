import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface Props {
  label: string;
  href: string;
  icon?: ReactNode;
  isCollapsed?: boolean;
}

export const SidebarItem = ({ label, href, icon, isCollapsed = false }: Props) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      title={isCollapsed ? label : undefined}
      className={`group flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
        isActive
          ? "bg-primary text-white shadow-lg shadow-indigo-500/30 font-semibold"
          : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
      } ${isCollapsed ? "justify-center gap-0 w-11 mx-auto" : "gap-3"}`}
    >
      <div className={`transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
        {icon}
      </div>
      {!isCollapsed && <span className="text-sm tracking-wide transition-all duration-300 opacity-100">{label}</span>}
      {!isCollapsed && isActive && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
      )}
    </Link>
  );
};
