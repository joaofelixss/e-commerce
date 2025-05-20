"use client";

import React from "react";
import Link from "next/link";
import AdminNavMenu from "./admin-nav-menu.tsx";
import AdminMobileNav from "./admin-mobile-nav";
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

const mockUser = {
  name: "Usuário Admin",
  imageUrl: "",
  email: "admin@example.com",
};

export function SiteHeader() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    router.push("/login");
  };

  return (
    <header className="flex justify-center items-center sticky top-0 w-full border-b">
      <div className="container flex h-16 items-center justify-between space-x-4 sm:space-x-0">
        <div className="flex md:hidden items-center">
          <AdminMobileNav />
        </div>

        <Link href="/dashboard" className="flex items-center space-x-2">
          <span className="font-bold text-lg">Painel Admin</span>
        </Link>

        <div className="hidden md:flex flex-1 justify-center">
          <AdminNavMenu />
        </div>

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
                <Link href="/user/profile">Perfil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/user/settings">Configurações</Link>
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
