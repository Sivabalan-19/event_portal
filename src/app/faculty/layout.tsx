import FacultySidebar from "@/components/Sidebar/facultySidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex h-screen">
        <FacultySidebar />
        <main className="flex-1 overflow-y-scroll">{children}</main>
      </body>
    </html>
  );
}
