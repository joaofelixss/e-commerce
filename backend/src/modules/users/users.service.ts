// src/modules/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Usuario } from '@prisma/client'; // Importe o tipo Usuario do Prisma Client

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string): Promise<Usuario | null> {
    const user = await this.prisma.usuario.findUnique({ where: { id } });
    return user;
  }

  async findOneByEmail(email: string): Promise<Usuario | null> {
    const user = await this.prisma.usuario.findUnique({ where: { email } });
    return user;
  }
}
