import {
  IsNotEmpty,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsString,
  IsNumber,
  Min,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CheckoutItemDto {
  @IsNotEmpty()
  @IsString()
  produtoId!: string;

  @IsOptional()
  @IsUUID(undefined, {
    message: 'O ID da variação no item do pedido deve ser um UUID válido.',
  })
  variacaoId?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantidade!: number;
}

export class EnderecoEntregaDto {
  @IsNotEmpty()
  @IsString()
  cep!: string;

  @IsNotEmpty()
  @IsString()
  rua!: string;

  @IsNotEmpty()
  @IsString()
  bairro!: string;

  @IsNotEmpty()
  @IsString()
  cidade!: string;

  @IsNotEmpty()
  @IsString()
  estado!: string;

  @IsNotEmpty()
  @IsString()
  numero!: string;

  @IsOptional()
  @IsString()
  complemento?: string;
}

export class ClienteInfoDto {
  @IsNotEmpty()
  @IsString()
  nome!: string;

  @IsNotEmpty()
  @IsString()
  telefone!: string;

  @IsOptional()
  @IsString()
  endereco?: string;

  @IsOptional()
  @IsString()
  numero?: string;

  @IsOptional()
  @IsString()
  complemento?: string;

  @IsOptional()
  @IsString()
  bairro?: string;

  @IsOptional()
  @IsString()
  cidade?: string;

  @IsOptional()
  @IsString()
  uf?: string;

  @IsOptional()
  @IsString()
  cep?: string;

  @IsOptional()
  @IsString()
  email?: string; // Adicione esta linha
}

export class CheckoutPedidoDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CheckoutItemDto)
  produtos!: CheckoutItemDto[]; // Renomeado para 'produtos' para corresponder ao frontend

  @IsNotEmpty()
  @IsNumber()
  total!: number; // Adicionado o total do pedido

  @IsOptional()
  @ValidateNested()
  @Type(() => EnderecoEntregaDto)
  enderecoEntrega?: EnderecoEntregaDto | null; // Tornando opcional e permitindo null

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ClienteInfoDto)
  cliente!: ClienteInfoDto; // Adicionado o objeto 'cliente'

  @IsOptional()
  @IsString()
  observacoes?: string | null; // Adicionadas as observações

  @IsNotEmpty()
  @IsString()
  formaPagamento!: 'dinheiro' | 'pix' | 'cartao'; // Adicionada a forma de pagamento
}
