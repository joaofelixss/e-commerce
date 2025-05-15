// frontend/src/components/EditProductModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateProduct } from "@/api/products";
import { Product } from "@/features/produtos/types/product";
import { toast } from "react-toastify";

interface EditProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onProductUpdated: () => void; // Callback para recarregar a lista
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  open,
  onOpenChange,
  product,
  onProductUpdated,
}) => {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setNome(product.nome);
      setPreco(String(product.preco));
      setImagemUrl(product.imagemUrl || "");
      setCategoriaId(product.categoriaId);
    } else {
      setNome("");
      setPreco("");
      setImagemUrl("");
      setCategoriaId("");
    }
  }, [product]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (product?.id) {
      const updatedProduct = {
        nome,
        preco: parseFloat(preco),
        imagemUrl,
        categoriaId,
      };
      try {
        await updateProduct(product.id, updatedProduct);
        toast.success("Produto atualizado com sucesso!");
        onProductUpdated();
        onOpenChange(false);
      } catch (error: any) {
        console.error("Erro ao atualizar produto:", error);
        setError("Erro ao atualizar o produto. Por favor, tente novamente.");
        toast.error("Erro ao atualizar o produto.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
          <DialogDescription>Edite os detalhes do produto.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="preco">Preço</Label>
            <Input
              type="number"
              id="preco"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="imagemUrl">URL da Imagem</Label>
            <Input
              type="url"
              id="imagemUrl"
              value={imagemUrl}
              onChange={(e) => setImagemUrl(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="categoriaId">ID da Categoria</Label>
            <Input
              type="text"
              id="categoriaId"
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={loading}>
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;
