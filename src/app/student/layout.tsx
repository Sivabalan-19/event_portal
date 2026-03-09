import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Sidebar from "@/components/Sidebar/userSidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex h-screen">
        <ProtectedRoute allowedRoles={["student"]}>
          <Sidebar />
          <main className="flex-1 overflow-y-scroll">{children}</main>
        </ProtectedRoute>
      </body>
    </html>
  );
}
