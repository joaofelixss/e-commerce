// src/app/(public)/favoritos/page.tsx
"use client";

import React from "react";
import { useFavoritesStore } from "@/features/produtos/store/favoritesStore";
import { useFetchProducts } from "@/features/produtos/hooks/useFetchProducts";
import FavoriteItem from "@/features/favoritos/components/FavoriteItem";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const FavoritosPage = () => {
  const favoriteItems = useFavoritesStore((state) => state.items);
  const clearFavorites = useFavoritesStore((state) => state.clearFavorites);
  const { products, loading, error } = useFetchProducts();
  const router = useRouter();

  if (loading) {
    return (
      <div className="container mx-auto py-8">Carregando seus favoritos...</div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        Erro ao carregar os produtos: {error}
      </div>
    );
  }

  const favoriteProducts = products.filter((product) =>
    favoriteItems.some((item) => item.id === product.id)
  );

  const handleClearFavorites = () => {
    clearFavorites();
    toast.success("Lista de favoritos limpa!");
  };

  if (favoriteProducts.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Meus Favoritos</h1>
        <Card className="p-4">
          <CardTitle>Sua lista de favoritos está vazia.</CardTitle>
          <CardContent>
            <p className="text-gray-500">
              Adicione produtos que você gosta para vê-los aqui!
            </p>

            <Button onClick={() => router.push("/produtos")} className="m-4">
              Ver Produtos
            </Button>
            <Button onClick={() => router.push("/")} className="mt-2">
              Voltar para a Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center justify-between">
        Meus Favoritos
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearFavorites}
          className="rounded-full"
        >
          <XCircle className="mr-2 w-4 h-4" />
          Limpar Favoritos
        </Button>
      </h1>
      <div className="space-y-4">
        {favoriteProducts.map((product) => (
          <FavoriteItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default FavoritosPage;
