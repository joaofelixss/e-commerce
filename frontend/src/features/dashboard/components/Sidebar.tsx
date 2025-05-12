// frontend/components/Sidebar.tsx
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Menu,
  Package,
  ListChecks,
  BarChart,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

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
    }, // Reutilizei o Package, ajuste se tiver um ícone melhor
    {
      href: "/admin/clientes",
      label: "Clientes",
      icon: <Users className="h-4 w-4 mr-2" />,
    },
  ];

  // Defina a largura da parte visível quando a sidebar estiver fechada
  const collapsedWidth = "3rem";

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-full bg-white shadow-md z-50 transition-transform duration-300",
        isOpen
          ? "translate-x-0"
          : `translate-x-[calc(-100% + ${collapsedWidth})]`
      )}
      style={{ width: isOpen ? "16rem" : collapsedWidth }} // Define a largura dinamicamente
    >
      <div className="p-4 flex items-center justify-end">
        <Button onClick={onClose} variant="ghost">
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      {isOpen && ( // Renderiza os links e o botão de logout apenas se isOpen for true
        <>
          <nav className="mt-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 px-4 hover:bg-gray-100 transition-colors flex items-center"
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="absolute bottom-4 left-4 w-full">
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="w-full flex items-center space-x-2 justify-center"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </Button>
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
