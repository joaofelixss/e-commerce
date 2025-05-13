// frontend/components/Sidebar.tsx
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Package,
  ListChecks,
  BarChart,
  Users,
  Menu, // Importe o ícone de Menu novamente
  Settings,
  ChartPie,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebarContext } from "@/contexts/SidebarContext";

const Sidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen, toggleSidebar, closeSidebar } = useSidebarContext(); // Importamos toggleSidebar

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    router.push("/login");
  };

  const menuItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <BarChart className="h-4 w-4 mr-2" />,
    },
    {
      href: "/admin/produtos",
      label: "Produtos",
      icon: <Package className="h-4 w-4 mr-2" />,
    },
    {
      href: "/admin/pedidos",
      label: "Pedidos",
      icon: <ListChecks className="h-4 w-4 mr-2" />,
    },
    {
      href: "/admin/estoque",
      label: "Estoque",
      icon: <Package className="h-4 w-4 mr-2" />,
    },
    {
      href: "/admin/clientes",
      label: "Clientes",
      icon: <Users className="h-4 w-4 mr-2" />,
    },
    {
      href: "/admin/relatorios",
      label: "Relatórios",
      icon: <ChartPie className="h-4 w-4 mr-2" />,
    },
    {
      href: "/admin/configuracoes",
      label: "Configurações",
      icon: <Settings className="h-4 w-4 mr-2" />,
    },
  ];

  const collapsedWidth = "3rem";
  const sidebarWidth = "16rem";

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-full bg-white shadow-md z-50 transition-transform duration-300 border-r border-gray-200",
        isOpen
          ? "translate-x-0"
          : `translate-x-[calc(-100% + ${collapsedWidth})]`
      )}
      style={{ width: isOpen ? sidebarWidth : collapsedWidth }}
    >
      <div className="p-3 flex items-center justify-end md:hidden">
        <Button onClick={closeSidebar} variant="ghost" className="p-2">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      <div className="p-4 flex items-center mb-6">
        <Button onClick={toggleSidebar} variant="ghost" className="p-2">
          <Menu className="h-6 w-6 mr-4" />{" "}
          {/* Botão de menu para abrir/fechar */}
        </Button>
        {isOpen && (
          <Link href="/" className="font-bold text-lg">
            Loja Mae Admin
          </Link>
        )}
        {!isOpen && (
          <Link href="/" className="font-bold text-sm">
            LM
          </Link>
        )}
      </div>
      <nav className="mt-2 space-y-3">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block py-2 px-4 hover:bg-gray-100 transition-colors flex items-center",
              pathname === item.href &&
                "bg-blue-50 text-blue-600 font-semibold",
              !isOpen && "justify-center"
            )}
          >
            {item.icon}
            {isOpen && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-4 left-4 w-full mt-8">
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="icon"
          className={cn(
            "w-full flex items-center justify-start",
            isOpen ? "space-x-2" : "justify-center"
          )}
        >
          <LogOut className="h-4 w-4" />
          {isOpen && <span className="text-sm">Sair</span>}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
