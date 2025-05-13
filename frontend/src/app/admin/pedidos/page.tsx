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
import { getAllOrders } from "@/api/dashboard"; // Importe getAllOrders
import OrderDetailModal from "@/features/pedidos/components/OrderDetailModal";

// Defina a interface para um Pedido (para a listagem)
interface OrderListItem {
  id: string;
  cliente: { nome: string; email: string };
  criadoEm: Date;
  status: "pendente" | "concluído" | "cancelado";
  total: number;
}

// Defina a interface para os detalhes do pedido (para o modal)
interface OrderDetail {
  id: string;
  cliente: { nome: string; email: string };
  criadoEm: Date;
  status: string;
  total: number;
  enderecoEntrega: {
    cep: string;
    rua: string;
    bairro: string;
    cidade: string;
    estado: string;
    numero: string;
    complemento: string | null;
  } | null;
  produtos: {
    produtoId: string;
    preco: number;
    quantidade: number;
    name?: string; // Podemos tentar buscar o nome depois, se necessário
  }[];
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOrderDetailModalOpen, setIsOrderDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllOrders();
      setOrders(data.pedidos); // Acesse a propriedade 'pedidos'
    } catch (err: any) {
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
      produtos: [], // Inicializamos como um array vazio aqui, pois não temos os detalhes completos ainda
    });
    setIsOrderDetailModalOpen(true);
  };

  const closeOrderDetailModal = () => {
    setIsOrderDetailModalOpen(false);
    setSelectedOrder(null);
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
