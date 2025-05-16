"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart } from "lucide-react";

interface SalesOverviewCardsProps {
  salesData: { valorTotal?: number; total?: number }[]; // Agora ambas as propriedades podem existir
}

const SalesOverviewCards: React.FC<SalesOverviewCardsProps> = ({
  salesData,
}) => {
  // Calcular o lucro total
  const totalRevenue = salesData.reduce(
    (sum, sale) => sum + (sale.valorTotal || sale.total || 0),
    0
  );

  // Calcular a quantidade total de vendas
  const totalSalesCount = salesData.length;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Lucro Total</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSalesCount}</div>
        </CardContent>
      </Card>
      {/* Outros cards */}
    </>
  );
};

export default SalesOverviewCards;
