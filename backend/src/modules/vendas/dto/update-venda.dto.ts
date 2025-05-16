import { IsOptional, IsString } from 'class-validator';

export class UpdateVendaDto {
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
}
