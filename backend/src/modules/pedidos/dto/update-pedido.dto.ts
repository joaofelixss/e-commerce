import { IsEnum, IsOptional } from 'class-validator';

enum StatusPedido {
  PENDENTE = 'PENDENTE',
  PROCESSANDO = 'PROCESSANDO',
  ENVIADO = 'ENVIADO',
  ENTREGUE = 'ENTREGUE',
  CANCELADO = 'CANCELADO',
}

export class UpdatePedidoDto {
  @IsOptional()
  @IsEnum(StatusPedido)
  status?: StatusPedido;
}
