// frontend/src/app/finalizar-pedido/page.tsx
"use client";

import React from "react";
import CheckoutForm from "@/components/CheckoutForm";
import Navbar from "@/components/Navbar";
import MenuMobile from "@/components/MenuMobile";

const FinalizarPedidoPage = () => {
  return (
    <div className="">
      <Navbar/>
      <MenuMobile/>
      <CheckoutForm />
    </div>
  );
};

export default FinalizarPedidoPage;
