// src/app/(public)/carrinho/page.tsx
"use client";

import React from "react";
import ShoppingCart from "@/features/carrinho/components/ShoppingCart";

const CarrinhoPage = () => {
  return (
    <div className="container mx-auto py-8">
      <ShoppingCart />
    </div>
  );
};

export default CarrinhoPage;
