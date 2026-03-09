import AdminSidebar from "@/components/Sidebar/adminSidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex h-screen">
        <ProtectedRoute allowedRoles={["superadmin"]}>
          <AdminSidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </ProtectedRoute>
      </body>
    </html>
  );
}