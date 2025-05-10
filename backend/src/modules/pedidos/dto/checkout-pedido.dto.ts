import {
  IsNotEmpty,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsString,
  IsNumber,
  Min,
  IsOptional,
  IsUUID, // Importe IsUUID
} from 'class-validator';
import { Type } from 'class-transformer';

export class CheckoutItemDto {
  @IsNotEmpty()
  @IsString()
  produtoId: string;

  @IsOptional()
  @IsUUID(undefined, {
    message: 'O ID da variação no item do pedido deve ser um UUID válido.',
  })
  variacaoId?: string; // Adicionamos o variacaoId como opcional

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantidade: number;

  constructor(produtoId: string, quantidade: number, variacaoId?: string) {
    // Adicionando um construtor
    this.produtoId = produtoId;
    this.quantidade = quantidade;
    this.variacaoId = variacaoId;
  }
}

export class EnderecoEntregaDto {
  @IsNotEmpty()
  @IsString()
  rua: string;

  @IsNotEmpty()
  @IsString()
  numero: string;

  @IsOptional() // Importante: adicionei a importação no topo
  @IsString()
  complemento?: string;

  @IsNotEmpty()
  @IsString()
  bairro: string;

  @IsNotEmpty()
  @IsString()
  cidade: string;

  @IsNotEmpty()
  @IsString()
  estado: string;

  @IsNotEmpty()
  @IsString()
  cep: string;

  constructor(
    rua: string,
    numero: string,
    bairro: string,
    cidade: string,
    estado: string,
    cep: string,
    complemento?: string,
  ) {
    // Adicionando um construtor
    this.rua = rua;
    this.numero = numero;
    this.bairro = bairro;
    this.cidade = cidade;
    this.estado = estado;
    this.cep = cep;
    this.complemento = complemento;
  }
}

export class CheckoutPedidoDto {
  @IsNotEmpty()
  @IsString()
  clienteId: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CheckoutItemDto)
  itens: CheckoutItemDto[];

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => EnderecoEntregaDto)
  enderecoEntrega: EnderecoEntregaDto;

  constructor(
    clienteId: string,
    itens: CheckoutItemDto[],
    enderecoEntrega: EnderecoEntregaDto,
  ) {
    // Adicionando um construtor
    this.clienteId = clienteId;
    this.itens = itens;
    this.enderecoEntrega = enderecoEntrega;
  }
}
