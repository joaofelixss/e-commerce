"use client";
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SalesChartProps {
  salesData: { dataPedido?: string; dataVenda?: string; valorTotal: number }[];
  title?: string; // Prop opcional para o título do card
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return format(date, "dd/MM/yy");
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return "";
  }
};

const SalesChart: React.FC<SalesChartProps> = ({
  salesData,
  title = "Desempenho de Vendas",
}) => {
  const chartData = salesData.reduce((acc, sale) => {
    const date = sale.dataPedido || sale.dataVenda;
    if (date) {
      const formattedDate = formatDate(date);
      acc[formattedDate] = (acc[formattedDate] || 0) + sale.valorTotal;
    }
    return acc;
  }, {} as { [key: string]: number });

  const dataForChart = Object.entries(chartData)
    .sort(([, valueA], [, valueB]) => valueA - valueB)
    .map(([date, total]) => ({ date, total }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        {" "}
        {/* Defina uma altura para o gráfico */}
        <ResponsiveContainer width="100%" height="80%">
          {" "}
          {/* Ajuste a altura dentro do CardContent */}
          <LineChart data={dataForChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="date" stroke="#718096" tickLine={false} />
            <YAxis stroke="#718096" tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: "4px",
                padding: "8px",
              }}
              itemStyle={{ color: "#333" }}
              labelStyle={{ color: "#333" }}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#2563eb"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
