import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VariacoesService } from './variacoes.service';
import { CreateVariacaoDto } from './dto/create-variacao.dto';
import { UpdateVariacaoDto } from './dto/update-variacao.dto';

@Controller('produtos/:produtoId/variacoes')
export class VariacoesController {
  constructor(private readonly variacoesService: VariacoesService) {}

  @Post()
  create(
    @Param('produtoId') produtoId: string,
    @Body() createVariacaoDto: CreateVariacaoDto,
  ) {
    return this.variacoesService.create({ ...createVariacaoDto, produtoId });
  }

  @Get()
  findAll(@Param('produtoId') produtoId: string) {
    return this.variacoesService.findAll(produtoId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.variacoesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVariacaoDto: UpdateVariacaoDto,
  ) {
    return this.variacoesService.update(id, updateVariacaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.variacoesService.remove(id);
  }
}
