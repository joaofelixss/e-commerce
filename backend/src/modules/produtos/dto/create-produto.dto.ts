import {
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
  IsNotEmpty,
  Length,
  Min,
  IsUrl,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVariacaoDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50, {
    message: 'A cor da variação deve ter entre 3 e 50 caracteres.',
  })
  readonly cor!: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'O número da variação não pode ser negativo.' })
  readonly numero?: number;

  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'A URL da imagem da variação não é válida.' })
  @Length(5, 2048, {
    message: 'A URL da imagem da variação deve ter entre 5 e 2048 caracteres.',
  })
  readonly imagemUrl?: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: 'A quantidade da variação não pode ser negativa.' })
  readonly quantidade!: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: 'O estoque da variação não pode ser negativo.' })
  readonly estoque!: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'O nível mínimo da variação não pode ser negativo.' })
  readonly nivelMinimo?: number; // Adicionado nivelMinimo
}

export class CreateProdutoDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 255, {
    message: 'O nome do produto deve ter entre 3 e 255 caracteres.',
  })
  readonly nome!: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0.01, { message: 'O preço do produto deve ser maior que zero.' })
  readonly preco!: number;

  @IsString()
  @IsNotEmpty()
  @IsUrl({}, { message: 'A URL da imagem principal não é válida.' })
  @Length(5, 2048, {
    message: 'A URL da imagem principal deve ter entre 5 e 2048 caracteres.',
  })
  readonly imagemUrl!: string;

  @IsUUID()
  @IsNotEmpty()
  readonly categoriaId!: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariacaoDto)
  readonly variacoes?: CreateVariacaoDto[];
}
