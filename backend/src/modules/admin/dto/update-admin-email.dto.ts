import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class UpdateAdminEmailDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: 'O email atual deve ser um email válido.' })
  currentEmail!: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: 'O novo email deve ser um email válido.' })
  newEmail!: string;
}
