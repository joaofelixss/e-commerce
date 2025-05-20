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
import { cn } from "@/lib/utils";

interface MenuItem {
  title: string;
  url: string;
  icon?: React.ElementType;
  submenu?: { title: string; url: string }[];
}

interface NavProps {
  items: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: "Produtos",
    url: "/gerenciar-produtos",
    icon: PackageIcon,
    submenu: [
      { title: "Todos os Produtos", url: "/gerenciar-produtos" },
      {
        title: "Adicionar Produto",
        url: "/gerenciar-produtos/adicionar",
      },
    ],
  },
  {
    title: "Pedidos",
    url: "/pedidos",
    icon: ListChecksIcon,
    submenu: [
      { title: "Todos os Pedidos", url: "/pedidos" },
      { title: "Novo Pedido", url: "/pedidos/novo" },
    ],
  },
  {
    title: "Estoque",
    url: "/estoque",
    icon: PackageIcon,
    submenu: [
      { title: "Visão Geral", url: "/estoque" },
      { title: "Inventário", url: "/estoque/inventario" },
    ],
  },
  {
    title: "Clientes",
    url: "/clientes",
    icon: UsersIcon,
    submenu: [
      { title: "Lista de Clientes", url: "/clientes" },
      { title: "Adicionar Cliente", url: "/clientes/adicionar" },
    ],
  },
  {
    title: "Vendas",
    url: "/vendas",
    icon: ShoppingCartIcon,
    submenu: [
      { title: "Vendas Realizadas", url: "/vendas" },
      { title: "Adicionar Venda", url: "/vendas/adicionar" },
    ],
  },
  {
    title: "Categorias",
    url: "/categorias",
    icon: TagIcon,
    submenu: [
      { title: "Todas as Categorias", url: "/categorias" },
      { title: "Adicionar Categoria", url: "/categorias/adicionar" },
    ],
  },
  {
    title: "Configurações",
    url: "/user/config",
    icon: SettingsIcon,
  },
];

const documentsData: MenuItem[] = [
  {
    title: "Relatórios",
    url: "/relatorios",
    icon: ChartPieIcon,
    submenu: [
      { title: "Visão Geral", url: "/relatorios" },
      { title: "Relatório de Vendas", url: "/relatorios/vendas" },
      { title: "Relatório de Estoque", url: "/relatorios/estoque" },
    ],
  },
];

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon?: React.ElementType }
>(({ className, title, children, icon: Icon, ...props }, ref) => {
  const pathname = usePathname();
  const isActive = props.href === pathname;

  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            isActive && "bg-accent text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center">
            {Icon && <Icon className="mr-2 h-4 w-4" />}
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

const AdminNavMenu: React.FC = () => {
  const pathname = usePathname();
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
                    {item.title === "Produtos" && (
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href={item.url}
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
                    pathname === item.url && "bg-accent text-accent-foreground"
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
