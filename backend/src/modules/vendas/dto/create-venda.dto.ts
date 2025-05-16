import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateItemVendaDto {
  @IsString()
  produtoId!: string;

  @IsOptional()
  @IsString()
  variacaoId?: string;

  @IsNumber()
  quantidade!: number;

  @IsNumber()
  precoVenda!: number;

  @IsOptional()
  @IsNumber()
  custoUnitario?: number;
}

export class CreateVendaDto {
  @IsOptional()
  @IsString()
  pedidoId?: string;

  @IsOptional()
  @IsString()
  clienteId?: string;

  @IsOptional()
  @IsString()
  formaPagamento?: string;

  @IsOptional()
  @IsString()
  observacoes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItemVendaDto)
  itens?: CreateItemVendaDto[];
}
