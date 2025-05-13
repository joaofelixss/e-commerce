// frontend/features/dashboard/components/DashboardNavigationLinks.tsx
import React from "react";
import Link from "next/link";
import {
  PackageIcon,
  ListChecks,
  UsersIcon,
  BarChartIcon,
  SendIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card"; // Reutilizando o Card

interface NavigationLinkProps {
  href: string;
  title: string;
  icon: React.ReactNode;
}

const NavigationLinkCard: React.FC<NavigationLinkProps> = ({
  href,
  title,
  icon,
}) => (
  <Link
    href={href}
    className="block hover:bg-gray-100 rounded-md transition-colors"
  >
    <Card className="shadow-sm">
      <CardContent className="flex items-center space-x-4 p-4">
        <div className="rounded-md p-2 bg-blue-100 text-blue-500">{icon}</div>
        <h3 className="font-semibold text-lg">{title}</h3>
      </CardContent>
    </Card>
  </Link>
);

const DashboardNavigationLinks = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      <NavigationLinkCard
        href="/admin/produtos"
        title="Gerenciar Produtos"
        icon={<PackageIcon className="w-6 h-6" />}
      />
      <NavigationLinkCard
        href="/admin/pedidos"
        title="Gerenciar Pedidos"
        icon={<ListChecks className="w-6 h-6" />}
      />
      <NavigationLinkCard
        href="/admin/estoque"
        title="Gerenciar Estoque"
        icon={<BarChartIcon className="w-6 h-6" />}
      />
      <NavigationLinkCard
        href="/admin/clientes"
        title="Gerenciar Clientes"
        icon={<UsersIcon className="w-6 h-6" />}
      />
      <NavigationLinkCard
        href="/admin/estoque/disponivel"
        title="Enviar Estoque"
        icon={<SendIcon className="w-6 h-6" />}
      />
      {/* Adicione mais links conforme necessário */}
    </div>
  );
};

export default DashboardNavigationLinks;
