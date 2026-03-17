import AdminSidebar from "@/components/layout/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
