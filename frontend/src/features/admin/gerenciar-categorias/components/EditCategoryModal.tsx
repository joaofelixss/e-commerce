// frontend/components/EditCategoryModal.tsx
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
import { updateCategory } from "../api/categorias";

interface EditCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: {
    id: string;
    nome: string;
  } | null;
  onCategoryUpdated: () => void;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  open,
  onOpenChange,
  category,
  onCategoryUpdated,
}) => {
  const [nome, setNome] = useState(category?.nome || "");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      setNome(category.nome);
    } else {
      setNome("");
    }
  }, [category]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoadingSubmit(true);
    setSubmitError(null);

    if (!category?.id) {
      console.error("ID da categoria não encontrado para edição.");
      setSubmitError("Erro ao editar a categoria.");
      setLoadingSubmit(false);
      return;
    }

    try {
      const updatedCategoryData = {
        nome,
      };
      await updateCategory(category.id, updatedCategoryData);
      onOpenChange(false);
      onCategoryUpdated();
    } catch (error: unknown) {
      console.error("Erro ao atualizar categoria:", error);
      setSubmitError(
        "Erro ao atualizar a categoria. Por favor, tente novamente."
      );
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Categoria</DialogTitle>
          <DialogDescription>
            Edite os campos abaixo para atualizar a categoria.
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
          {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
          <DialogFooter>
            <Button type="submit" disabled={loadingSubmit}>
              {loadingSubmit ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryModal;
