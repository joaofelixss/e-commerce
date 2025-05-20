"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react"; // Ícone de hamburger
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area"; 
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

interface MenuItem {
  title: string;
  url: string;
  icon?: React.ElementType;
  submenu?: { title: string; url: string }[];
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    url: " /dashboard",
    icon: BarChartIcon,
  },
  {
    title: "Produtos",
    url: " /gerenciar-produtos",
    icon: PackageIcon,
    submenu: [
      { title: "Todos os Produtos", url: " /gerenciar-produtos" },
      {
        title: "Adicionar Produto",
        url: " /gerenciar-produtos/adicionar",
      },
    ],
  },
  {
    title: "Pedidos",
    url: " /pedidos",
    icon: ListChecksIcon,
    submenu: [
      { title: "Todos os Pedidos", url: " /pedidos" },
      { title: "Novo Pedido", url: " /pedidos/novo" },
    ],
  },
  {
    title: "Estoque",
    url: " /estoque",
    icon: PackageIcon,
    submenu: [
      { title: "Visão Geral", url: " /estoque" },
      { title: "Inventário", url: " /estoque/inventario" },
    ],
  },
  {
    title: "Clientes",
    url: " /clientes",
    icon: UsersIcon,
    submenu: [
      { title: "Lista de Clientes", url: " /clientes" },
      { title: "Adicionar Cliente", url: " /clientes/adicionar" },
    ],
  },
  {
    title: "Vendas",
    url: " /vendas",
    icon: ShoppingCartIcon,
    submenu: [
      { title: "Vendas Realizadas", url: " /vendas" },
      { title: "Adicionar Venda", url: " /vendas/adicionar" },
    ],
  },
  {
    title: "Categorias",
    url: " /categorias",
    icon: TagIcon,
    submenu: [
      { title: "Todas as Categorias", url: " /categorias" },
      { title: "Adicionar Categoria", url: " /categorias/adicionar" },
    ],
  },
  {
    title: "Configurações",
    url: " /user/config",
    icon: SettingsIcon,
  },
];

const documentsData: MenuItem[] = [
  {
    title: "Relatórios",
    url: " /relatorios",
    icon: ChartPieIcon,
    submenu: [
      { title: "Visão Geral", url: " /relatorios" },
      { title: "Relatório de Vendas", url: " /relatorios/vendas" },
      { title: "Relatório de Estoque", url: " /relatorios/estoque" },
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
                              onClick={() => setIsOpen(false)} 
                              className={cn(
                                "block py-2 text-base text-muted-foreground transition-colors hover:text-foreground",
                                pathname === subItem.url &&
                                  "font-semibold text-primary" 
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
                    onClick={() => setIsOpen(false)} 
                    className={cn(
                      "flex items-center text-lg font-semibold transition-colors hover:text-foreground",
                      pathname === item.url && "text-primary", 
                      item.url.startsWith(" /user")
                        ? "pt-4 border-t border-border"
                        : "" 
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
      </SheetContent>
    </Sheet>
  );
};

export default AdminMobileNav;
