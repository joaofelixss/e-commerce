import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query, // Importe Query
} from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CheckoutPedidoDto } from './dto/checkout-pedido.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('pedidos')
@UseGuards(JwtAuthGuard)
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  async create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidosService.create(createPedidoDto);
  }

  @Get()
  async findAll(
    @Query('page') pageStr: string = '1',
    @Query('limit') limitStr: string = '10',
  ) {
    const page = parseInt(pageStr, 10);
    const limit = parseInt(limitStr, 10);
    return this.pedidosService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.pedidosService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePedidoDto: UpdatePedidoDto,
  ) {
    return this.pedidosService.update(id, updatePedidoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.pedidosService.remove(id);
  }

  @Post('checkout') // ROTA PARA O CHECKOUT
  async checkout(@Body() checkoutPedidoDto: CheckoutPedidoDto) {
    return this.pedidosService.checkout(checkoutPedidoDto);
  }
}
