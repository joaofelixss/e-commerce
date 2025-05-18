// src/app/categorias/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  deleteCategory,
  getAllCategories,
} from "@/features/admin/gerenciar-categorias/api/categorias";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import AddCategoryModal from "@/features/admin/gerenciar-categorias/components/AddCategoryModal";
import EditCategoryModal from "@/features/admin/gerenciar-categorias/components/EditCategoryModal";
import { toast, ToastContainer } from "react-toastify";
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  nome: string;
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDeleteId, setCategoryToDeleteId] = useState<string | null>(
    null
  );

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllCategories();
      setCategories(response.data);
    } catch (err: unknown) {
      setError("Erro ao carregar as categorias.");
      console.error("Erro ao buscar categorias:", err);
      toast.error("Erro ao carregar as categorias.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryAdded = () => {
    fetchCategories();
    toast.success("Categoria adicionada com sucesso!");
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setIsEditModalOpen(true);
  };

  const handleCategoryUpdated = () => {
    fetchCategories();
    setEditingCategory(null);
    toast.success("Categoria atualizada com sucesso!");
  };

  const handleDeleteClick = (categoryId: string) => {
    setCategoryToDeleteId(categoryId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteCategory = async () => {
    if (categoryToDeleteId) {
      setLoading(true);
      setError(null);
      setIsDeleteDialogOpen(false);
      try {
        await deleteCategory(categoryToDeleteId);
        toast.success("Categoria excluída com sucesso!");
        fetchCategories();
      } catch (err: unknown) {
        console.error("Erro ao deletar categoria:", err);
        setError("Erro ao deletar a categoria.");
        toast.error("Erro ao deletar a categoria.");
      } finally {
        setLoading(false);
        setCategoryToDeleteId(null);
      }
    }
  };

  const cancelDeleteCategory = () => {
    setIsDeleteDialogOpen(false);
    setCategoryToDeleteId(null);
  };

  return (
    <div className="container mx-auto py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/dashboard" className="hover:underline">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold">Gerenciamento de Categorias</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          Adicionar Categoria
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-2 text-left">ID</TableHead>
              <TableHead className="px-4 py-2 text-left">Nome</TableHead>
              <TableHead className="px-4 py-2 text-left">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="px-4 py-2 font-medium">
                  {category.id}
                </TableCell>
                <TableCell className="px-4 py-2">{category.nome}</TableCell>
                <TableCell className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => handleEditClick(category)}>
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteClick(category.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddCategoryModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onCategoryAdded={handleCategoryAdded}
      />
      {editingCategory && (
        <EditCategoryModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          category={editingCategory}
          onCategoryUpdated={handleCategoryUpdated}
        />
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza de que deseja excluir esta categoria? Esta ação não
              pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={cancelDeleteCategory}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDeleteCategory}
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

export default CategoriesPage;
