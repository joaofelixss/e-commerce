import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateCategoriaDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100, {
    message: 'O nome da categoria deve ter entre 3 e 100 caracteres.',
  })
  readonly nome!: string;
}
