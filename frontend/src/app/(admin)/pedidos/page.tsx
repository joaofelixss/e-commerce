"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { toast, ToastContainer } from "react-toastify";
import {
  getAllOrders,
  updateOrderStatus,
} from "@/features/admin/dashboard/api/dashboard";
import OrderDetailModal from "@/features/admin/gerenciar-pedidos/components/OrderDetailModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderDetail, OrderListItem } from "@/features/admin/gerenciar-pedidos/types/pedidos";

const OrdersPage = () => {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOrderDetailModalOpen, setIsOrderDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [statusUpdates, setStatusUpdates] = useState<{
    [orderId: string]: "pendente" | "concluído" | "cancelado";
  }>({});
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllOrders();
      setOrders(data.pedidos);
      // Inicializa o estado de statusUpdates com o status atual dos pedidos
      const initialStatusUpdates: {
        [orderId: string]: "pendente" | "concluído" | "cancelado";
      } = {};
      data.pedidos.forEach((order) => {
        initialStatusUpdates[order.id] = order.status;
      });
      setStatusUpdates(initialStatusUpdates);
    } catch (err: unknown) {
      setError("Erro ao carregar os pedidos.");
      console.error("Erro ao buscar pedidos:", err);
      toast.error("Erro ao carregar os pedidos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewOrder = (order: OrderListItem) => {
    setSelectedOrder({
      id: order.id,
      cliente: order.cliente,
      criadoEm: order.criadoEm,
      status: order.status,
      total: order.total,
      enderecoEntrega: order.enderecoEntrega,
      produtos: [],
    });
    setIsOrderDetailModalOpen(true);
  };

  const closeOrderDetailModal = () => {
    setIsOrderDetailModalOpen(false);
    setSelectedOrder(null);
  };

  const handleStatusChange = (
    orderId: string,
    newStatus: "pendente" | "concluído" | "cancelado"
  ) => {
    setStatusUpdates((prev) => ({ ...prev, [orderId]: newStatus }));
  };

  const handleUpdateStatus = async (orderId: string) => {
    setUpdatingStatus(true);
    const newStatus = statusUpdates[orderId];
    try {
      await updateOrderStatus(orderId, newStatus); // Chama a função da API
      toast.success(`Status do pedido ${orderId} atualizado para ${newStatus}`);
      // Recarrega os pedidos para atualizar a tabela
      await fetchOrders();
    } catch (error: unknown) {
      console.error(`Erro ao atualizar o status do pedido ${orderId}:`, error);
      toast.error(`Erro ao atualizar o status do pedido ${orderId}`);
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="container mx-auto py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center">
        <Link href="/dashboard" className="hover:underline mr-4">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold">Gerenciamento de Pedidos</h1>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-2 text-left">
                ID do Pedido
              </TableHead>
              <TableHead className="px-4 py-2 text-left">
                Data do Pedido
              </TableHead>
              <TableHead className="px-4 py-2 text-left">Cliente</TableHead>
              <TableHead className="px-4 py-2 text-left">Valor Total</TableHead>
              <TableHead className="px-4 py-2 text-left">Status</TableHead>
              <TableHead className="px-4 py-2 text-left">Ações</TableHead>
              <TableHead className="px-4 py-2 text-left">
                Alterar Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="px-4 py-2 font-medium">
                  {order.id}
                </TableCell>
                <TableCell className="px-4 py-2">
                  {new Date(order.criadoEm).toLocaleDateString()}
                </TableCell>
                <TableCell className="px-4 py-2">
                  {order.cliente.nome}
                </TableCell>
                <TableCell className="px-4 py-2">
                  R$ {order.total.toFixed(2)}
                </TableCell>
                <TableCell className="px-4 py-2">{order.status}</TableCell>
                <TableCell className="px-4 py-2">
                  <Button size="sm" onClick={() => handleViewOrder(order)}>
                    Visualizar
                  </Button>
                </TableCell>
                <TableCell className="px-4 py-2">
                  <Select
                    value={statusUpdates[order.id]}
                    onValueChange={(value) =>
                      handleStatusChange(
                        order.id,
                        value as "pendente" | "concluído" | "cancelado"
                      )
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="concluído">Concluído</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    className="mt-2"
                    onClick={() => handleUpdateStatus(order.id)}
                    disabled={
                      updatingStatus || statusUpdates[order.id] === order.status
                    }
                  >
                    {updatingStatus ? "Atualizando..." : "Salvar Status"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <OrderDetailModal
        open={isOrderDetailModalOpen}
        onOpenChange={closeOrderDetailModal}
        order={selectedOrder}
      />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default OrdersPage;
