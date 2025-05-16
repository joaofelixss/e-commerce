import { IsString, IsNumber, IsOptional } from 'class-validator';

export class AddItemVendaDto {
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
