// frontend/src/app/carrinho/page.tsx
"use client";

import React from "react";
import ShoppingCart from "@/components/ShoppingCart";
import Navbar from "@/components/Navbar";
import MenuMobile from "@/components/MenuMobile";

const CarrinhoPage = () => {
  return (
    <div className="">
      <MenuMobile />
      <Navbar />
      <div className="container mx-auto py-8">
        <ShoppingCart />
      </div>
    </div>
  );
};

export default CarrinhoPage;
