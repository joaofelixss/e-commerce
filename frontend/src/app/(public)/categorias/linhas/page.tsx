// src/app/(public)/linhas/page.tsx
import React from "react";
import CategoryProductListPage from "@/features/produtos/components/CategoryProductListPage";

export default function LinhasPage() {
  return (
    <CategoryProductListPage
      category="linhas"
      pageTitle="Linhas"
      emptyMessage="Nenhum produto de roupa encontrado."
    />
  );
}
