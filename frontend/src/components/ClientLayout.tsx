// src/components/ClientLayout.tsx
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import AdminLayout from "@/app/admin/admin-layout";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const isAdminRoute =
    pathname?.startsWith("/admin") || pathname === "/dashboard";

  return (
    <>
      {isAdminRoute ? <AdminLayout>{children}</AdminLayout> : <>{children}</>}
    </>
  );
};

export default ClientLayout;
