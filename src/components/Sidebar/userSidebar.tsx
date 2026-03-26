"use client";

import { RiDashboardLine } from "react-icons/ri";
import { BsCalendar3, BsGrid1X2 } from "react-icons/bs";
import { TbClipboardList } from "react-icons/tb";
import { LuLogOut } from "react-icons/lu";
import { usePathname, useRouter } from "next/navigation";
import useLoginStore from "@/store/login";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

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
  const [isOpen, setIsOpen] = useState(false);

  const isRouteActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const handleNavigate = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-200">
            <BsGrid1X2 size={14} />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-slate-900">CampusConnect</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              User Panel
            </p>
          </div>
        </div>

        <button
          type="button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-700"
        >
          {isOpen ? <FiX size={18} /> : <FiMenu size={18} />}
        </button>
      </div>

      {isOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
        />
      ) : null}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-dvh w-72 flex-col justify-between border-r border-gray-200 bg-white px-3 py-6 font-sans transition-transform duration-200 md:static md:z-auto md:h-screen md:w-70 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
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

          <nav className="flex flex-col gap-0.5">
            {navItems.map((item) => {
              const isActive = isRouteActive(item.href);

              return (
                <button
                  key={item.label}
                  onClick={() => handleNavigate(item.href)}
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

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-150"
        >
          <LuLogOut size={16} />
          Logout
        </button>
      </aside>
    </>
  );
}
