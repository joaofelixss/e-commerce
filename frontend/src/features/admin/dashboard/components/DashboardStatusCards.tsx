// frontend/features/dashboard/components/DashboardStatusCards.tsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSignIcon,
  PackageIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
} from "lucide-react";
import {
  getTotalRevenue,
  getOrderCounts,
  getLowStockCount,
} from "@/features/admin/dashboard/api/dashboard";

interface DashboardStatusCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  className?: string;
}

const DashboardStatusCard: React.FC<DashboardStatusCardProps> = ({
  title,
  value,
  icon,
  className,
}) => (
  <Card className={`shadow-sm ${className}`}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const DashboardStatusCards = () => {
  const [totalRevenue, setTotalRevenue] = useState<number | string>(
    "Carregando..."
  );
  const [totalOrders, setTotalOrders] = useState<number | string>(
    "Carregando..."
  );
  const [pendingOrders, setPendingOrders] = useState<number | string>(
    "Carregando..."
  );
  const [completedOrders, setCompletedOrders] = useState<number | string>(
    "Carregando..."
  );
  const [lowStockItems, setLowStockItems] = useState<number | string>(
    "Carregando..."
  );
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    setLoadingData(true);
    Promise.all([getTotalRevenue(), getOrderCounts(), getLowStockCount()])
      .then(([revenue, counts, lowStock]) => {
        setTotalRevenue(`R$ ${revenue.toFixed(2)}`);
        setTotalOrders(counts.pending + counts.completed + counts.cancelled);
        setPendingOrders(counts.pending);
        setCompletedOrders(counts.completed);
        setLowStockItems(lowStock);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados do dashboard:", error);
      })
      .finally(() => {
        setLoadingData(false);
      });
  }, []);

  if (loadingData) {
    return <div>Carregando dados do dashboard...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <DashboardStatusCard
        title="Faturamento Total"
        value={totalRevenue}
        icon={<DollarSignIcon className="w-4 h-4 text-green-500" />}
      />
      <DashboardStatusCard
        title="Total de Pedidos"
        value={totalOrders}
        icon={<PackageIcon className="w-4 h-4 text-blue-500" />}
      />
      <DashboardStatusCard
        title="Pedidos Pendentes"
        value={pendingOrders}
        icon={<AlertTriangleIcon className="w-4 h-4 text-yellow-500" />}
      />
      <DashboardStatusCard
        title="Pedidos Concluídos"
        value={completedOrders}
        icon={<CheckCircleIcon className="w-4 h-4 text-green-500" />}
      />
      {/* Ocultando Cancelados por enquanto para não sobrecarregar - podemos adicionar depois */}
      {/* <DashboardStatusCard title="Pedidos Cancelados" value={cancelledOrders} icon={<XCircleIcon className="w-4 h-4 text-red-500" />} /> */}
      <DashboardStatusCard
        title="Itens com Baixo Estoque"
        value={lowStockItems}
        icon={<AlertTriangleIcon className="w-4 h-4 text-orange-500" />}
        className="lg:col-span-2"
      />
    </div>
  );
};

export default DashboardStatusCards;
