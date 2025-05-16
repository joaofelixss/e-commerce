import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UsePipes,
  ValidationPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { VendasService } from './vendas.service';
import { CreateVendaDto } from './dto/create-venda.dto';
import { AddItemVendaDto } from './dto/add-item-venda.dto';
import { UpdateVendaDto } from './dto/update-venda.dto';

@Controller('vendas')
export class VendasController {
  constructor(private readonly vendasService: VendasService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createVendaDto: CreateVendaDto) {
    return this.vendasService.create(createVendaDto);
  }

  @Post(':id/itens')
  @UsePipes(new ValidationPipe())
  async addItem(
    @Param('id') vendaId: string,
    @Body() addItemVendaDto: AddItemVendaDto,
  ) {
    return this.vendasService.addItem(vendaId, addItemVendaDto);
  }

  @Get()
  async findAll() {
    return this.vendasService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.vendasService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id') id: string,
    @Body() updateVendaDto: UpdateVendaDto,
  ) {
    return this.vendasService.update(id, updateVendaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.vendasService.remove(id);
  }
}
