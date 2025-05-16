// frontend/src/features/estoque/components/EditStockModal.tsx
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

interface EditStockModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: {
    id: string;
    nome: string;
    quantidade: number;
    nivelMinimo?: number | null;
    variacao?: string;
  } | null;
  onSave: (
    itemId: string,
    newQuantity: number,
    newMinLevel?: number | null
  ) => void;
}

const EditStockModal: React.FC<EditStockModalProps> = ({
  open,
  onOpenChange,
  item,
  onSave,
}) => {
  const [quantity, setQuantity] = useState<number>(0);
  const [minLevel, setMinLevel] = useState<number | null | undefined>(
    undefined
  );

  useEffect(() => {
    if (item) {
      setQuantity(item.quantidade);
      setMinLevel(item.nivelMinimo);
    } else {
      setQuantity(0);
      setMinLevel(undefined);
    }
  }, [item]);

  const handleSave = () => {
    if (item) {
      onSave(item.id, quantity, minLevel);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Estoque</DialogTitle>
          <DialogDescription>
            Você está editando o estoque de:{" "}
            <strong>
              {item?.nome} {item?.variacao ? `(${item.variacao})` : ""}
            </strong>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Quantidade:
            </Label>
            <Input
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              type="number"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="min-level" className="text-right">
              Nível Mínimo:
            </Label>
            <Input
              id="min-level"
              value={minLevel !== undefined ? minLevel : ""}
              onChange={(e) =>
                setMinLevel(
                  e.target.value === "" ? undefined : Number(e.target.value)
                )
              }
              type="number"
              placeholder="Opcional"
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
          <Button type="button" onClick={handleSave}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditStockModal;
