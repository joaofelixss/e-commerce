// src/app/(admin)/layout.tsx
"use client";

import React from "react";
import SidebarComponent from "@/features/admin/components/Sidebar";
import { Toaster } from "sonner";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/features/admin/components/site-header";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const isMobile = () => window.innerWidth < 768;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <SidebarProvider>
      <div className="h-screen overflow-hidden flex w-full">
        {!isMobile() && !isSidebarOpen ? null : (
          <SidebarComponent
            variant="inset"
            open={isSidebarOpen}
            onOpenChange={setIsSidebarOpen}
            className="w-64 shrink-0 border-r transition-transform duration-300"
          />
        )}
        <SidebarInset className="flex-1 overflow-y-auto">
          <SiteHeader
            onOpenSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />
          <div className="p-4 md:p-6">
            <main className="flex-1">{children}</main>
          </div>
        </SidebarInset>
        <Toaster richColors />
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
