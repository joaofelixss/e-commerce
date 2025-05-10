# Loja de Barbantes & Crochês

## 📌 Visão Geral

Este é o repositório para a loja virtual desenvolvida para auxiliar na venda de produtos como barbantes, linhas, crochês e tapetes. A plataforma inclui um frontend para os clientes navegarem e realizarem pedidos, e um painel administrativo para o gerenciamento da loja.

O painel administrativo permite o acompanhamento de vendas, pedidos, estoque e clientes, além de fornecer um dashboard com métricas importantes e a possibilidade de compartilhar informações de estoque.

O checkout simplificado envia os pedidos via WhatsApp, com a opção futura de integração com o Mercado Pago. O projeto foi construído com foco em ser moderno, escalável e com um código limpo.

## 🛠️ Tecnologias Principais

<img src="https://skillicons.dev/icons?i=nextjs,react,ts,nestjs,postman,js,postgres,prisma,jest,cypress,tailwind,css,html,git,github&light" />

### Frontend

* **Framework:** Next.js (React com SSR, SPA, SEO e API routes)
* **Linguagem:** TypeScript
* **UI:** Shadcn UI
* **Estilização:** Tailwind CSS
* **Gerenciamento de estado:** Zustand
* **Requisições HTTP:** Axios ou fetch
* **Testes End-to-End:** Cypress
* **Formulários:** React Hook Form + Zod
* **Autenticação:** JWT + cookies
* **Carregamento de imagens:** Cloudinary (opcional)

### Backend

* **Framework:** NestJS (estruturado, escalável, baseado em módulos)
* **Linguagem:** TypeScript
* **ORM:** Prisma
* **Banco de Dados:** PostgreSQL
* **Autenticação:** JWT
* **Upload de imagens:** Cloudinary (nuvem)
* **Deploy:** Railway / Render / Fly.io
* **Documentação da API:** Swagger
* **Testes Unitários e de Integração:** Jest + Supertest

## 🧠 4. Funcionalidades

### Frontend - Público

* Página inicial com destaques
* Página de categorias: `/barbantes`, `/croches`, `/tapetes`
* Página de detalhes do produto
* Página de favoritos (localStorage)
* Carrinho de compras
* Checkout com pedido enviado via WhatsApp
* (Opcional) Checkout com pagamento (Mercado Pago)
* Responsivo para celular e tablet

### 🛒 Cliente

* Navegar por produtos e categorias
* Adicionar ao carrinho / favoritos
* Finalizar pedido (via WhatsApp)

### 🔐 Admin (sua mãe)

* Login e autenticação segura
* **Dashboard de vendas:**
    * Faturamento total
    * Vendas em andamento / concluídas / canceladas
    * Gráfico de desempenho
* Gerenciamento de pedidos
* **Gerenciamento de estoque:**
    * Atualizar quantidades
    * Verificar alertas de baixo estoque
* CRUD completo de produtos (Cadastro, Edição, Exclusão)
* Cadastro de clientes e exportação de lista
* Enviar estoque por WhatsApp ou e-mail
* Histórico de pedidos

### Frontend - Painel Administrativo

* Login
* Listar produtos
* Adicionar novo produto (nome, preço, cor, número, imagem, categoria)
* Editar e excluir produto
* Gerenciar pedidos (ver histórico)
* Interface amigável

### Backend (API)

* CRUD de produtos, categorias, usuários, pedidos
* Upload de imagens com validação
* Autenticação com JWT
* Proteção de rotas (Guards)
* Documentação da API com Swagger

## 🏗️ 3. Estrutura de Pastas e Arquitetura

### 🔹 Frontend (Next.js)
frontend/
├── app/
├── features/
├── components/
├── lib/
├── hooks/
├── styles/
├── types/
├── constants/
└── ...


Arquitetura "Feature-based" com separação de domínios por funcionalidades.

### 🔹 Backend (NestJS)
backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── config/
│   ├── prisma/
│   ├── modules/
│   │   ├── auth/
│   │   ├── admin/
│   │   ├── produtos/
│   │   ├── pedidos/
│   │   ├── estoque/
│   │   ├── clientes/
│   │   └── dashboard/
│   └── common/
│       ├── guards/
│       ├── decorators/
│       └── exceptions/
├── prisma/
└── ...


Arquitetura modular com separação de responsabilidades.

## ⚙️ Banco de Dados

* **ORM:** Prisma
* **Banco de Dados:** PostgreSQL
* **Schema:** (Pode incluir um trecho do seu `prisma/schema.prisma` se quiser destacar os modelos)

## 🚀 Próximos Passos (Opcional)

* Configuração do ambiente de desenvolvimento (Node.js, npm/yarn)
* Instalação das dependências do frontend (`cd frontend && npm install`)
* Configuração das variáveis de ambiente (.env)
* Execução do frontend (`cd frontend && npm run dev`)
* Instalação das dependências do backend (`cd backend && npm install`)
* Configuração do banco de dados PostgreSQL (detalhes da conexão no `.env` do backend)
* Execução das migrations do Prisma (`cd backend && npx prisma migrate dev --name init`)
* Geração do Prisma Client (`cd backend && npx prisma generate`)
* Execução do backend (`cd backend && npm run start:dev`)
