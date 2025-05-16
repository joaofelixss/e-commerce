// src/app/(admin)/layout.tsx
"use client";

import React from "react";
import Sidebar from "@/features/admin/components/Sidebar";
import { Menu } from "lucide-react";
import { SidebarProvider, useSidebarContext } from "@/contexts/SidebarContext";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { toggleSidebar } = useSidebarContext();

  return (
    <div className="">
      <Sidebar />

      <div className="flex-1 transition-margin duration-300 ml-0">
        <Button
          onClick={toggleSidebar}
          variant="ghost"
          className="fixed top-2 left-1 z-50 in-hover"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <main className="">{children}</main>
      </div>
      <Toaster richColors />
    </div>
  );
};

const AdminLayoutWithProvider: React.FC<AdminLayoutProps> = ({ children }) => (
  <SidebarProvider>
    <AdminLayout>{children}</AdminLayout>
  </SidebarProvider>
);

export default AdminLayoutWithProvider;
