"use client";

import React from "react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import MenuMobile from "@/components/MenuMobile";
import { useFetchProducts } from "@/hooks/useFetchProducts";
import { ToastContainer } from "react-toastify";

export default function BarbantesPage() {
  const { products, loading, error } = useFetchProducts("barrocos");

  if (loading) {
    return <div>Carregando produtos de barrocos...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="">
      <Navbar />
      <MenuMobile />
      <h1 className="text-2xl font-bold mb-4">barrocos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((produto) => (
          <ProductCard key={produto.id} product={produto} />
        ))}
      </div>
      <ToastContainer />
    </div>
  );
}
