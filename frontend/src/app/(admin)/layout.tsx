"use client";

import React from "react";
import { Toaster } from "sonner"; // Mantenha Toaster
import { SiteHeader } from "@/features/admin/components/site-header"; // Certifique-se que o caminho está correto

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
      <Toaster richColors />
    </div>
  );
};

export default AdminLayout;
