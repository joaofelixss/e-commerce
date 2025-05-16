// src/components/site-header.tsx
"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Search, UserRound } from "lucide-react"; // Importe UserRound
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

interface SiteHeaderProps {
  onOpenSidebar: () => void;
  isSidebarOpen: boolean;
}

const mockUser = {
  name: "Usuário Admin",
  imageUrl: "", // Deixamos a imageUrl vazia para mostrar o fallback
  email: "admin@example.com",
};

export function SiteHeader({ onOpenSidebar, isSidebarOpen }: SiteHeaderProps) {
  const pathname = usePathname();
  const pathSegments = pathname?.split("/").filter(Boolean) || [];

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear px-4 lg:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" onClick={onOpenSidebar} />
        <Separator orientation="vertical" className="h-6 md:h-4" />
        <Breadcrumb>
          <BreadcrumbItem>
            <Link href="/dashboard">Dashboard</Link>
          </BreadcrumbItem>
          {pathSegments.map((segment, index) => (
            <BreadcrumbItem key={segment}>
              <Link href={`/${pathSegments.slice(0, index + 1).join("/")}`}>
                {segment.charAt(0).toUpperCase() + segment.slice(1)}
              </Link>
            </BreadcrumbItem>
          ))}
        </Breadcrumb>
      </div>
      <div className="flex items-center ml-auto gap-4">
        <div className="relative">
          <Input type="text" placeholder="Pesquisar..." className="pr-10" />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
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
              <Link href="/user/config">Perfil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/user/config">Configurações</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/logout">Sair</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
