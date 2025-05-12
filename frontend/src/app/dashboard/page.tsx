// frontend/pages/dashboard.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardStatusCards from "@/features/dashboard/components/DashboardStatusCards";
import DashboardNavigationLinks from "@/features/dashboard/components/DashboardNavigationLinks";
import RecentOrdersTable from "@/features/dashboard/components/RecentOrdersTable";

const DashboardPage = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      setIsLoggedIn(true);
    } else {
      router.push("/login");
    }
    setLoadingAuth(false);
  }, [router]);

  if (loadingAuth) {
    return <div>Verificando autenticação...</div>;
  }

  if (!isLoggedIn) {
    return null; // Já redirecionou para /login
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      {isLoggedIn && <DashboardStatusCards />}{" "}
      {/* Renderiza somente se isLoggedIn for true */}
      <DashboardNavigationLinks />
      <RecentOrdersTable />
      <p className="text-gray-700 mt-6">Bem-vinda!</p>
      {/* ... restante do conteúdo ... */}
    </div>
  );
};

export default DashboardPage;
