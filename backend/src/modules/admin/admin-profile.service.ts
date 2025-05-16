import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // Assumindo que você tem um serviço Prisma
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service'; // Importe o UsersService

@Injectable()
export class AdminProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService, // Injete o UsersService
  ) {}

  async getAdminProfile(userId: string) {
    const user = await this.usersService.findOne(userId); // Use o UsersService para buscar o usuário
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    // Não retorne a senha por segurança
    const { senha, ...result } = user;
    return result;
  }

  async changePassword(
    userId: string,
    currentPasswordPlain: string,
    newPasswordPlain: string,
  ): Promise<void> {
    const user = await this.usersService.findOne(userId); // Use o UsersService para buscar o usuário
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const isPasswordValid = await bcrypt.compare(
      currentPasswordPlain,
      user.senha,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Senha atual incorreta.');
    }

    if (currentPasswordPlain === newPasswordPlain) {
      throw new BadRequestException(
        'A nova senha deve ser diferente da senha atual.',
      );
    }

    const hashedPassword = await bcrypt.hash(newPasswordPlain, 10);
    await this.prisma.usuario.update({
      where: { id: userId },
      data: { senha: hashedPassword },
    });
  }

  async changeEmail(
    userId: string,
    currentEmail: string,
    newEmail: string,
  ): Promise<void> {
    const user = await this.usersService.findOne(userId); // Use o UsersService para buscar o usuário
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    if (user.email !== currentEmail) {
      throw new UnauthorizedException('Email atual incorreto.');
    }

    const existingUserWithNewEmail =
      await this.usersService.findOneByEmail(newEmail); // Use o UsersService para verificar se o novo email já existe
    if (existingUserWithNewEmail && existingUserWithNewEmail.id !== userId) {
      throw new BadRequestException(
        'Este email já está sendo usado por outro usuário.',
      );
    }

    await this.prisma.usuario.update({
      where: { id: userId },
      data: { email: newEmail },
    });
  }
}
