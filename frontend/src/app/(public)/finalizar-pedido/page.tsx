// src/app/(public)/finalizar-pedido/page.tsx
"use client";

import React from "react";
import CheckoutForm from "@/features/checkout/components/CheckoutForm";

const FinalizarPedidoPage = () => {
  return (
    <div className="container mx-auto py-8">
      <CheckoutForm />
    </div>
  );
};

export default FinalizarPedidoPage;
