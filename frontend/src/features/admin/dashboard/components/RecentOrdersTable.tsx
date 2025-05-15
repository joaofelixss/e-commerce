// frontend/features/dashboard/components/RecentOrdersTable.tsx
import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getRecentOrders } from "@/features/admin/dashboard/api/dashboard"; // Importe a função da API

interface RecentOrder {
  id: string;
  customerName: string;
  orderDate: Date;
  status: "pendente" | "concluído" | "cancelado";
  total: number;
}

const statusColors = {
  pendente: "text-yellow-500",
  concluído: "text-green-500",
  cancelado: "text-red-500",
};

const RecentOrdersTable = () => {
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoadingOrders(true);
    getRecentOrders()
      .then((data) => {
        setRecentOrders(
          data.map((order) => ({
            ...order,
            orderDate: new Date(order.orderDate), // Converter string para Date
          }))
        );
      })
      .catch((err) => {
        console.error("Erro ao buscar pedidos recentes:", err);
        setError("Erro ao carregar os pedidos recentes.");
      })
      .finally(() => setLoadingOrders(false));
  }, []);

  if (loadingOrders) {
    return <div>Carregando pedidos recentes...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Pedidos Recentes</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Data do Pedido</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>
                  {format(order.orderDate, "dd/MM/yyyy HH:mm", {
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell className={statusColors[order.status]}>
                  {order.status.toUpperCase()}
                </TableCell>
                <TableCell className="text-right">
                  R$ {order.total.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
            {recentOrders.length === 0 && !loadingOrders && !error && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Nenhum pedido recente encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RecentOrdersTable;
