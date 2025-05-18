// components/FavoriteItem.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useFavoritesStore } from "@/features/produtos/store/favoritesStore";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";

interface FavoriteItemProps {
  id: string;
  nome: string;
  imagemUrl: string;
  preco?: number;
  cor?: string;
  tamanho?: string;
}

const FavoriteItem: React.FC<FavoriteItemProps> = ({
  id,
  nome,
  imagemUrl,
  preco,
  cor,
  tamanho,
}) => {
  const removeItem = useFavoritesStore((state) => state.removeItem);

  const handleRemove = () => {
    removeItem(id);
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
          href={`/produtos/${id}`} // Use o id diretamente
          className="relative w-24 h-24 sm:w-32 sm:h-32 mr-4 mb-4 sm:mb-0 cursor-pointer rounded overflow-hidden"
        >
          <Image
            src={imagemUrl} // Use imagemUrl diretamente
            alt={nome} // Use nome diretamente
            layout="fill"
            objectFit="cover"
          />
        </Link>
        <div className="flex-grow">
          <h3 className="text-lg font-semibold mb-2 text-gray-800  transition-colors duration-200 cursor-pointer">
            {nome}
          </h3>
          <p className="text-gray-600 mb-2 font-semibold text-lg">
            R$ {preco?.toFixed(2) ?? "..."}
          </p>
          {cor && (
            <p className="text-gray-500 mb-1">Cor: {cor}</p> // Use cor diretamente
          )}
          {tamanho && (
            <p className="text-gray-500 mb-1">Tamanho: {tamanho}</p> // Use tamanho diretamente
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
