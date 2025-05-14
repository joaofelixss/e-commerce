// src/app/(public)/barbantes/page.tsx
import React from "react";
import CategoryProductListPage from "@/features/produtos/components/CategoryProductListPage";

export default function BarbantesPage() {
  return (
    <CategoryProductListPage
      category="barbantes"
      pageTitle="Barbantes"
      emptyMessage="Nenhum produto de barbante encontrado."
    />
  );
}
