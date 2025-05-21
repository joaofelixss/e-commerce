import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ObservacoesFormProps {
  notes: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function ObservacoesForm({ notes, onChange }: ObservacoesFormProps) {
  return (
    <div className="space-y-1">
      <Label htmlFor="notes">Observações Adicionais:</Label>
      <Textarea
        id="notes"
        name="notes"
        rows={3}
        value={notes}
        onChange={onChange}
      />
    </div>
  );
}
