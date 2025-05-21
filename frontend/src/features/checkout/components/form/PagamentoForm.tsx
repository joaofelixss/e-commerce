import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface PagamentoFormProps {
  formaPagamento: string;
  onChange: (value: "dinheiro" | "pix" | "cartao") => void;
}

export function PagamentoForm({
  formaPagamento,
  onChange,
}: PagamentoFormProps) {
  return (
    <div className="space-y-1">
      <Label htmlFor="formaPagamento">Forma de Pagamento:</Label>
      <Select value={formaPagamento} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione a forma de pagamento" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="dinheiro">Dinheiro</SelectItem>
          <SelectItem value="pix">Pix</SelectItem>
          <SelectItem value="cartao">Cartão</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
