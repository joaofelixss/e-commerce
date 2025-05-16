import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateAdminPasswordDto {
  @IsNotEmpty()
  @IsString()
  currentPassword!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'A nova senha deve ter pelo menos 6 caracteres.' })
  newPassword!: string;
}
