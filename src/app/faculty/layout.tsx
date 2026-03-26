import ProtectedRoute from "@/components/auth/ProtectedRoute";
import FacultySidebar from "@/components/Sidebar/facultySidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-dvh flex-col md:h-screen md:flex-row">
        <ProtectedRoute allowedRoles={["organizer"]}>
          <FacultySidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </ProtectedRoute>
      </body>
    </html>
  );
}
