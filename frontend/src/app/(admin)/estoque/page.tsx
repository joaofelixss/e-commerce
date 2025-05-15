"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Search } from "lucide-react";
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
import {
  getStockLevels,
  updateStockLevel,
} from "@/features/admin/gerenciar-estoque/api/estoque";
import EditStockModal from "@/features/admin/gerenciar-estoque/components/EditStockModal";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StockItem {
  id: string;
  nome: string;
  quantidade: number;
  nivelMinimo?: number | null;
  variacao?: string;
  variacaoId: string;
}

const StockPage = () => {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
  const [updatingStock, setUpdatingStock] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Um único termo de busca agora
  const [statusFilter, setStatusFilter] = useState("");

  const fetchStockLevels = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStockLevels();
      setStockItems(data);
    } catch (err: any) {
      setError("Erro ao carregar os níveis de estoque.");
      console.error("Erro ao buscar níveis de estoque:", err);
      toast.error("Erro ao carregar os níveis de estoque.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockLevels();
  }, []);

  const handleEditClick = (item: StockItem) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  const handleSaveStock = async (
    itemId: string,
    newQuantity: number,
    newMinLevel?: number | null
  ) => {
    setUpdatingStock(true);
    try {
      if (editingItem?.variacaoId) {
        await updateStockLevel(
          editingItem.variacaoId,
          newQuantity,
          newMinLevel
        );
        toast.success(
          `Estoque do item ${editingItem?.nome} atualizado com sucesso!`
        );
        closeEditModal();
        await fetchStockLevels();
      } else {
        console.error("Erro: ID da variação não encontrado.");
        toast.error("Erro ao atualizar o estoque: ID da variação ausente.");
      }
    } catch (error: any) {
      console.error("Erro ao atualizar o estoque:", error);
      toast.error("Erro ao atualizar o estoque.");
    } finally {
      setUpdatingStock(false);
    }
  };

  const filteredStockItems = stockItems.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = item.nome.toLowerCase().includes(searchLower);
    const variationMatch =
      item.variacao?.toLowerCase().includes(searchLower) || false; // Garante que variationMatch seja booleano
    const combinedNameVariationMatch = nameMatch || variationMatch; // Busca em ambos os campos

    if (!statusFilter || statusFilter === "todos") {
      return combinedNameVariationMatch;
    }

    const isOk = item.quantidade > (item.nivelMinimo || Infinity);
    const isLow =
      item.quantidade > 0 &&
      item.nivelMinimo !== null &&
      item.nivelMinimo !== undefined &&
      item.quantidade <= item.nivelMinimo;
    const isOut = item.quantidade === 0;

    if (statusFilter === "ok") {
      return combinedNameVariationMatch && isOk;
    }
    if (statusFilter === "baixo") {
      return combinedNameVariationMatch && isLow;
    }
    if (statusFilter === "esgotado") {
      return combinedNameVariationMatch && isOut;
    }

    return combinedNameVariationMatch; // Fallback
  });

  return (
    <div className="container mx-auto py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center">
          <Link href="/dashboard" className="hover:underline mr-4">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold">Gerenciamento de Estoque</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filtrar por nome ou variação"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="ok">OK</SelectItem>
              <SelectItem value="baixo">Baixo</SelectItem>
              <SelectItem value="esgotado">Esgotado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-2 text-left">
                Nome do Produto
              </TableHead>
              <TableHead className="px-4 py-2 text-left">Variação</TableHead>
              <TableHead className="px-4 py-2 text-left">
                Quantidade em Estoque
              </TableHead>
              <TableHead className="px-4 py-2 text-left">
                Nível Mínimo
              </TableHead>
              <TableHead className="px-4 py-2 text-left">
                Status do Estoque
              </TableHead>
              <TableHead className="px-4 py-2 text-left">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStockItems.map((item) => (
              <TableRow key={`${item.variacaoId}`}>
                <TableCell className="px-4 py-2 font-medium">
                  {item.nome}
                </TableCell>
                <TableCell className="px-4 py-2">
                  {item.variacao || "-"}
                </TableCell>
                <TableCell className="px-4 py-2">{item.quantidade}</TableCell>
                <TableCell className="px-4 py-2">
                  {item.nivelMinimo !== null && item.nivelMinimo !== undefined
                    ? item.nivelMinimo
                    : "-"}
                </TableCell>
                <TableCell className="px-4 py-2">
                  {item.quantidade > (item.nivelMinimo || Infinity) ? (
                    <span className="text-green-500">OK</span>
                  ) : item.quantidade > 0 &&
                    item.nivelMinimo !== null &&
                    item.nivelMinimo !== undefined &&
                    item.quantidade <= item.nivelMinimo ? (
                    <span className="text-yellow-500">Baixo</span>
                  ) : item.quantidade === 0 ? (
                    <span className="text-red-500">Esgotado</span>
                  ) : (
                    <span>-</span>
                  )}
                </TableCell>
                <TableCell className="px-4 py-2">
                  <Button size="sm" onClick={() => handleEditClick(item)}>
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <EditStockModal
        open={isEditModalOpen}
        onOpenChange={closeEditModal}
        item={editingItem}
        onSave={handleSaveStock}
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

export default StockPage;
