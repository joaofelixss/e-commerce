"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/features/produtos/store/cartStore";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart as ShoppingCartIcon,
  ArrowLeft,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CartItem {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
  imagemUrl: string;
  cor?: string | null;
  tamanho?: string | null;
}

const ShoppingCart = () => {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.items);
  const removeItemFromCart = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const totalItemsCount = useCartStore((state) => state.totalItems);
  const totalPrice = useCartStore((state) => state.totalPrice);
  const clearCart = useCartStore((state) => state.clearCart);

  const handleRemoveItem = (
    itemId: string,
    cor?: string | null | undefined,
    tamanho?: string | null | undefined
  ) => {
    removeItemFromCart(
      itemId,
      cor !== undefined && cor !== null ? cor : "",
      tamanho !== undefined && tamanho !== null ? tamanho : ""
    );
    toast.error("Produto removido do carrinho!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleUpdateQuantity = (
    itemId: string,
    newQuantity: number,
    cor?: string | null | undefined,
    tamanho?: string | null | undefined
  ) => {
    updateQuantity(
      itemId,
      newQuantity,
      cor !== undefined && cor !== null ? cor : "",
      tamanho !== undefined && tamanho !== null ? tamanho : ""
    );
    if (newQuantity > 1) {
      toast.success("Quantidade do produto atualizada!", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleViewDetails = (itemId: string) => {
    router.push(`/produtos/${itemId}`);
  };

  const handleClearCart = () => {
    clearCart();
    toast.success("Carrinho limpo com sucesso!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  if (cartItems.length === 0) {
    return (
      <Card className="p-4">
        <CardTitle>Seu carrinho está vazio.</CardTitle>
        <CardContent>
          <p className="text-gray-500">
            Adicione produtos para ver seu carrinho.
          </p>
          <Button onClick={() => router.push("/produtos")} className="mt-4">
            Ver Produtos
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <ShoppingCartIcon className="mr-2 w-6 h-6" />
          Carrinho de Compras
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearCart}
          className="rounded-full"
        >
          <XCircle className="mr-2 w-4 h-4" />
          Limpar Carrinho
        </Button>
      </h2>
      <div className="space-y-4">
        {cartItems.map((item) => (
          <Card
            key={`${item.id}-${item.cor}-${item.tamanho}`}
            className="border shadow-md p-5 rounded-lg bg-white hover:shadow-lg transition-shadow duration-200"
          >
            <CardContent className="flex flex-row items-center justify-between p-1">
              <div
                onClick={() => handleViewDetails(item.id)}
                className="relative w-32 h-32 mr-4 mb-4 sm:mb-0 cursor-pointer"
              >
                <Image
                  src={item.imagemUrl}
                  alt={item.nome}
                  layout="fill"
                  objectFit="contain"
                  className="rounded"
                />
              </div>
              <div className="flex-grow">
                <h3
                  onClick={() => handleViewDetails(item.id)}
                  className="text-lg font-semibold mb-1 cursor-pointer hover:underline"
                >
                  {item.nome}
                </h3>
                {item.cor && (
                  <p className="text-gray-500 mb-1">Cor: {item.cor}</p>
                )}
                {item.tamanho && (
                  <p className="text-gray-500 mb-1">Tamanho: {item.tamanho}</p>
                )}
                <p className="text-gray-600 mb-2">
                  Preço: R$ {item.preco.toFixed(2)}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700 font-medium">QTD:</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleUpdateQuantity(
                        item.id,
                        item.quantidade - 1,
                        item.cor,
                        item.tamanho
                      )
                    }
                    className="rounded-full"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <Input
                    type="number"
                    min="1"
                    value={item.quantidade}
                    onChange={(e) =>
                      handleUpdateQuantity(
                        item.id,
                        parseInt(e.target.value, 10),
                        item.cor,
                        item.tamanho
                      )
                    }
                    className="w-16 text-center"
                  />

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleUpdateQuantity(
                        item.id,
                        item.quantidade + 1,
                        item.cor,
                        item.tamanho
                      )
                    }
                    className="rounded-full"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-blue-700 mt-2 font-semibold">
                  Total: R$ {(item.preco * item.quantidade).toFixed(2)}
                </p>
              </div>
              {/* Botão de remover centralizado na direita */}
              <div className="ml-6">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() =>
                    handleRemoveItem(item.id, item.cor, item.tamanho)
                  }
                  className="rounded-full"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div className="mb-4 sm:mb-0 text-xl font-bold">
          Total: R$ {totalPrice().toFixed(2)}
          <Badge
            variant="secondary"
            className="ml-2 bg-foreground text-white border-none"
          >
            {totalItemsCount()} {totalItemsCount() === 1 ? "item" : "itens"}
          </Badge>
        </div>
        {/* Botões lado a lado no mobile com tamanhos ajustados */}
        <div className="flex flex-row w-full sm:w-auto gap-2">
          <Button
            onClick={() => router.push("/produtos")}
            className="w-1/2 sm:w-auto bg-background text-foreground font-bold py-2 px-3 rounded-full transition-colors duration-200 flex items-center justify-center text-sm"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Continuar
          </Button>
          <Button
            onClick={() => router.push("/finalizar-pedido")}
            className="w-1/2 sm:w-auto bg-foreground text-background font-bold py-2 px-3 rounded-full transition-colors duration-200 flex items-center justify-center text-sm"
          >
            Finalizar
            <CheckCircle className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
