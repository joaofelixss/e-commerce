"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react"; // Ícone de hamburger
import { Button } from "@/components/ui/button"; // Botão para o ícone
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area"; // Para rolagem no sheet
import {
  Accordion, // Para submenus no mobile
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BarChartIcon,
  PackageIcon,
  ListChecksIcon,
  UsersIcon,
  ChartPieIcon,
  SettingsIcon,
  TagIcon,
  ShoppingCartIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Interfaces para os Itens do Menu ---
interface MenuItem {
  title: string;
  url: string;
  icon?: React.ElementType;
  submenu?: { title: string; url: string }[];
}

// --- Dados dos Itens do Menu (copiado do seu código, ajustado para /admin/) ---
const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: BarChartIcon,
  },
  {
    title: "Produtos",
    url: "/admin/gerenciar-produtos",
    icon: PackageIcon,
    submenu: [
      { title: "Todos os Produtos", url: "/admin/gerenciar-produtos" },
      {
        title: "Adicionar Produto",
        url: "/admin/gerenciar-produtos/adicionar",
      },
    ],
  },
  {
    title: "Pedidos",
    url: "/admin/pedidos",
    icon: ListChecksIcon,
    submenu: [
      { title: "Todos os Pedidos", url: "/admin/pedidos" },
      { title: "Novo Pedido", url: "/admin/pedidos/novo" },
    ],
  },
  {
    title: "Estoque",
    url: "/admin/estoque",
    icon: PackageIcon,
    submenu: [
      { title: "Visão Geral", url: "/admin/estoque" },
      { title: "Inventário", url: "/admin/estoque/inventario" },
    ],
  },
  {
    title: "Clientes",
    url: "/admin/clientes",
    icon: UsersIcon,
    submenu: [
      { title: "Lista de Clientes", url: "/admin/clientes" },
      { title: "Adicionar Cliente", url: "/admin/clientes/adicionar" },
    ],
  },
  {
    title: "Vendas",
    url: "/admin/vendas",
    icon: ShoppingCartIcon,
    submenu: [
      { title: "Vendas Realizadas", url: "/admin/vendas" },
      { title: "Adicionar Venda", url: "/admin/vendas/adicionar" },
    ],
  },
  {
    title: "Categorias",
    url: "/admin/categorias",
    icon: TagIcon,
    submenu: [
      { title: "Todas as Categorias", url: "/admin/categorias" },
      { title: "Adicionar Categoria", url: "/admin/categorias/adicionar" },
    ],
  },
  {
    title: "Configurações",
    url: "/admin/user/config",
    icon: SettingsIcon,
  },
];

const documentsData: MenuItem[] = [
  {
    title: "Relatórios",
    url: "/admin/relatorios",
    icon: ChartPieIcon,
    submenu: [
      { title: "Visão Geral", url: "/admin/relatorios" },
      { title: "Relatório de Vendas", url: "/admin/relatorios/vendas" },
      { title: "Relatório de Estoque", url: "/admin/relatorios/estoque" },
    ],
  },
];

const AdminMobileNav: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false); // Estado para controlar a Sheet

  const allMenuItems = [...menuItems, ...documentsData];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden" // Esconde o botão em telas maiores que 'md'
          aria-label="Toggle mobile menu"
        >
          <MenuIcon className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[300px] sm:w-[400px] flex flex-col"
      >
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Admin Menu</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 px-4 py-6">
          <div className="flex flex-col space-y-4">
            {allMenuItems.map((item) => (
              <React.Fragment key={item.title}>
                {item.submenu ? (
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value={item.title}>
                      <AccordionTrigger className="text-lg font-semibold [&[data-state=open]>svg]:rotate-180">
                        <div className="flex items-center">
                          {item.icon && <item.icon className="mr-3 h-5 w-5" />}
                          {item.title}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-0 pl-8">
                        <div className="flex flex-col space-y-2">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.title}
                              href={subItem.url}
                              onClick={() => setIsOpen(false)} // Fecha a Sheet ao clicar
                              className={cn(
                                "block py-2 text-base text-muted-foreground transition-colors hover:text-foreground",
                                pathname === subItem.url &&
                                  "font-semibold text-primary" // Estilo para link ativo
                              )}
                            >
                              {subItem.title}
                            </Link>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ) : (
                  <Link
                    href={item.url}
                    onClick={() => setIsOpen(false)} // Fecha a Sheet ao clicar
                    className={cn(
                      "flex items-center text-lg font-semibold transition-colors hover:text-foreground",
                      pathname === item.url && "text-primary", // Estilo para link ativo
                      item.url.startsWith("/admin/user")
                        ? "pt-4 border-t border-border"
                        : "" // Exemplo de separação para Configurações
                    )}
                  >
                    {item.icon && <item.icon className="mr-3 h-5 w-5" />}
                    {item.title}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </div>
        </ScrollArea>
        {/* Aqui você pode adicionar um footer para o Sheet, como o dropdown de usuário */}
        {/* Por simplicidade, não incluí o dropdown de usuário aqui, mas você pode adaptar */}
      </SheetContent>
    </Sheet>
  );
};

export default AdminMobileNav;
