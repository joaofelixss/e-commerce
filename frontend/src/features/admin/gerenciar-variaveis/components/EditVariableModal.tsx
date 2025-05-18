// src/components/EditVariableModal.tsx
"use client";

import React, { useState, useEffect } from "react";
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
import { toast } from "sonner";
import { updateVariable } from "../api/variation";

interface EditVariableModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string | string[];
  variable: {
    id: string;
    cor?: string;
    numero?: number;
    imagemUrl?: string;
    quantidade?: number;
    estoque?: number;
    nivelMinimo?: number;
    produtoId: string | string[];
  } | null;
  onVariableUpdated: () => void; // Função para notificar a página pai que a variável foi atualizada
}

const EditVariableModal: React.FC<EditVariableModalProps> = ({
  open,
  onOpenChange,
  productId,
  variable,
  onVariableUpdated,
}) => {
  const [cor, setCor] = useState("");
  const [numero, setNumero] = useState<number | undefined>(undefined);
  const [imagemUrl, setImagemUrl] = useState("");
  const [quantidade, setQuantidade] = useState<number | undefined>(undefined);
  const [estoque, setEstoque] = useState<number | undefined>(undefined);
  const [nivelMinimo, setNivelMinimo] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (variable) {
      setCor(variable.cor || "");
      setNumero(variable.numero);
      setImagemUrl(variable.imagemUrl || "");
      setQuantidade(variable.quantidade);
      setEstoque(variable.estoque);
      setNivelMinimo(variable.nivelMinimo);
    } else {
      setCor("");
      setNumero(undefined);
      setImagemUrl("");
      setQuantidade(undefined);
      setEstoque(undefined);
      setNivelMinimo(undefined);
    }
  }, [variable]);

  const handleSubmit = async () => {
    if (!variable?.id) {
      return; // Se não houver variável para editar, não faz nada
    }

    if (!cor.trim()) {
      toast.error("Por favor, preencha a cor da variação.");
      return;
    }

    setLoading(true);
    try {
      const updatedVariableData = {
        cor: cor.trim(),
        numero: numero,
        imagemUrl: imagemUrl.trim(),
        quantidade: quantidade,
        estoque: estoque,
        nivelMinimo: nivelMinimo,
      };

      const response = await updateVariable(
        productId,
        variable.id,
        updatedVariableData
      );
      if (response) {
        toast.success(`Variação "${cor.trim()}" atualizada com sucesso!`);
        onVariableUpdated(); // Notifica a página pai para recarregar as variáveis
        onOpenChange(false); // Fecha o modal
      } else {
        toast.error("Não foi possível atualizar a variação.");
      }
    } catch (error: unknown) {
      console.error("Erro ao atualizar variação:", error);
      toast.error(
        "Erro ao atualizar a variação. Verifique os dados e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Variação</DialogTitle>
          <DialogDescription>
            Edite os detalhes desta variação.
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
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditVariableModal;
