// frontend/features/dashboard/components/RecentOrdersTable.tsx
import React from "react";
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
  // Aqui você buscará os dados reais dos pedidos recentes do seu backend
  const recentOrders: RecentOrder[] = [
    {
      id: "1",
      customerName: "Ana Silva",
      orderDate: new Date(),
      status: "concluído",
      total: 75.5,
    },
    {
      id: "2",
      customerName: "Pedro Oliveira",
      orderDate: new Date(Date.now() - 86400000),
      status: "pendente",
      total: 32.0,
    },
    {
      id: "3",
      customerName: "Mariana Souza",
      orderDate: new Date(Date.now() - 172800000),
      status: "concluído",
      total: 120.99,
    },
    {
      id: "4",
      customerName: "Lucas Pereira",
      orderDate: new Date(Date.now() - 259200000),
      status: "cancelado",
      total: 15.0,
    },
  ];

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
            {recentOrders.length === 0 && (
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
