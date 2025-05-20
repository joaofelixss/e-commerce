"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
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
import { cn } from "@/lib/utils"; // Certifique-se de que este caminho está correto e 'cn' está configurado

// --- Interfaces para os Itens do Menu ---
interface MenuItem {
  title: string;
  url: string;
  icon?: React.ElementType; // Usamos React.ElementType para os componentes de ícone
  submenu?: { title: string; url: string }[];
}

interface NavProps {
  items: MenuItem[];
}

// --- Dados dos Itens do Menu (copiado do seu código) ---
const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/admin/dashboard", // Ajustado para /admin/dashboard, já que é um layout de admin
    icon: BarChartIcon,
  },
  {
    title: "Produtos",
    url: "/admin/gerenciar-produtos", // Ajustado para /admin/
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
    url: "/admin/pedidos", // Ajustado para /admin/
    icon: ListChecksIcon,
    submenu: [
      { title: "Todos os Pedidos", url: "/admin/pedidos" },
      { title: "Novo Pedido", url: "/admin/pedidos/novo" },
    ],
  },
  {
    title: "Estoque",
    url: "/admin/estoque", // Ajustado para /admin/
    icon: PackageIcon,
    submenu: [
      { title: "Visão Geral", url: "/admin/estoque" },
      { title: "Inventário", url: "/admin/estoque/inventario" },
    ],
  },
  {
    title: "Clientes",
    url: "/admin/clientes", // Ajustado para /admin/
    icon: UsersIcon,
    submenu: [
      { title: "Lista de Clientes", url: "/admin/clientes" },
      { title: "Adicionar Cliente", url: "/admin/clientes/adicionar" },
    ],
  },
  {
    title: "Vendas",
    url: "/admin/vendas", // Ajustado para /admin/
    icon: ShoppingCartIcon,
    submenu: [
      { title: "Vendas Realizadas", url: "/admin/vendas" },
      { title: "Adicionar Venda", url: "/admin/vendas/adicionar" },
    ],
  },
  {
    title: "Categorias",
    url: "/admin/categorias", // Ajustado para /admin/
    icon: TagIcon,
    submenu: [
      { title: "Todas as Categorias", url: "/admin/categorias" },
      { title: "Adicionar Categoria", url: "/admin/categorias/adicionar" },
    ],
  },
  {
    title: "Configurações",
    url: "/admin/user/config", // Ajustado para /admin/user/config, assumindo que esteja dentro da área admin
    icon: SettingsIcon,
  },
];

const documentsData: MenuItem[] = [
  {
    title: "Relatórios",
    url: "/admin/relatorios", // Ajustado para /admin/
    icon: ChartPieIcon,
    submenu: [
      { title: "Visão Geral", url: "/admin/relatorios" },
      { title: "Relatório de Vendas", url: "/admin/relatorios/vendas" },
      { title: "Relatório de Estoque", url: "/admin/relatorios/estoque" },
    ],
  },
];

// --- Componente Auxiliar para Itens de Lista do Navigation Menu (Submenus) ---
// Este componente é reutilizável para renderizar itens dentro de NavigationMenuContent
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon?: React.ElementType }
>(({ className, title, children, icon: Icon, ...props }, ref) => {
  const pathname = usePathname();
  const isActive = props.href === pathname; // Verifica se o link é o ativo

  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            isActive && "bg-accent text-accent-foreground", // Estiliza se estiver ativo
            className
          )}
          {...props}
        >
          <div className="flex items-center">
            {Icon && <Icon className="mr-2 h-4 w-4" />}{" "}
            {/* Renderiza o ícone se existir */}
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          {children && (
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          )}
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

// --- Componente Principal do Navigation Menu ---
const AdminNavMenu: React.FC = () => {
  const pathname = usePathname();

  // Combine os itens de menu e documentos, se desejar todos no mesmo menu
  // Ou mantenha-os separados se forem seções distintas do menu
  const allMenuItems = [...menuItems, ...documentsData];

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {allMenuItems.map((item) => (
          <NavigationMenuItem key={item.title}>
            {item.submenu ? (
              <>
                <NavigationMenuTrigger
                  className={cn(
                    pathname.startsWith(item.url) &&
                      "bg-accent text-accent-foreground"
                  )}
                >
                  {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                  {item.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    {/* Item de destaque no submenu, se aplicável */}
                    {item.title === "Produtos" && ( // Exemplo para Produtos
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href={item.url} // Link para a página principal da seção (ex: /admin/gerenciar-produtos)
                          >
                            {item.icon && (
                              <item.icon className="mb-2 h-6 w-6" />
                            )}
                            <div className="mb-2 mt-4 text-lg font-medium">
                              {item.title}
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              {item.title === "Produtos"
                                ? "Gerencie todos os seus produtos, categorias e estoque."
                                : "Visão geral da seção."}
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    )}
                    {item.submenu.map((subItem) => (
                      <ListItem
                        key={subItem.title}
                        href={subItem.url}
                        title={subItem.title}
                      />
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              <Link href={item.url} legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    pathname === item.url && "bg-accent text-accent-foreground" // Estiliza se for o link ativo
                  )}
                >
                  {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                  {item.title}
                </NavigationMenuLink>
              </Link>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default AdminNavMenu;
