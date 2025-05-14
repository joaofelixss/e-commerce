// src/app/(public)/roupas/page.tsx
import React from "react";
import CategoryProductListPage from "@/features/produtos/components/CategoryProductListPage";

export default function RoupasPage() {
  return (
    <CategoryProductListPage
      category="roupas"
      pageTitle="Roupas"
      emptyMessage="Nenhum produto de roupa encontrado."
    />
  );
}
