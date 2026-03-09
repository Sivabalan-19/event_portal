"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  clearStoredToken,
  getDefaultRouteForRole,
  getRoleFromToken,
  getStoredToken,
  type UserRole,
} from "@/utils/auth";

type ProtectedRouteProps = {
  allowedRoles: UserRole[];
  children: React.ReactNode;
};

export default function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  const allowedRoleKey = useMemo(() => allowedRoles.join(","), [allowedRoles]);

  useEffect(() => {
    const token = getStoredToken();
    const role = getRoleFromToken(token);

    if (!token || !role) {
      clearStoredToken();
      router.replace("/login");
      setIsChecking(false);
      return;
    }

    if (!allowedRoles.includes(role)) {
      router.replace(getDefaultRouteForRole(role));
      setIsChecking(false);
      return;
    }

    setIsChecking(false);
  }, [allowedRoleKey, allowedRoles, pathname, router]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-sm text-slate-500">
        Checking access...
      </div>
    );
  }

  return <>{children}</>;
}
