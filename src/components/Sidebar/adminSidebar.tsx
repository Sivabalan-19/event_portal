"use client";

import { BsCalendar3, BsGrid1X2, BsPeople } from "react-icons/bs";
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
    icon: <BsGrid1X2 size={16} />,
    href: "/admin/dashboard",
  },
  {
    label: "Speakers",
    icon: <BsPeople size={16} />,
    href: "/admin/speaker",
  },
  {
    label: "Events Review",
    icon: <BsCalendar3 size={16} />,
    href: "/admin/event",
  },
];

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const logout = useLoginStore((state) => state.logout);
  const [isOpen, setIsOpen] = useState(false);

  const isRouteActive = (href: string) => {
    if (href === "/admin/dashboard" && pathname === "/admin") {
      return true;
    }

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
              Admin Panel
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
        className={`fixed left-0 top-0 z-50 flex h-dvh w-72 flex-col justify-between border-r border-slate-200 bg-white font-sans transition-transform duration-200 md:static md:z-auto md:h-screen md:w-62 md:translate-x-0 ${
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
                  Admin Panel
                </p>
              </div>
            </div>
          </div>

          <nav className="space-y-1 px-3 py-5">
            {navItems.map((item) => {
              const isActive = isRouteActive(item.href);

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavigate(item.href)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-colors duration-150 ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                  }`}
                >
                  <span className={isActive ? "text-blue-600" : "text-slate-400"}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-200 px-5 py-5">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors duration-150 hover:bg-gray-100"
          >
            <LuLogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
