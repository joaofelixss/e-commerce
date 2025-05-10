// frontend/src/app/favoritos/page.tsx
"use client";

import React from "react";
import { useFavoritesStore } from "@/store/favoritesStore";
import ProductCard from "@/components/ProductCard";
import { useFetchProducts } from "@/hooks/useFetchProducts"; // Importe o hook
import Navbar from "@/components/Navbar";
import MenuMobile from "@/components/MenuMobile";
import { ToastContainer } from "react-toastify";

const FavoritosPage = () => {
  const favoriteItems = useFavoritesStore((state) => state.items);
  const { products, loading, error } = useFetchProducts(); // Use o hook

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

  if (favoriteProducts.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Meus Favoritos</h1>
        <p className="text-gray-600">
          Você ainda não adicionou nenhum produto aos seus favoritos.
        </p>
      </div>
    );
  }

  return (
    <div className="">
      <Navbar/>
      <MenuMobile/>
      <h1 className="text-2xl font-bold mb-4">Meus Favoritos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {favoriteProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default FavoritosPage;
