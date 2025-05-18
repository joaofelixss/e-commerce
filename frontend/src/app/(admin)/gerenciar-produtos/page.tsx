"use client";

import React, { useState, useEffect } from "react";
import { getAllProducts } from "@/api/products";
import { deleteProduct } from "@/features/admin/gerenciar-produtos/api/puducts";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import AddProductModal from "@/features/admin/gerenciar-produtos/components/AddProductModal";
import EditProductModal from "@/features/admin/gerenciar-produtos/components/EditProductModal";
import { useRouter } from "next/navigation";
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
import { Product } from "@/features/produtos/types/product";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDeleteId, setProductToDeleteId] = useState<string | null>(
    null
  );
  const router = useRouter();

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllProducts();
      setProducts(response.data);
    } catch (err: unknown) {
      setError("Erro ao carregar os produtos.");
      console.error("Erro ao buscar produtos:", err);
      toast.error("Erro ao carregar os produtos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductAdded = () => {
    fetchProducts();
    toast.success("Produto adicionado com sucesso!");
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleProductUpdated = () => {
    fetchProducts();
    setEditingProduct(null);
    toast.success("Produto atualizado com sucesso!");
  };

  const handleDeleteClick = (productId: string) => {
    setProductToDeleteId(productId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (productToDeleteId) {
      setLoading(true);
      setError(null);
      setIsDeleteDialogOpen(false);
      try {
        await deleteProduct(productToDeleteId);
        toast.success("Produto excluído com sucesso!");
        fetchProducts();
      } catch (err: unknown) {
        console.error("Erro ao deletar produto:", err);
        setError("Erro ao deletar o produto.");
        toast.error("Erro ao deletar o produto.");
      } finally {
        setLoading(false);
        setProductToDeleteId(null);
      }
    }
  };

  const cancelDeleteProduct = () => {
    setIsDeleteDialogOpen(false);
    setProductToDeleteId(null);
  };

  const handleManageVariables = (productId: string) => {
    router.push(`/gerenciar-produtos/${productId}/variaveis`);
  };

  return (
    <div className="container mx-auto py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/dashboard" className="hover:underline">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold">Gerenciamento de Produtos</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          Adicionar Produto
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-2 text-left">ID</TableHead>
              <TableHead className="px-4 py-2 text-left">Nome</TableHead>
              <TableHead className="px-4 py-2 text-left">Preço</TableHead>
              <TableHead className="px-4 py-2 text-left hidden sm:block">
                Imagem
              </TableHead>
              <TableHead className="px-4 py-2 text-left">Ações</TableHead>
              <TableHead className="px-4 py-2 text-left">
                Variações
              </TableHead>{" "}
              {/* Nova coluna */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="px-4 py-2 font-medium">
                  {product.id}
                </TableCell>
                <TableCell className="px-4 py-2">{product.nome}</TableCell>
                <TableCell className="px-4 py-2">
                  R$ {product.preco.toFixed(2)}
                </TableCell>
                <TableCell className="px-4 py-2 hidden sm:block">
                  {product.imagemUrl}
                </TableCell>
                <TableCell className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => handleEditClick(product)}>
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteClick(product.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-2">
                  <Button
                    size="sm"
                    onClick={() => handleManageVariables(product.id)}
                  >
                    Gerenciar Variações
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddProductModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onProductAdded={handleProductAdded}
      />

      <EditProductModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        product={editingProduct}
        onProductUpdated={handleProductUpdated}
      />

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza de que deseja excluir este produto? Esta ação não pode
              ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={cancelDeleteProduct}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDeleteProduct}
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

export default ProductsPage;
