// frontend/components/AddCategoryModal.tsx
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
import { addCategory } from "../api/categorias";

interface AddCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCategoryAdded: () => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  open,
  onOpenChange,
  onCategoryAdded,
}) => {
  const [nome, setNome] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoadingSubmit(true);
    setSubmitError(null);

    try {
      const newCategory = {
        nome,
      };
      await addCategory(newCategory);
      setNome("");
      onOpenChange(false);
      onCategoryAdded();
    } catch (error: unknown) {
      console.error("Erro ao adicionar categoria:", error);
      setSubmitError(
        "Erro ao adicionar a categoria. Por favor, tente novamente."
      );
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Categoria</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para adicionar uma nova categoria.
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
              {loadingSubmit ? "Adicionando..." : "Adicionar Categoria"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryModal;
