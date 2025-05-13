// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { PedidosModule } from './modules/pedidos/pedidos.module';
import { ClientesModule } from './modules/clientes/clientes.module';
import { CategoriasModule } from './modules/categorias/categorias.module';
import { ConfigModule } from '@nestjs/config';
import { ProdutosModule } from './modules/produtos/produtos.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EstoqueService } from './modules/estoque/estoque.service';
import { NestFactory, NestApplication } from '@nestjs/core'; // Importando NestApplication
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { UploadModule } from './upload/upload.module';
import { VariacoesModule } from './modules/variacoes/variacoes.module';
import { EstoqueModule } from './modules/estoque/estoque.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Para que o ConfigService esteja disponível em toda a aplicação
    }),
    AuthModule,
    UploadModule,
    PedidosModule,
    EstoqueModule,
    ClientesModule,
    CategoriasModule,
    ProdutosModule,
    DashboardModule,
    ScheduleModule.forRoot(),
    VariacoesModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, EstoqueService],
  exports: [PrismaService], // <--- Certifique-se de ter esta linha
})
export class AppModule {}

// Função para configurar o Swagger
async function setupSwagger(app: NestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Loja Mae API')
    .setDescription('API para a loja online Loja Mae')
    .setVersion('1.0')
    // .addTag('pedidos') // Você pode adicionar tags para organizar seus endpoints
    // .addTag('produtos')
    // .addTag('clientes')
    .addBearerAuth() // Se você estiver usando autenticação Bearer (JWT)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // O path onde a documentação estará disponível: /api
}

// Bootstrap da aplicação (modifique para incluir a configuração do Swagger)
async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule); // Usando NestApplication aqui
  await setupSwagger(app); // Configure o Swagger
  await app.listen(3001);
}
bootstrap();
