"use client";

import { BsCalendar3, BsGrid1X2, BsMic } from "react-icons/bs";
import { LuLogOut } from "react-icons/lu";
import { RiDashboardLine } from "react-icons/ri";
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
    href: "/faculty/dashboard",
  },
  {
    label: "Event",
    icon: <BsCalendar3 size={16} />,
    href: "/faculty/event",
  },
  {
    label: "Speaker",
    icon: <BsMic size={16} />,
    href: "/faculty/speaker",
  },
];

export default function FacultySidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const logout = useLoginStore((state) => state.logout);

  const isRouteActive = (href: string) => {
    if (href === "/faculty/dashboard" && pathname === "/faculty") {
      return true;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <aside className="flex h-screen w-70 flex-col justify-between border-r border-gray-200 bg-white px-3 py-6 font-sans">
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
                Faculty Panel
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
                onClick={() => router.push(item.href)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors duration-150 ${
                  isActive
                    ? "bg-blue-50 font-semibold text-blue-600"
                    : "font-normal text-gray-700 hover:bg-gray-100"
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
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors duration-150 hover:bg-gray-100"
      >
        <LuLogOut size={16} />
        Logout
      </button>
    </aside>
  );
}
