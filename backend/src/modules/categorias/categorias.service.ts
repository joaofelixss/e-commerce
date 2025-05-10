import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoriaDto: CreateCategoriaDto) {
    return this.prisma.categoria.create({ data: createCategoriaDto });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [categorias, total] = await this.prisma.$transaction([
      this.prisma.categoria.findMany({
        skip,
        take: limit,
      }),
      this.prisma.categoria.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: categorias,
      total,
      currentPage: page,
      totalPages,
    };
  }

  async findOne(id: string) {
    const categoria = await this.prisma.categoria.findUnique({ where: { id } });
    if (!categoria) {
      throw new NotFoundException(`Categoria com ID ${id} não encontrada`);
    }
    return categoria;
  }

  async update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
    const categoriaExistente = await this.prisma.categoria.findUnique({
      where: { id },
    });
    if (!categoriaExistente) {
      throw new NotFoundException(`Categoria com ID ${id} não encontrada`);
    }
    return this.prisma.categoria.update({
      where: { id },
      data: updateCategoriaDto,
    });
  }

  async remove(id: string) {
    const categoriaExistente = await this.prisma.categoria.findUnique({
      where: { id },
    });
    if (!categoriaExistente) {
      throw new NotFoundException(`Categoria com ID ${id} não encontrada`);
    }
    return this.prisma.categoria.delete({ where: { id } });
  }
}
