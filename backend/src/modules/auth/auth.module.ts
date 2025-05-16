// src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy'; // Importe a JwtStrategy
import { UsersService } from '../users/users.service'; // Importe o UsersService

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Você precisará definir essa variável no .env
        signOptions: { expiresIn: '1h' }, // Exemplo de tempo de expiração
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy, UsersService], // Adicione JwtStrategy e UsersService aos providers
  exports: [JwtModule],
})
export class AuthModule {}
