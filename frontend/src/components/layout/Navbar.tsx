// frontend/src/components/Navbar.tsx

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, ShoppingCart, Heart, Search, User } from "lucide-react";
import { useCartStore } from "@/features/produtos/store/cartStore";
import { useFavoritesStore } from "@/features/produtos/store/favoritesStore";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const totalItemsInCart = useCartStore((state) => state.totalItems());
  const totalFavorites = useFavoritesStore((state) => state.items.length);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/busca?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm(""); // Limpa o campo de busca após a pesquisa
      setIsMenuOpen(false); // Fecha o menu mobile se estiver aberto
    }
  };

  return (
    <nav className="color-background sticky z-10 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between md:justify-around">
        {/* Menu Hamburguer (Mobile) */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Logo Centralizada */}
        <Link href="/">
          <Image
            className="w-full h-auto object-contain max-h-[50px]"
            src="/images/logo.png"
            alt="Aviamentos"
            width={150}
            height={50}
            priority
          />
        </Link>

        {/* Mecanismo de Busca (Desktop) */}
        <div className="hidden md:flex items-center ml-4">
          <form onSubmit={handleSearchSubmit} className="flex items-center">
            <Input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="rounded-l-md focus:outline-none text-sm"
            />
            <Button
              type="submit"
              className="rounded-r-md bg-foreground text-white text-sm"
            >
              <Search className="w-4 h-4" />
            </Button>
          </form>
        </div>

        {/* Ícones (Mobile) */}
        <div className="flex items-center space-x-4 md:hidden">
          <Link href="/favoritos" className="relative">
            <Heart className="w-6 h-6" />
            {isHydrated && totalFavorites > 0 && (
              <span className="absolute top-[-0.5rem] right-[-0.5rem] bg-foreground text-white text-[0.7rem] rounded-full px-1">
                {totalFavorites}
              </span>
            )}
          </Link>
          <Link href="/carrinho" className="relative">
            <ShoppingCart className="w-6 h-6" />
            {isHydrated && totalItemsInCart > 0 && (
              <span className="absolute top-[-0.5rem] right-[-0.5rem] bg-foreground text-white text-[0.7rem] rounded-full px-1">
                {totalItemsInCart}
              </span>
            )}
          </Link>
        </div>

        {/* Links da Navbar (Desktop) */}
        <ul
          className={`hidden md:flex space-x-4 ${
            isMenuOpen
              ? "flex flex-col absolute top-full left-0 w-full bg-white shadow-md py-4"
              : ""
          }`}
        >
          <li>
            <Button asChild variant="ghost" className="">
              <Link href="/">Página Inicial</Link>
            </Button>
          </li>
          <li>
            <Button asChild variant="ghost" className="">
              <Link href="/produtos">Produtos</Link>
            </Button>
          </li>
          <li className="relative flex items-center">
            <Button asChild variant="ghost" className="">
              <Link href="/favoritos" className="flex items-center">
                <Heart className="w-6 h-6 mr-2" />
                Favoritos
                {isHydrated && totalFavorites > 0 && (
                  <span className="absolute top-[-0.5rem] right-[-0.5rem] bg-foreground text-white text-[0.7rem] rounded-full px-1">
                    {totalFavorites}
                  </span>
                )}
              </Link>
            </Button>
          </li>
          <li className="relative flex items-center">
            <Button asChild variant="ghost" className="">
              <Link href="/carrinho" className="flex items-center">
                <ShoppingCart className="w-6 h-6 mr-2" />
                Carrinho
                {isHydrated && totalItemsInCart > 0 && (
                  <span className="absolute top-[-0.5rem] right-[-0.5rem] bg-foreground text-white text-[0.7rem] rounded-full px-1">
                    {totalItemsInCart}
                  </span>
                )}
              </Link>
            </Button>
          </li>
          <li>
            <Button asChild variant="ghost" className="">
              <Link href="/login">
                <User className="w-5 h-5 mr-2" />
                Login
              </Link>
            </Button>
          </li>
          {/* Você pode adicionar mais links aqui */}
        </ul>
      </div>

      {/* Menu Dropdown (Mobile) */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-md py-4 flex flex-col items-center space-y-2">
          <form onSubmit={handleSearchSubmit} className="w-full px-4">
            <div className="flex items-center">
              <Input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="rounded-l-md focus:outline-none text-sm w-full"
              />
              <Button
                type="submit"
                className="rounded-r-md bg-foreground text-white text-sm"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </form>
          <Button asChild variant="ghost" className="hover:text-foreground">
            <Link href="/">Página Inicial</Link>
          </Button>
          <Button asChild variant="ghost" className="hover:text-foreground">
            <Link href="/produtos">Produtos</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="hover:text-foreground relative"
          >
            <Link href="/favoritos" className="flex items-center">
              <Heart className="w-6 h-6 mr-2 inline-block" />
              Favoritos
              {isHydrated && totalFavorites > 0 && (
                <span className="absolute top-[-0.5rem] right-[-0.5rem] bg-foreground text-white text-[0.7rem] rounded-full px-1">
                  {totalFavorites}
                </span>
              )}
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="hover:text-foreground relative"
          >
            <Link href="/carrinho" className="flex items-center">
              <ShoppingCart className="w-6 h-6 mr-2 inline-block" />
              Carrinho
              {isHydrated && totalItemsInCart > 0 && (
                <span className="absolute top-[-0.5rem] right-[-0.5rem] bg-foreground text-white text-[0.7rem] rounded-full px-1">
                  {totalItemsInCart}
                </span>
              )}
            </Link>
          </Button>
          {/* Você pode adicionar mais links aqui */}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
