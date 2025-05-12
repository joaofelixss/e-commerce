import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { UpdateVariacaoDto } from './dto/update-variacao.dto'; // Importe o UpdateVariacaoDto
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../../upload/upload.service';
import {
  CloudinaryResult,
  UploadApiErrorResponse,
} from '../../upload/upload.service';

interface MulterFile extends Express.Multer.File {}

@ApiTags('produtos')
//@UseGuards(JwtAuthGuard)
@Controller('produtos')
export class ProdutosController {
  constructor(
    private readonly produtosService: ProdutosService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  async create(@Body() createProdutoDto: CreateProdutoDto) {
    console.log('Dados recebidos no controller:', createProdutoDto);
    return this.produtosService.create(createProdutoDto);
  }

  @Get()
  async findAll(
    @Query('page') pageStr: string = '1',
    @Query('limit') limitStr: string = '10',
    @Query('nome') nome?: string,
    @Query('categoriaId') categoriaId?: string,
    @Query('precoMin') precoMinStr?: string,
    @Query('precoMax') precoMaxStr?: string,
  ) {
    const page = parseInt(pageStr, 10);
    const limit = parseInt(limitStr, 10);
    const precoMin = precoMinStr ? parseFloat(precoMinStr) : undefined;
    const precoMax = precoMaxStr ? parseFloat(precoMaxStr) : undefined;
    return this.produtosService.findAll(
      page,
      limit,
      nome,
      categoriaId,
      precoMin,
      precoMax,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.produtosService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProdutoDto: UpdateProdutoDto,
  ) {
    return this.produtosService.update(id, updateProdutoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.produtosService.remove(id);
  }

  @Patch(':id/imagem')
  @UseInterceptors(FileInterceptor('imagem'))
  async uploadImagemProduto(
    @Param('id') id: string,
    @UploadedFile() imagem: MulterFile,
  ): Promise<{ url?: string } | UploadApiErrorResponse> {
    const result = await this.uploadService.uploadImage(imagem);
    if ('secure_url' in result) {
      const produtoAtualizado = await this.produtosService.atualizarImagem(
        id,
        result.secure_url,
      );
      return { url: produtoAtualizado?.imagemUrl };
    }
    return result;
  }

  @Patch('variacoes/:id')
  async updateVariacao(
    @Param('id') id: string,
    @Body() updateVariacaoDto: UpdateVariacaoDto,
  ) {
    return this.produtosService.updateVariacao(id, updateVariacaoDto);
  }
}
