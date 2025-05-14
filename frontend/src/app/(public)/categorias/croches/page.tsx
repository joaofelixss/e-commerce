// src/app/(public)/croches/page.tsx
import React from "react";
import CategoryProductListPage from "@/features/produtos/components/CategoryProductListPage";

export default function CrochesPage() {
  return (
    <CategoryProductListPage
      category="croches"
      pageTitle="Crochês"
      emptyMessage="Nenhum produto de crochê encontrado."
    />
  );
}
