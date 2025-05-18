"use client";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { addManualSale } from "../api/sales"; // Importe a função da API
import { toast } from "react-toastify"; // Importe a função de toast do react-toastify
import "react-toastify/dist/ReactToastify.css"; // Importe os estilos do react-toastify

interface AddManualSaleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onManualSaleAdded: () => void;
}

const AddManualSaleModal: React.FC<AddManualSaleModalProps> = ({
  open,
  onOpenChange,
  onManualSaleAdded,
}) => {
  const [cliente, setCliente] = useState(""); // Pode ser o nome do cliente (se não for selecionar um existente)
  const [valorTotal, setValorTotal] = useState("");
  const [metodoPagamento, setMetodoPagamento] = useState("");
  const [dataVenda, setDataVenda] = useState<Date | undefined>();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoadingSubmit(true);
    setSubmitError(null);

    try {
      const newManualSalePayload = {
        // Se você tiver uma forma de selecionar um cliente existente, use o clienteId
        // cliente: cliente, // Se o backend aceitar o nome do cliente como string
        valorTotal: parseFloat(valorTotal),
        formaPagamento: metodoPagamento,
        dataVenda: dataVenda ? format(dataVenda, "yyyy-MM-dd") : undefined,
        itens: [], // Por enquanto, vendas manuais não têm itens detalhados aqui
      };
      console.log("Dados da nova venda manual:", newManualSalePayload);
      await addManualSale(newManualSalePayload); // Chame a função da API

      toast.success("Venda manual adicionada com sucesso!");

      setCliente("");
      setValorTotal("");
      setMetodoPagamento("");
      setDataVenda(undefined);
      onOpenChange(false);
      onManualSaleAdded();
    } catch (error: unknown) {
      console.error("Erro ao adicionar venda manual:", error);
      toast.error(
        "Erro ao adicionar a venda manual. Por favor, tente novamente."
      );
      setSubmitError(
        "Erro ao adicionar a venda manual. Por favor, tente novamente."
      );
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Venda Manual</DialogTitle>
          <DialogDescription>
            Insira os detalhes da venda realizada manualmente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="cliente">Cliente</Label>
            <Input
              id="cliente"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="valorTotal">Valor Total</Label>
            <Input
              type="number"
              id="valorTotal"
              value={valorTotal}
              onChange={(e) => setValorTotal(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="metodoPagamento">Método de Pagamento</Label>
            <Input
              id="metodoPagamento"
              value={metodoPagamento}
              onChange={(e) => setMetodoPagamento(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dataVenda">Data da Venda</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full text-left font-normal",
                    !dataVenda && "text-muted-foreground"
                  )}
                >
                  {dataVenda ? (
                    format(dataVenda, "PPP")
                  ) : (
                    <span>Selecione a data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0"></PopoverContent>
            </Popover>
          </div>
          {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loadingSubmit}>
              {loadingSubmit ? "Adicionando..." : "Adicionar Venda"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddManualSaleModal;
