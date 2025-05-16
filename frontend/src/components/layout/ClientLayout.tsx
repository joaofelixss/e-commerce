// src/components/ClientLayout.tsx
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import AdminLayoutWithProvider from "@/app/(admin)/layout";
import AdminNavbar from "@/features/admin/components/AdminNavBar";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const isAdminRoute =
    pathname?.startsWith("/admin") || pathname === "/dashboard";

  return (
    <>
      <AdminNavbar />
      {isAdminRoute ? (
        <AdminLayoutWithProvider>{children}</AdminLayoutWithProvider>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default ClientLayout;
