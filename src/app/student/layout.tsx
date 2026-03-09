import Sidebar from "@/components/Sidebar/userSidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-scroll">{children}</main>
      </body>
    </html>
  );
}
