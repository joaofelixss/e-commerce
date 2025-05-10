import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createClienteDto: CreateClienteDto) {
    return this.prisma.cliente.create({ data: createClienteDto });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [clientes, total] = await this.prisma.$transaction([
      this.prisma.cliente.findMany({
        skip,
        take: limit,
      }),
      this.prisma.cliente.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: clientes,
      total,
      currentPage: page,
      totalPages,
    };
  }

  async findOne(id: string) {
    const cliente = await this.prisma.cliente.findUnique({ where: { id } });
    if (!cliente) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }
    return cliente;
  }

  async update(id: string, updateClienteDto: UpdateClienteDto) {
    const clienteExistente = await this.prisma.cliente.findUnique({
      where: { id },
    });
    if (!clienteExistente) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }
    return this.prisma.cliente.update({
      where: { id },
      data: updateClienteDto,
    });
  }

  async remove(id: string) {
    const clienteExistente = await this.prisma.cliente.findUnique({
      where: { id },
    });
    if (!clienteExistente) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }
    return this.prisma.cliente.delete({ where: { id } });
  }
}
