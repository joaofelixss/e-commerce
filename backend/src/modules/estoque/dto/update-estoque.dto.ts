// backend/src/estoque/dto/update-estoque.dto.ts
import { IsNumber, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateEstoqueDTO {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  quantidade?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  nivelMinimo?: number | null;
}
