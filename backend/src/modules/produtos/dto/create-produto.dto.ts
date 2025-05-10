import {
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
  IsNotEmpty,
  Length,
  Min,
  IsUrl,
} from 'class-validator';

export class CreateProdutoDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 255, {
    message: 'O nome do produto deve ter entre 3 e 255 caracteres.',
  })
  readonly nome!: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 50, {
    message: 'A cor do produto deve ter entre 3 e 50 caracteres.',
  })
  readonly cor!: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'O número do produto não pode ser negativo.' })
  readonly numero?: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0.01, { message: 'O preço do produto deve ser maior que zero.' })
  readonly preco!: number;

  @IsString()
  @IsNotEmpty()
  @IsUrl({}, { message: 'A URL da imagem não é válida.' })
  @Length(5, 2048, {
    message: 'A URL da imagem deve ter entre 5 e 2048 caracteres.',
  })
  readonly imagemUrl!: string;

  @IsUUID()
  @IsNotEmpty()
  readonly categoriaId!: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: 'A quantidade não pode ser negativa.' })
  readonly quantidade!: number;
}
