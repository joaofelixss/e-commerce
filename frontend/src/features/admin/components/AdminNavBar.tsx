"use client";

import React, { useState, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockProfileName = "Sonia Admin";

const AdminNavbar = () => {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const [profileName] = useState<string | null>(mockProfileName); // Usando dado mockado
  const [profileImage] = useState<string | null>(
    localStorage.getItem("adminProfileImage") || null
  );
  const router = useRouter();
  const pathname = usePathname();
  const submenuRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(submenuRef, () => setIsSubmenuOpen(false));

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    router.push("/login"); // Redirecione para a página de login
  };

  const handleProfileClick = () => {
    router.push("/user/config"); // Redirecione para a página de configurações
    setIsSubmenuOpen(false);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Pesquisando por:", event.target.value);
    // Implemente sua lógica de pesquisa aqui
  };

  return (
    <div className="bg-background dark:bg-secondary-foreground border-b dark:border-border h-16 flex items-center justify-end px-4 sm:px-6 lg:px-8">
      {/* Campo de Pesquisa (Perto da Foto do Perfil) */}
      <div className="flex items-center mr-4 w-full max-w-md">
        <Input
          type="text"
          placeholder="Pesquisar..."
          className="rounded-md shadow-sm focus-visible:ring focus-visible:ring-primary/50 focus:outline-none dark:bg-secondary-foreground dark:text-primary-foreground"
          onChange={handleSearch}
        />
        <Search className="ml-2 h-5 w-5 text-muted-foreground dark:text-muted" />
      </div>

      {/* Foto de Perfil com Dropdown Menu */}
      <DropdownMenu open={isSubmenuOpen} onOpenChange={setIsSubmenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="rounded-full h-10 w-10 p-0 overflow-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={profileImage || undefined}
                alt={profileName || "Perfil"}
              />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          ref={submenuRef}
          className="w-48 mt-2 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-slide-down-fade"
          align="end"
        >
          {profileName && (
            <div className="px-4 py-2 text-sm font-semibold">
              Olá, {profileName}
            </div>
          )}
          <DropdownMenuItem onClick={handleProfileClick}>
            Perfil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AdminNavbar;
