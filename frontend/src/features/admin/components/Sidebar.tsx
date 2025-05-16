// frontend/components/Sidebar.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Package,
  ListChecks,
  BarChart,
  Users,
  Settings,
  ChartPie,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebarContext } from "@/contexts/SidebarContext";

const Sidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen, toggleSidebar } = useSidebarContext();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    router.push("/login");
  };

  const menuItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <BarChart className="h-4 w-4 mr-2" />,
      subMenu: null,
    },
    {
      href: "/gerenciar-produtos",
      label: "Produtos",
      icon: <Package className="h-4 w-4 mr-2" />,
      subMenu: null,
    },
    {
      href: "/pedidos",
      label: "Pedidos",
      icon: <ListChecks className="h-4 w-4 mr-2" />,
      subMenu: null,
    },
    {
      href: "/estoque",
      label: "Estoque",
      icon: <Package className="h-4 w-4 mr-2" />,
      subMenu: null,
    },
    {
      href: "/clientes",
      label: "Clientes",
      icon: <Users className="h-4 w-4 mr-2" />,
      subMenu: null,
    },
    {
      href: "/relatorios",
      label: "Relatórios",
      icon: <ChartPie className="h-4 w-4 mr-2" />,
      subMenu: null,
    },
    {
      href: "/user/config",
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
      <div className="p-5 flex items-center mb-3">
        {isOpen && (
          <Link href="/" className="font-bold text-lg mt-7">
            Loja Mae Admin
          </Link>
        )}
      </div>
      {!isOpen && (
        <Link href="/" className="font-bold p-2">
          LM
        </Link>
      )}
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
            </Link>
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
