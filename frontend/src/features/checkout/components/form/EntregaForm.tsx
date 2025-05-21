import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface EntregaFormProps {
  mostrar: boolean;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  frete: number;
  handleCepChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEnderecoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNumeroChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleComplementoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  cepError: string | null;
  enderecoError: string | null;
  numeroError: string | null;
}

export function EntregaForm({
  mostrar,
  cep,
  endereco,
  numero,
  complemento,
  bairro,
  cidade,
  uf,
  frete,
  handleCepChange,
  handleEnderecoChange,
  handleNumeroChange,
  handleComplementoChange,
  cepError,
  enderecoError,
  numeroError,
}: EntregaFormProps) {
  if (!mostrar) return null;

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <Label htmlFor="cep">CEP:</Label>
        <Input
          id="cep"
          name="cep"
          type="text"
          value={cep}
          onChange={handleCepChange}
          maxLength={8}
          required
        />
        {cepError && <p className="text-red-500 text-xs italic">{cepError}</p>}
      </div>
      <div className="space-y-1">
        <Label htmlFor="endereco">Endereço:</Label>
        <Input
          id="endereco"
          name="endereco"
          value={endereco}
          onChange={handleEnderecoChange}
          required
        />
        {enderecoError && (
          <p className="text-red-500 text-xs italic">{enderecoError}</p>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="numero">Número:</Label>
        <Input
          id="numero"
          name="numero"
          value={numero}
          onChange={handleNumeroChange}
          required
        />
        {numeroError && (
          <p className="text-red-500 text-xs italic">{numeroError}</p>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="complemento">Complemento (opcional):</Label>
        <Input
          id="complemento"
          name="complemento"
          value={complemento}
          onChange={handleComplementoChange}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="bairro">Bairro:</Label>
        <Input id="bairro" name="bairro" value={bairro} readOnly />
      </div>
      <div className="space-y-1">
        <Label htmlFor="cidade">Cidade:</Label>
        <Input id="cidade" name="cidade" value={cidade} readOnly />
      </div>
      <div className="space-y-1">
        <Label htmlFor="uf">UF:</Label>
        <Input id="uf" name="uf" value={uf} readOnly />
      </div>
      <p className="text-gray-600 text-sm italic">
        Frete: R$ {frete.toFixed(2)}
      </p>
    </div>
  );
}
