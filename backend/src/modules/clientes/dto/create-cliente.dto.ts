import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Length,
  Matches,
} from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 255, {
    message: 'O nome do cliente deve ter entre 3 e 255 caracteres.',
  })
  readonly nome!: string;

  @IsEmail({}, { message: 'O e-mail fornecido não é válido.' })
  @IsNotEmpty()
  @Length(5, 255, {
    message: 'O e-mail deve ter entre 5 e 255 caracteres.',
  })
  readonly email!: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 20, {
    message: 'O telefone deve ter entre 8 e 20 caracteres.',
  })
  @Matches(/^[0-9()+\- ]+$/, {
    message:
      'O telefone deve conter apenas números, parênteses, mais, hífen e espaços.',
  })
  readonly telefone!: string;

  @IsOptional()
  @IsString()
  @Length(5, 255, {
    message: 'O endereço, se fornecido, deve ter entre 5 e 255 caracteres.',
  })
  endereco?: string;
}
