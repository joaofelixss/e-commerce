// frontend/pages/dashboard.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardStatusCards from "@/features/admin/dashboard/components/DashboardStatusCards";
import DashboardNavigationLinks from "@/features/admin/dashboard/components/DashboardNavigationLinks";
import RecentOrdersTable from "@/features/admin/dashboard/components/RecentOrdersTable";
import LowStockAlerts from "@/features/admin/dashboard/components/LowStockAlerts"; // Importe o componente
import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getSalesPerformance } from "@/features/admin/dashboard/api/dashboard";

const DashboardPage = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [salesData, setSalesData] = useState<
    { name: string; Vendas: number }[]
  >([]);
  const [loadingSalesData, setLoadingSalesData] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      setIsLoggedIn(true);
      setLoadingSalesData(true);
      getSalesPerformance()
        .then((data) => {
          setSalesData(data);
        })
        .catch((error) => {
          console.error("Erro ao buscar dados de desempenho de vendas:", error);
        })
        .finally(() => {
          setLoadingSalesData(false);
        });
    } else {
      router.push("/login");
    }
    setLoadingAuth(false);
  }, [router]);

  if (loadingAuth) {
    return <div>Verificando autenticação...</div>;
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-6">Visão Geral</h1>
      <DashboardStatusCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardContent className="h-80">
            <h2 className="text-lg font-semibold mb-4">
              Desempenho de Vendas (Última Semana)
            </h2>
            {loadingSalesData ? (
              <div>Carregando dados do gráfico...</div>
            ) : (
              <ResponsiveContainer width="100%" height="80%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="Vendas"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold mb-4">Pedidos Recentes</h2>
            <RecentOrdersTable />
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
        <DashboardNavigationLinks />
      </div>

      <div className="mt-8">
        <LowStockAlerts />{" "}
        {/* Renderiza o componente de alertas de estoque baixo */}
      </div>
    </div>
  );
};

export default DashboardPage;
