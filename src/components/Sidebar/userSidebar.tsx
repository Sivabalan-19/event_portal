"use client";

import { RiDashboardLine } from "react-icons/ri";
import { BsCalendar3, BsGrid1X2 } from "react-icons/bs";
import { TbClipboardList } from "react-icons/tb";
import { LuLogOut } from "react-icons/lu";
import { usePathname, useRouter } from "next/navigation";
import useLoginStore from "@/store/login";

type NavItem = {
  label: string;
  icon: React.ReactNode;
  href: string;
};

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    icon: <RiDashboardLine size={18} />,
    href: "/student/dashboard",
  },
  {
    label: "All Events",
    icon: <BsCalendar3 size={16} />,
    href: "/student/events",
  },
  {
    label: "My Registrations",
    icon: <TbClipboardList size={18} />,
    href: "/student/registrations",
  },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const logout = useLoginStore((state) => state.logout);

  const isRouteActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <aside className="flex h-screen w-70 flex-col justify-between border-r border-gray-200 bg-white px-3 py-6 font-sans">
      <div>
        {/* User Profile */}
        <div className="border-b border-slate-200 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-200">
              <BsGrid1X2 size={16} />
            </div>
            <div>
              <p className="text-lg font-bold leading-tight text-slate-900">
                CampusConnect
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                User Panel
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const isActive = isRouteActive(item.href);

            return (
              <button
                key={item.label}
                onClick={() => router.push(item.href)}
                className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm text-left transition-colors duration-150 ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-700 font-normal hover:bg-gray-100"
                }`}
              >
                <span className={isActive ? "text-blue-600" : "text-gray-500"}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-150"
      >
        <LuLogOut size={16} />
        Logout
      </button>
    </aside>
  );
}
