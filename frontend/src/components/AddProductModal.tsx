// frontend/components/AddProductModal.tsx
import React, { useState } from "react";
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
import { addProduct } from "@/api/products"; // Importe a função addProduct

interface AddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductAdded: () => void; // Callback para recarregar a lista de produtos
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  open,
  onOpenChange,
  onProductAdded,
}) => {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false); // Estado para controlar o loading do botão de submit
  const [categoriaId, setCategoriaId] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [imagemUrl, setImagemUrl] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoadingSubmit(true);
    setSubmitError(null);

    try {
      const newProduct = {
        nome,
        preco: parseFloat(preco),
        imagemUrl,
        categoriaId,
      };
      await addProduct(newProduct); // Chama a função da API para adicionar o produto
      setNome("");
      setPreco("");
      onOpenChange(false); // Fechar o modal
      onProductAdded(); // Recarregar a lista de produtos
    } catch (error: unknown) {
      console.error("Erro ao adicionar produto:", error);
      setSubmitError(
        "Erro ao adicionar o produto. Por favor, tente novamente."
      );
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Produto</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para adicionar um novo produto.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
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
          {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
          <DialogFooter>
            <Button type="submit" disabled={loadingSubmit}>
              {loadingSubmit ? "Adicionando..." : "Adicionar Produto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
