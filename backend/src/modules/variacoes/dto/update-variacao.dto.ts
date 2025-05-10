import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateVariacaoDto {
  @IsOptional()
  @IsString()
  cor?: string;

  @IsOptional()
  @IsNumber()
  numero?: number;

  @IsOptional()
  @IsString()
  imagemUrl?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  quantidade?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  estoque?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  nivelMinimo?: number;

  @IsOptional()
  @IsString()
  produtoId?: string;
}
