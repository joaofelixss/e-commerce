import {
  Injectable,
  UnauthorizedException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

interface PublicUser {
  id: string;
  nome: string;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(
    loginDto: LoginDto,
  ): Promise<{ token: string; user: PublicUser }> {
    const { email, senha } = loginDto;

    this.logger.log(`Tentativa de login para o email: ${email}`);
    this.logger.log(`Senha recebida do DTO: ${senha}`);

    const usuario = await this.prisma.usuario.findUnique({ where: { email } });

    if (!usuario) {
      this.logger.warn(`Usuário não encontrado para o email: ${email}`);
      throw new UnauthorizedException('Credenciais inválidas');
    }

    this.logger.log(`Usuário encontrado: ${usuario.email}`);
    this.logger.log(`Senha hashizada do usuário: ${usuario.senha}`);

    if (!usuario.senha) {
      this.logger.error(`Senha ausente para o email: ${email}`);
      throw new InternalServerErrorException(
        'Erro interno: Senha do usuário ausente',
      );
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    this.logger.log(`Resultado da comparação de senha: ${senhaCorreta}`);

    if (!senhaCorreta) {
      this.logger.warn(`Senha incorreta para o usuário: ${usuario.email}`);
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = {
      sub: usuario.id,
      username: usuario.nome,
      role: usuario.role,
    };

    this.logger.log(`Payload do JWT: ${JSON.stringify(payload)}`);

    try {
      const token = await this.jwtService.signAsync(payload);
      this.logger.log(`Token JWT gerado com sucesso.`);

      const user: PublicUser = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
      };

      return { token, user };
    } catch (error) {
      this.logger.error(`Erro ao gerar o token JWT:`, error);
      throw new InternalServerErrorException('Erro ao gerar o token');
    }
  }
}
