"use client";

import React from "react";
import Link from "next/link";
import AdminNavMenu from "./admin-nav-menu.tsx"; // Seu menu de desktop
import AdminMobileNav from "./admin-mobile-nav"; // SEU NOVO MENU MOBILE
import { UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

// Mock de usuário para o dropdown
const mockUser = {
  name: "Usuário Admin",
  imageUrl: "", // Adicione a URL da imagem se houver
  email: "admin@example.com",
};

// SiteHeader
export function SiteHeader() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // Ou seu método de logout
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between space-x-4 sm:space-x-0">
        {/* Ícone de Hamburger para Mobile */}
        <div className="flex md:hidden">
          {" "}
          {/* Visível apenas em mobile */}
          <AdminMobileNav />
        </div>

        {/* Logo ou Título do Admin (Visível em todas as telas) */}
        <Link href="/admin/dashboard" className="flex items-center space-x-2">
          {/* Você pode colocar sua imagem de logo aqui */}
          <span className="font-bold text-lg">Painel Admin</span>
        </Link>

        {/* Navigation Menu (Visível apenas em desktop) */}
        <div className="hidden md:flex flex-1 justify-center">
          {" "}
          {/* Esconde em mobile, mostra em desktop */}
          <AdminNavMenu />
        </div>

        {/* Espaço para ações do usuário (Dropdown, sempre visível) */}
        <div className="flex items-center space-x-4">
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
                <Link href="/admin/user/profile">Perfil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/user/settings">Configurações</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer"
              >
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
