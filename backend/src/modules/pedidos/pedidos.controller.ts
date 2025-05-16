import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query, // Importe Query
} from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
//import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CheckoutPedidoDto } from './dto/checkout-pedido.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('pedidos')
//@UseGuards(JwtAuthGuard)
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
    return this.pedidosService.findAllPedidos(page, limit); // Chamando o método renomeado
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.pedidosService.findPedidoById(id); // Chamando o método renomeado
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePedidoDto: UpdatePedidoDto,
  ) {
    return this.pedidosService.updatePedido(id, updatePedidoDto); // Chamando o método renomeado
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.pedidosService.removePedido(id); // Chamando o método renomeado
  }

  @Post('checkout') // ROTA PARA O CHECKOUT
  async checkout(@Body() checkoutPedidoDto: CheckoutPedidoDto) {
    return this.pedidosService.checkout(checkoutPedidoDto);
  }
}
