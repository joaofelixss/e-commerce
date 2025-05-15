"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import AddVariableModal from "@/features/admin/gerenciar-variaveis/components/AddVariableModal";
import EditVariableModal from "@/features/admin/gerenciar-variaveis/components/EditVariableModal";
import { getVariablesByProductId, deleteVariable } from "@/api/products";

interface Variable {
  id: string;
  cor?: string;
  numero?: number;
  imagemUrl?: string;
  quantidade?: number;
  estoque?: number;
  nivelMinimo?: number;
  produtoId: string;
  // Adicione outras propriedades conforme a resposta da sua API
}

const ProductVariablesPage = () => {
  const { productId } = useParams();
  const router = useRouter();
  const [variables, setVariables] = useState<Variable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVariable, setEditingVariable] = useState<Variable | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [variableToDeleteId, setVariableToDeleteId] = useState<string | null>(
    null
  );

  const fetchVariables = async () => {
    setLoading(true);
    setError(null);
    try {
      if (productId) {
        const response = await getVariablesByProductId(productId);
        setVariables(response); // A API agora retorna diretamente o array de variáveis
      }
    } catch (err: any) {
      setError("Erro ao carregar as variáveis do produto.");
      console.error("Erro ao buscar variáveis:", err);
      toast.error("Erro ao carregar as variáveis do produto.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchVariables();
    }
  }, [productId]);

  const handleVariableAdded = () => {
    fetchVariables();
    toast.success("Variação adicionada com sucesso!");
    setIsAddModalOpen(false);
  };

  const handleEditClick = (variable: Variable) => {
    setEditingVariable(variable);
    setIsEditModalOpen(true);
  };

  const handleVariableUpdated = () => {
    fetchVariables();
    setEditingVariable(null);
    setIsEditModalOpen(false);
    toast.success("Variação atualizada com sucesso!");
  };

  const handleDeleteClick = (variableId: string) => {
    setVariableToDeleteId(variableId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteVariable = async () => {
    if (variableToDeleteId && productId) {
      setLoading(true);
      setError(null);
      setIsDeleteDialogOpen(false);
      try {
        await deleteVariable(productId, variableToDeleteId);
        toast.success("Variação excluída com sucesso!");
        fetchVariables();
      } catch (err: any) {
        console.error("Erro ao deletar variação:", err);
        setError("Erro ao deletar a variação.");
        toast.error("Erro ao deletar a variação.");
      } finally {
        setLoading(false);
        setVariableToDeleteId(null);
      }
    }
  };

  const cancelDeleteVariable = () => {
    setIsDeleteDialogOpen(false);
    setVariableToDeleteId(null);
  };

  if (!productId) {
    return <div>ID do produto inválido.</div>;
  }

  return (
    <div className="container mx-auto py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/admin/produtos" className="hover:underline">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Produtos
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold">
          Variações do Produto: {productId}
        </h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          Adicionar Variação
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-2 text-left">ID</TableHead>
              <TableHead className="px-4 py-2 text-left">Cor</TableHead>
              <TableHead className="px-4 py-2 text-left">Número</TableHead>
              <TableHead className="px-4 py-2 text-left">Imagem</TableHead>
              <TableHead className="px-4 py-2 text-left">Qtd</TableHead>
              <TableHead className="px-4 py-2 text-left">Estoque</TableHead>
              <TableHead className="px-4 py-2 text-left">
                Nível Mínimo
              </TableHead>
              <TableHead className="px-4 py-2 text-left">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="py-4 text-center">
                  Carregando variações...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-4 text-center text-red-500"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : variables.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-4 text-center text-gray-500"
                >
                  Nenhuma variação encontrada para este produto.
                </TableCell>
              </TableRow>
            ) : (
              variables.map((variable) => (
                <TableRow key={variable.id}>
                  <TableCell className="px-4 py-2 font-medium">
                    {variable.id}
                  </TableCell>
                  <TableCell className="px-4 py-2">{variable.cor}</TableCell>
                  <TableCell className="px-4 py-2">{variable.numero}</TableCell>
                  <TableCell className="px-4 py-2">
                    {variable.imagemUrl && (
                      <img
                        src={variable.imagemUrl}
                        alt={`Imagem da variação ${variable.id}`}
                        className="h-8 w-8 rounded-sm object-cover"
                      />
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {variable.quantidade}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {variable.estoque}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {variable.nivelMinimo}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleEditClick(variable)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteClick(variable.id)}
                      >
                        Excluir
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AddVariableModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        productId={productId}
        onVariableAdded={handleVariableAdded}
      />

      <EditVariableModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        productId={productId}
        variable={editingVariable}
        onVariableUpdated={handleVariableUpdated}
      />

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza de que deseja excluir esta variação? Esta ação não
              pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={cancelDeleteVariable}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDeleteVariable}
              disabled={loading}
            >
              {loading ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

export default ProductVariablesPage;
