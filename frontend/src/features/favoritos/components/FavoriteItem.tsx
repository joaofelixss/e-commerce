// components/FavoriteItem.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useFavoritesStore } from "@/features/produtos/store/favoritesStore";
import { Product } from "@/features/produtos/hooks/useFetchProducts"; // Importe a interface Product
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const FavoriteItem: React.FC<Product> = ({ product }) => {
  const removeItem = useFavoritesStore((state) => state.removeItem);

  const handleRemove = () => {
    removeItem(product.id);
    toast.error("Produto removido dos favoritos!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <div className="border shadow-md rounded-md">
      <div className="flex flex-row items-center justify-between p-10">
        <Link
          href={`/produtos/${product.id}`} // Use o slug do product
          className="relative w-24 h-24 sm:w-32 sm:h-32 mr-4 mb-4 sm:mb-0 cursor-pointer rounded overflow-hidden"
        >
          <Image
            src={product.imagemUrl}
            alt={product.nome}
            layout="fill"
            objectFit="cover"
          />
        </Link>
        <div className="flex-grow">
          <h3 className="text-lg font-semibold mb-2 text-gray-800  transition-colors duration-200 cursor-pointer">
            {product.nome}
          </h3>
          <p className="text-gray-600 mb-2 font-semibold text-lg">
            R$ {product.preco?.toFixed(2) ?? "..."}
          </p>
          {product.cor && (
            <p className="text-gray-500 mb-1">Cor: {product.cor}</p>
          )}
          {product.tamanho && (
            <p className="text-gray-500 mb-1">Tamanho: {product.tamanho}</p>
          )}
        </div>
        <div className="">
          <Button
            variant="destructive"
            size="icon"
            onClick={handleRemove}
            className="rounded-full"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FavoriteItem;
