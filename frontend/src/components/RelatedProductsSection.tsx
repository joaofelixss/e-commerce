// frontend/src/components/RelatedProductsSection.tsx
import React from "react";
import { RelatedProduct } from "@/app/produtos/[id]/page"; // Importe a interface
import ProductCard from "@/components/ProductCard";

interface Props {
  products: RelatedProduct[];
}

const RelatedProductsSection: React.FC<Props> = ({ products }) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">
        Produtos Relacionados
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProductsSection;