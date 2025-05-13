// frontend/components/Sidebar.tsx
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Package,
  ListChecks,
  BarChart,
  Users,
  Menu,
  Settings,
  ChartPie,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebarContext } from "@/contexts/SidebarContext";

const Sidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen, toggleSidebar, closeSidebar } = useSidebarContext();
  const [isProductsSubMenuOpen, setIsProductsSubMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    router.push("/login");
  };

  const toggleProductsSubMenu = () => {
    setIsProductsSubMenuOpen(!isProductsSubMenuOpen);
  };

  const menuItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <BarChart className="h-4 w-4 mr-2" />,
      subMenu: null,
    },
    {
      href: "/admin/produtos",
      label: "Produtos",
      icon: <Package className="h-4 w-4 mr-2" />,
      subMenu: null, // Removi o subMenu de "Variáveis" daqui
    },
    {
      href: "/admin/pedidos",
      label: "Pedidos",
      icon: <ListChecks className="h-4 w-4 mr-2" />,
      subMenu: null,
    },
    {
      href: "/admin/estoque",
      label: "Estoque",
      icon: <Package className="h-4 w-4 mr-2" />,
      subMenu: null,
    },
    {
      href: "/admin/clientes",
      label: "Clientes",
      icon: <Users className="h-4 w-4 mr-2" />,
      subMenu: null,
    },
    {
      href: "/admin/relatorios",
      label: "Relatórios",
      icon: <ChartPie className="h-4 w-4 mr-2" />,
      subMenu: null,
    },
    {
      href: "/admin/user/config",
      label: "Configurações",
      icon: <Settings className="h-4 w-4 mr-2" />,
      subMenu: null,
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
      <nav className="mt-2 space-y-1">
        {menuItems.map((item) => (
          <div key={item.href}>
            <Link
              href={item.href}
              className={cn(
                "w-full py-2 px-4 hover:bg-gray-100 transition-colors flex items-center",
                pathname.startsWith(item.href) &&
                  "bg-blue-50 text-blue-600 font-semibold",
                !isOpen && "justify-center"
              )}
              onClick={() => (isOpen ? null : toggleSidebar())}
            >
              <div className="flex items-center">
                {item.icon}
                {isOpen && <span>{item.label}</span>}
              </div>
              {item.subMenu &&
                isOpen &&
                (isProductsSubMenuOpen ? (
                  <ChevronUp className="h-4 w-4 ml-auto" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-auto" />
                ))}
            </Link>
            {isOpen &&
              item.subMenu &&
              pathname.startsWith("/admin/produtos") && (
                <div className="ml-4 space-y-1">
                  {/* O sub-menu de produtos não é mais fixo, podemos removê-lo ou adaptar se necessário */}
                  {/* item.subMenu.map((subItem) => (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className={cn(
                      "block py-2 px-6 hover:bg-gray-100 transition-colors",
                      pathname === subItem.href &&
                        "bg-blue-50 text-blue-600 font-semibold"
                    )}
                  >
                    {subItem.label}
                  </Link>
                )) */}
                </div>
              )}
          </div>
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
