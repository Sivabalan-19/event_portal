import ProtectedRoute from "@/components/auth/ProtectedRoute";
import FacultySidebar from "@/components/Sidebar/facultySidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex h-screen">
        <ProtectedRoute allowedRoles={["organizer"]}>
          <FacultySidebar />
          <main className="flex-1 overflow-y-scroll">{children}</main>
        </ProtectedRoute>
      </body>
    </html>
  );
}
