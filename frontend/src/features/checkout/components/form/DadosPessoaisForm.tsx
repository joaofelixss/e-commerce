// src/features/checkout/components/form/DadosPessoaisForm.tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DadosPessoaisFormProps {
  name: string;
  phone: string;
  handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  nameError: string | null;
  phoneError: string | null;
}

export function DadosPessoaisForm({
  name,
  phone,
  handleNameChange,
  handlePhoneChange,
  nameError,
  phoneError,
}: DadosPessoaisFormProps) {
  return (
    <>
      <div className="space-y-1">
        <Label htmlFor="name">Nome Completo:</Label>
        <Input
          id="name"
          name="name"
          type="text"
          value={name}
          onChange={handleNameChange}
          required
        />
        {nameError && (
          <p className="text-red-500 text-xs italic">{nameError}</p>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="phone">Telefone (com DDD):</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={phone}
          onChange={handlePhoneChange}
          required
        />
        {phoneError && (
          <p className="text-red-500 text-xs italic">{phoneError}</p>
        )}
      </div>
    </>
  );
}
