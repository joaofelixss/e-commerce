// src/app/admin/admin-layout.tsx
"use client";

import React from "react";
import Sidebar from "@/features/dashboard/components/Sidebar";
import { Menu } from "lucide-react";
import { SidebarProvider, useSidebarContext } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isOpen, toggleSidebar } = useSidebarContext();

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 transition-margin duration-300 ml-0">
        <Button
          onClick={toggleSidebar}
          variant="ghost"
          className="fixed top-2 left-2 z-50 md:hidden" // Botão fixo no topo esquerdo, escondido em telas médias e maiores
        >
          <Menu className="h-6 w-6" />
        </Button>
        <main className="py-4 px-4 sm:px-6 lg:px-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

// Wrapper para fornecer o contexto
const AdminLayoutWithProvider: React.FC<AdminLayoutProps> = ({ children }) => (
  <SidebarProvider>
    <AdminLayout>{children}</AdminLayout>
  </SidebarProvider>
);

export default AdminLayoutWithProvider;
