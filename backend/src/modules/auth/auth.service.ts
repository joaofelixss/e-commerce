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

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, senha } = loginDto;
    this.logger.log(`Tentativa de login para o email: ${email}`);
    this.logger.log(`Senha recebida do DTO: ${senha}`); // Log da senha recebida
    const usuario = await this.prisma.usuario.findUnique({ where: { email } });

    if (!usuario) {
      this.logger.warn(`Usuário não encontrado para o email: ${email}`);
      throw new UnauthorizedException('Credenciais inválidas');
    }

    this.logger.log(`Usuário encontrado: ${usuario.email}`);
    this.logger.log(
      `Senha hashizada do usuário (antes da verificação): ${usuario.senha}`,
    ); // Log ANTES da verificação

    // Adicionando verificação para garantir que a propriedade 'senha' existe e não é nula
    if (!usuario.senha) {
      this.logger.error(
        `Usuário encontrado, mas a senha está ausente ou nula para o email: ${email}`,
      );
      throw new InternalServerErrorException(
        'Erro interno: Senha do usuário ausente',
      );
    }

    this.logger.log(
      `Senha hashizada do usuário (depois da verificação): ${usuario.senha}`,
    ); // Log DEPOIS da verificação

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha); // Linha 32
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
      const accessToken = await this.jwtService.signAsync(payload);
      this.logger.log(`Token JWT gerado com sucesso.`);
      return { access_token: accessToken };
    } catch (error) {
      this.logger.error(`Erro ao gerar o token JWT:`, error);
      throw new InternalServerErrorException('Erro ao gerar o token');
    }
  }
}
