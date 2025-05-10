import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateVariacaoDto {
  @IsNotEmpty()
  @IsString()
  cor!: string;

  @IsOptional()
  @IsNumber()
  numero?: number;

  @IsOptional()
  @IsString()
  imagemUrl?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  quantidade!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  estoque!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  nivelMinimo?: number;

  @IsNotEmpty()
  @IsString()
  produtoId!: string;
}
