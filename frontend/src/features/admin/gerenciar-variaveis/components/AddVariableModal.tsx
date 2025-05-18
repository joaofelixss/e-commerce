// src/components/AddVariableModal.tsx
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify"; // Importe o toast do react-toastify
import { addVariable } from "../api/variation"; // Importe a função da API
import "react-toastify/dist/ReactToastify.css"; // Importe os estilos do react-toastify

interface AddVariableModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string | string[];
  onVariableAdded: () => void; // Função para notificar a página pai que uma variável foi adicionada
}

const AddVariableModal: React.FC<AddVariableModalProps> = ({
  open,
  onOpenChange,
  productId,
  onVariableAdded,
}) => {
  const [cor, setCor] = useState("");
  const [numero, setNumero] = useState<number | undefined>(undefined);
  const [imagemUrl, setImagemUrl] = useState("");
  const [quantidade, setQuantidade] = useState<number | undefined>(undefined);
  const [estoque, setEstoque] = useState<number | undefined>(undefined);
  const [nivelMinimo, setNivelMinimo] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!cor.trim()) {
      toast.error("Por favor, preencha a cor da variação.");
      return;
    }

    setLoading(true);
    try {
      const newVariableData = {
        cor: cor.trim(),
        numero: numero,
        imagemUrl: imagemUrl.trim(),
        quantidade: quantidade,
        estoque: estoque,
        nivelMinimo: nivelMinimo,
      };

      const response = await addVariable(productId, newVariableData);
      if (response) {
        toast.success(`Variação "${cor.trim()}" adicionada com sucesso!`);
        onVariableAdded(); // Notifica a página pai para recarregar as variáveis
        onOpenChange(false); // Fecha o modal
        setCor("");
        setNumero(undefined);
        setImagemUrl("");
        setQuantidade(undefined);
        setEstoque(undefined);
        setNivelMinimo(undefined);
      } else {
        toast.error("Não foi possível adicionar a variação.");
      }
    } catch (error: unknown) {
      console.error("Erro ao adicionar variação:", error);
      toast.error(
        "Erro ao adicionar a variação. Verifique os dados e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Nova Variação</DialogTitle>
          <DialogDescription>
            Adicione os detalhes para a nova variação deste produto.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="cor">Cor</Label>
            <Input
              id="cor"
              value={cor}
              onChange={(e) => setCor(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="numero">Número</Label>
            <Input
              id="numero"
              type="number"
              value={numero !== undefined ? numero : ""}
              onChange={(e) =>
                setNumero(e.target.value ? parseInt(e.target.value) : undefined)
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="imagemUrl">URL da Imagem</Label>
            <Input
              id="imagemUrl"
              type="url"
              value={imagemUrl}
              onChange={(e) => setImagemUrl(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quantidade">Quantidade</Label>
            <Input
              id="quantidade"
              type="number"
              value={quantidade !== undefined ? quantidade : ""}
              onChange={(e) =>
                setQuantidade(
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="estoque">Estoque</Label>
            <Input
              id="estoque"
              type="number"
              value={estoque !== undefined ? estoque : ""}
              onChange={(e) =>
                setEstoque(
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="nivelMinimo">Nível Mínimo</Label>
            <Input
              id="nivelMinimo"
              type="number"
              value={nivelMinimo !== undefined ? nivelMinimo : ""}
              onChange={(e) =>
                setNivelMinimo(
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={loading}>
            {loading ? "Adicionando..." : "Adicionar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddVariableModal;
