"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Importe os estilos do toast

// Componentes que vamos criar
import AddManualSaleModal from "@/features/admin/vendas/components/AddManualSaleModal";
import SalesOverviewCards from "@/features/admin/vendas/components/SalesOverviewCards";
import SalesChart from "@/features/admin/vendas/components/SalesChart";
import DatePickerRange from "@/features/admin/vendas/components/DatePickerRange";

// Importe as funções da API e as interfaces atualizadas
import {
  getOrders,
  getSales,
  Venda,
  Order,
} from "@/features/admin/vendas/api/sales";

interface SaleDataCombined {
  id: string;
  tipo: "Pedido" | "Venda Manual";
  data: string;
  clienteNome?: string;
  valorTotal: number;
  statusPagamento?: string;
  originalData: Order | Venda; // Mantém os dados originais para acesso a outras propriedades
}

const SalesPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [sales, setSales] = useState<Venda[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingSales, setLoadingSales] = useState(true);
  const [errorOrders, setErrorOrders] = useState<string | null>(null);
  const [errorSales, setErrorSales] = useState<string | null>(null);
  const [isAddManualSaleModalOpen, setIsAddManualSaleModalOpen] =
    useState(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const fetchOrdersData = async () => {
    setLoadingOrders(true);
    setErrorOrders(null);
    try {
      const response = await getOrders();
      setOrders(response);
    } catch (err: unknown) {
      setErrorOrders("Erro ao carregar os pedidos.");
      console.error("Erro ao buscar pedidos:", err);
      toast.error("Erro ao carregar os pedidos.");
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchSalesData = async () => {
    setLoadingSales(true);
    setErrorSales(null);
    try {
      const response = await getSales();
      console.log("Dados de vendas recebidos:", response); // Adicione este log
      setSales(response);
    } catch (err: unknown) {
      setErrorSales("Erro ao carregar as vendas.");
      console.error("Erro ao buscar vendas:", err);
      toast.error("Erro ao carregar as vendas.");
    } finally {
      setLoadingSales(false);
    }
  };

  useEffect(() => {
    fetchOrdersData();
    fetchSalesData();
  }, []);

  const handleAddManualSale = () => {
    setIsAddManualSaleModalOpen(true);
  };

  const handleManualSaleAdded = () => {
    console.log("handleManualSaleAdded executado!");
    fetchSalesData(); // Recarrega as vendas após adicionar uma nova
    toast.success("Venda manual adicionada com sucesso!");
    setIsAddManualSaleModalOpen(false);
  };

  const handleDateRangeChange = (dates: [Date | null, Date | null]) => {
    setDateRange(dates);
    // Aqui você implementaria a lógica para filtrar as vendas por data
    console.log("Date Range:", dates);
  };

  // Combine orders e sales para exibir na tabela
  const allSalesData: SaleDataCombined[] = [
    ...(Array.isArray(orders)
      ? orders.map((order) => ({
          id: order.id,
          tipo: "Pedido" as const,
          data: order.criadoEm,
          clienteNome: order.cliente?.nome,
          valorTotal: order.total,
          statusPagamento: order.status,
          originalData: order,
        }))
      : []),
    ...(Array.isArray(sales)
      ? sales.map((sale) => ({
          id: sale.id,
          tipo: "Venda Manual" as const,
          data: sale.dataVenda,
          clienteNome: sale.cliente?.nome,
          valorTotal: sale.totalVenda,
          statusPagamento: sale.formaPagamento,
          originalData: sale,
        }))
      : []),
  ];

  const handleDetalhesClick = (id: string) => {
    console.log(`Detalhes clicados para o ID: ${id}`);
    // Aqui você implementaria a lógica para buscar e exibir os detalhes
  };

  return (
    <div className="container mx-auto py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center">
          <Link href="/dashboard" className="hover:underline mr-4">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold">Gerenciamento de Vendas</h1>
        </div>
        <Button onClick={handleAddManualSale}>
          <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Venda Manual
        </Button>
      </div>

      <div className="grid gap-4 mb-6 md:grid-cols-2 lg:grid-cols-4">
        <SalesOverviewCards salesData={allSalesData} />{" "}
        {/* Passando os dados aqui */}
      </div>

      <div className="mb-6">
        <DatePickerRange onDateChange={handleDateRangeChange} />
      </div>

      <div className="mb-6">
        <SalesChart salesData={allSalesData} /> {/* Passando os dados aqui */}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-2 text-left">Tipo</TableHead>
              <TableHead className="px-4 py-2 text-left">ID</TableHead>
              <TableHead className="px-4 py-2 text-left">Data</TableHead>
              <TableHead className="px-4 py-2 text-left">Cliente</TableHead>
              <TableHead className="px-4 py-2 text-left">Valor Total</TableHead>
              <TableHead className="px-4 py-2 text-left">
                Status/Pagamento
              </TableHead>
              <TableHead className="px-4 py-2 text-left">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allSalesData.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="px-4 py-2 font-medium">
                  {sale.tipo}
                </TableCell>
                <TableCell className="px-4 py-2 font-medium">
                  {sale.id}
                </TableCell>
                <TableCell className="px-4 py-2">{sale.data}</TableCell>
                <TableCell className="px-4 py-2">
                  {sale.clienteNome || "-"}
                </TableCell>
                <TableCell className="px-4 py-2">
                  R$ {sale.valorTotal?.toFixed(2)}
                </TableCell>
                <TableCell className="px-4 py-2">
                  {sale.statusPagamento || "-"}
                </TableCell>
                <TableCell className="px-4 py-2">
                  <Button
                    size="sm"
                    onClick={() => handleDetalhesClick(sale.id)}
                  >
                    Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddManualSaleModal
        open={isAddManualSaleModalOpen}
        onOpenChange={setIsAddManualSaleModalOpen}
        onManualSaleAdded={handleManualSaleAdded}
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default SalesPage;
