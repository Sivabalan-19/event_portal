"use client";

import { BsCalendar3, BsGrid1X2, BsPeople } from "react-icons/bs";
import { LuSettings, LuLogOut } from "react-icons/lu";
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

  return (
    <aside className="flex h-screen w-62 flex-col justify-between border-r border-slate-200 bg-white font-sans">
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
                onClick={() => router.push(item.href)}
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
          className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-150"
        >
          <LuLogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
