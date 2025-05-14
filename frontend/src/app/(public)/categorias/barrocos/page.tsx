// src/app/(public)/barrocos/page.tsx
import React from "react";
import CategoryProductListPage from "@/features/produtos/components/CategoryProductListPage";

export default function BarrocosPage() {
  return (
    <CategoryProductListPage
      category="barrocos"
      pageTitle="Barrocos"
      emptyMessage="Nenhum produto barroco encontrado."
    />
  );
}
