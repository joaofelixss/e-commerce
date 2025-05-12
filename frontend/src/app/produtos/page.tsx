"use client";

import React from "react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import MenuMobile from "@/components/MenuMobile";
import { useFetchProducts } from "@/hooks/useFetchProducts";
import { ToastContainer } from "react-toastify";

interface Props {
  categoria?: string; // Prop para receber a categoria (opcional)
}

export default function ProductListPage({ categoria }: Props) {
  const { products, loading, error } = useFetchProducts(categoria);

  const title = categoria
    ? `Lista de Produtos - ${
        categoria.charAt(0).toUpperCase() + categoria.slice(1)
      }`
    : "Lista de Produtos";

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        Carregando produtos de {categoria || "todos"}...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-red-500">
        Erro ao carregar produtos: {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <p className="text-gray-600">
          Nenhum produto encontrado na categoria {categoria || "todos"}.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen mb-6">
      <Navbar />
      <MenuMobile />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-6">{title}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((produto) => (
            <ProductCard key={produto.id} product={produto} />
          ))}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
