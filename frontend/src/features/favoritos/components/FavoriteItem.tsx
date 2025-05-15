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

interface FavoriteItemProps {
  product: Product; // Agora espera o objeto Product completo
}

const FavoriteItem: React.FC<FavoriteItemProps> = ({ product }) => {
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4">
        <Link
          href={`/produto/${product.slug || `/produtos/${product.id}`}`} // Use o slug do product
          className="relative w-24 h-24 sm:w-32 sm:h-32 mr-4 mb-4 sm:mb-0 cursor-pointer rounded overflow-hidden"
        >
          <Image
            src={product.imagemUrl || "/oferta.png"}
            alt={product.nome}
            layout="fill"
            objectFit="cover"
            onError={(e) => (e.currentTarget.src = "/oferta.png")}
          />
        </Link>
        <div className="flex-grow">
          <Link href={`/produto/${product.slug || `/produtos/${product.id}`}`}>
            <h3 className="text-lg font-semibold mb-1 cursor-pointer hover:underline">
              {product.nome}
            </h3>
          </Link>
          <p className="text-gray-600 mb-2">
            R$ {product.preco?.toFixed(2) ?? "..."}
          </p>
          {product.cor && (
            <p className="text-gray-500 mb-1">Cor: {product.cor}</p>
          )}
          {product.tamanho && (
            <p className="text-gray-500 mb-1">Tamanho: {product.tamanho}</p>
          )}
        </div>
        <div className="flex items-center justify-end">
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
