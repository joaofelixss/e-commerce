// frontend/features/dashboard/components/LowStockAlerts.tsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { getLowStockProducts } from "@/features/admin/dashboard/api/dashboard"; // Vamos criar essa função na API

interface LowStockProduct {
  id: string;
  nome: string;
  variacao?: { cor?: string; numero?: number };
  quantidade: number;
  nivelMinimo?: number;
}

const LowStockAlerts = () => {
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>(
    []
  );
  const [loadingStock, setLoadingStock] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoadingStock(true);
    getLowStockProducts()
      .then((data) => setLowStockProducts(data))
      .catch((err) => {
        console.error("Erro ao buscar produtos com baixo estoque:", err);
        setError("Erro ao carregar alertas de estoque baixo.");
      })
      .finally(() => setLoadingStock(false));
  }, []);

  if (loadingStock) {
    return <div>Carregando alertas de estoque baixo...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (lowStockProducts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-green-500" />
            Estoque OK
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Nenhum produto com baixo estoque no momento.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          Alertas de Estoque Baixo
        </CardTitle>
      </CardHeader>
      <CardContent className="divide-y divide-muted">
        {lowStockProducts.map((product) => (
          <div
            key={product.id}
            className="py-2 flex items-center justify-between"
          >
            <div>
              {product.nome}
              {product.variacao?.cor && ` - Cor: ${product.variacao.cor}`}
              {product.variacao?.numero &&
                ` - Número: ${product.variacao.numero}`}
            </div>
            <span className="font-semibold text-red-500">
              {product.quantidade} em estoque
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default LowStockAlerts;
