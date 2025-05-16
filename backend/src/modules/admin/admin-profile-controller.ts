import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminProfileService } from './admin-profile.service';
import { UpdateAdminPasswordDto } from './dto/update-admin-password.dto';
import { UpdateAdminEmailDto } from './dto/update-admin-email.dto';
import { User } from '../users/entities/user.entity'; // Importe sua entidade de Usuário

interface AdminProfile {
  id: User['id'];
  nome: User['nome'];
  email: User['email'];
  role: User['role'];
}

@UseGuards(JwtAuthGuard)
@Controller('admin/profile')
export class AdminProfileController {
  constructor(private readonly adminProfileService: AdminProfileService) {}

  @Get()
  async getProfile(@Request() req: any): Promise<AdminProfile> {
    return this.adminProfileService.getAdminProfile(req.user.sub);
  }

  @Patch('change-password')
  async changePassword(
    @Request() req: any,
    @Body() updateAdminPasswordDto: UpdateAdminPasswordDto,
  ): Promise<{ message: string }> {
    await this.adminProfileService.changePassword(
      req.user.sub,
      updateAdminPasswordDto.currentPassword,
      updateAdminPasswordDto.newPassword,
    );
    return { message: 'Senha atualizada com sucesso!' };
  }

  @Patch('change-email')
  async changeEmail(
    @Request() req: any,
    @Body() updateAdminEmailDto: UpdateAdminEmailDto,
  ): Promise<{ message: string }> {
    await this.adminProfileService.changeEmail(
      req.user.sub,
      updateAdminEmailDto.currentEmail,
      updateAdminEmailDto.newEmail,
    );
    return { message: 'Email atualizado com sucesso!' };
  }
}
