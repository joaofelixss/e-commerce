import {
  IsUUID,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsNumber,
  ArrayMinSize,
  ArrayMaxSize,
  Min,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ItemPedidoDto {
  @IsUUID(undefined, {
    message: 'O ID do produto no item do pedido deve ser um UUID válido.',
  })
  @IsNotEmpty({
    message: 'O ID do produto no item do pedido não pode estar vazio.',
  })
  readonly produtoId!: string;

  @IsOptional()
  @IsUUID(undefined, {
    message: 'O ID da variação no item do pedido deve ser um UUID válido.',
  })
  readonly variacaoId?: string; // Adicionamos o variacaoId como opcional

  @IsNumber(
    {},
    { message: 'A quantidade no item do pedido deve ser um número.' },
  )
  @IsNotEmpty({
    message: 'A quantidade no item do pedido não pode estar vazia.',
  })
  @Min(1, { message: 'A quantidade mínima por item no pedido é 1.' })
  readonly quantidade!: number;
}

export class CreatePedidoDto {
  @IsUUID(undefined, { message: 'O ID do cliente deve ser um UUID válido.' })
  @IsNotEmpty({ message: 'O ID do cliente não pode estar vazio.' })
  readonly clienteId!: string;

  @IsArray({ message: 'Os itens do pedido devem ser um array.' })
  @ValidateNested({ each: true })
  @Type(() => ItemPedidoDto)
  @ArrayMinSize(1, { message: 'O pedido deve ter pelo menos um item.' })
  @ArrayMaxSize(100, { message: 'O pedido não pode ter mais de 100 itens.' })
  readonly itens!: ItemPedidoDto[];
}
