// frontend/src/components/OrderDetailModal.tsx
"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OrderDetail } from "../types/pedidos";

interface OrderDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderDetail | null;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  open,
  onOpenChange,
  order,
}) => {
  if (!order) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Pedido #{order.id}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Data do Pedido:</p>
              <p>
                {new Date(order.criadoEm).toLocaleDateString()}{" "}
                {new Date(order.criadoEm).toLocaleTimeString()}
              </p>
            </div>
            <div>
              <p className="font-semibold">Cliente:</p>
              <p>{order.cliente.nome}</p>
              <p>{order.cliente.email}</p>
            </div>
          </div>
          {order.enderecoEntrega && (
            <div>
              <p className="font-semibold">Endereço de Entrega:</p>
              <p>
                {order.enderecoEntrega.rua}, {order.enderecoEntrega.numero}{" "}
                {order.enderecoEntrega.complemento}
              </p>
              <p>
                {order.enderecoEntrega.bairro} - {order.enderecoEntrega.cidade},{" "}
                {order.enderecoEntrega.estado} - {order.enderecoEntrega.cep}
              </p>
            </div>
          )}
          <div>
            <p className="font-semibold">Status do Pedido:</p>
            <p>{order.status}</p>
          </div>
          <div>
            <p className="font-semibold">Itens do Pedido:</p>
            <ul>
              {order.produtos.map((item) => (
                <li key={item.produtoId} className="py-2">
                  {item.quantidade} x Produto ID: {item.produtoId} - R${" "}
                  {item.preco.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold">Valor Total:</p>
            <p className="text-lg font-bold">R$ {order.total.toFixed(2)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;
