// frontend/components/Sidebar.tsx
"use client";

import * as React from "react";
import {
  BarChartIcon,
  PackageIcon,
  ListChecksIcon,
  UsersIcon,
  SettingsIcon,
  ChartPieIcon,
  SettingsIcon as SettingsIconSecondary,
  HelpCircleIcon,
  SearchIcon,
  type LucideIcon,
  TagIcon,
  ShoppingCartIcon,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavMain } from "./nav-main";
import { NavDocuments } from "./nav-documents";
import { NavSecondary } from "./nav-secondary";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarProps extends React.ComponentProps<typeof Sidebar> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  submenu?: {
    title: string;
    url: string;
  }[];
}

interface NavDocumentItem {
  name: string;
  url: string;
  icon: LucideIcon;
  submenu?: {
    title: string;
    url: string;
  }[];
}

interface NavSecondaryItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

const mockUser = {
  name: "Usuário Admin",
  imageUrl: "",
  email: "admin@example.com",
};

const menuItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: BarChartIcon,
  },
  {
    title: "Produtos",
    url: "/gerenciar-produtos",
    icon: PackageIcon,
    submenu: [
      { title: "Todos os Produtos", url: "/gerenciar-produtos" },
      { title: "Adicionar Produto", url: "/gerenciar-produtos/adicionar" },
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
  },
  {
    title: "Categorias",
    url: "/categorias",
    icon: TagIcon,
  },
  {
    title: "Configurações",
    url: "/user/config",
    icon: SettingsIcon,
  },
];

const documentsData: NavDocumentItem[] = [
  {
    name: "Relatórios",
    url: "/relatorios",
    icon: ChartPieIcon,
    submenu: [
      { title: "Visão Geral", url: "/relatorios" },
      { title: "Relatório de Vendas", url: "/relatorios/vendas" },
      { title: "Relatório de Estoque", url: "/relatorios/estoque" },
    ],
  },
];

const secondaryItems: NavSecondaryItem[] = [
  { title: "Settings", url: "#", icon: SettingsIconSecondary },
  { title: "Get Help", url: "#", icon: HelpCircleIcon },
  { title: "Search", url: "#", icon: SearchIcon },
];

const SidebarComponent: React.FC<SidebarProps> = ({ open, onOpenChange }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const isMobile = () => window.innerWidth < 768;

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    router.push("/login");
  };

  return (
    <Sidebar
      open={open}
      onOpenChange={onOpenChange}
      collapsible={!isMobile()}
      collapsed={!isMobile() && isCollapsed}
      className="bg-secondary/95 backdrop-blur-sm shadow-md border-r border-border"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/" className="flex items-center font-bold text-lg">
              {!isMobile() && isCollapsed ? "LM" : "Loja Mae Admin"}
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-full">
          <NavMain items={menuItems} />
          <NavDocuments items={documentsData} />{" "}
          {/* Use o componente NavDocuments */}
          <NavSecondary items={secondaryItems} className="mt-auto" />
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer bg-white">
              {mockUser.imageUrl ? (
                <AvatarImage src={mockUser.imageUrl} alt={mockUser.name} />
              ) : (
                <AvatarFallback>
                  <UserRound className="h-5 w-5" />
                </AvatarFallback>
              )}
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-4 py-2">
              <div className="font-medium">{mockUser.name}</div>
              <div className="text-muted-foreground text-sm">
                {mockUser.email}
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/user/profile">Perfil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/user/settings">Configurações</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarComponent;
