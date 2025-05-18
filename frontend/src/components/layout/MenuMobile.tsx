// src/components/MenuMobile.tsx

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  User,
  Home,
  ShoppingBasket,
  X,
} from "lucide-react";
import { useCartStore } from "@/features/produtos/store/cartStore";
import { FaWhatsapp } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const MenuMobile = () => {
  const totalItemsInCart = useCartStore((state) => state.totalItems());
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setSearchTerm("");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/busca?q=${encodeURIComponent(searchTerm.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <section>
      {/* Mecanismo de Busca Móvel (Animado) - Posicionado acima do menu */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ y: -70, opacity: 0 }} // Ajustei o valor inicial de y para cima
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -70, opacity: 0 }} // Ajustei o valor de saída de y para cima
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 w-full bg-white shadow-md py-4 px-4 z-40 flex items-center" // Aumentei o z-index para sobrepor o menu (z-20)
          >
            <form
              onSubmit={handleSearchSubmit}
              className="flex-grow flex items-center"
            >
              <Input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full rounded-l-md focus:outline-none"
              />
              <Button
                type="submit"
                className="rounded-r-md bg-foreground text-white"
              >
                <Search className="w-5 h-5" />
              </Button>
            </form>
            <Button onClick={toggleSearch} variant="ghost" className="ml-2">
              <X className="w-5 h-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Link para o Instagram */}
      <div className="bg-sidebar-foreground py-2 text-center">
        <Link
          href="https://www.instagram.com/soniaaviamentoss"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sidebar hover:text-white"
        >
          Siga-nos no Instagram: @soniaaviamentoss
        </Link>
      </div>

      {/* Menu Inferior Fixo para Mobile */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-2 md:hidden flex justify-around items-center z-20">
        <Link
          href="/"
          className="flex flex-col items-center text-gray-600 hover:text-foreground"
        >
          <Home className="w-6 h-6" />
          <span className="text-xs">Menu</span>
        </Link>
        <Link
          href="/produtos"
          className="flex flex-col items-center text-gray-600 hover:text-foreground"
        >
          <ShoppingBasket className="w-6 h-6" />
          <span className="text-xs">Produtos</span>
        </Link>
        <button
          onClick={toggleSearch}
          className="flex flex-col items-center text-gray-600 hover:text-foreground focus:outline-none"
        >
          <Search className="w-6 h-6" />
          <span className="text-xs">Buscar</span>
        </button>
        <Link
          href="/carrinho"
          className="flex flex-col items-center text-gray-600 hover:text-foreground relative"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="text-xs">Carrinho</span>
          {isHydrated && totalItemsInCart > 0 && (
            <span className="absolute top-[-0.5rem] right-[-0.5rem] bg-foreground text-white text-[0.7rem] rounded-full px-1">
              {totalItemsInCart}
            </span>
          )}
        </Link>
        <Link
          href="/login"
          className="flex flex-col items-center text-gray-600 hover:text-foreground"
        >
          <User className="w-6 h-6" />
          <span className="text-xs">Conta</span>
        </Link>
      </div>

      {/* Ícone Flutuante do WhatsApp */}
      <a
        href="https://wa.me/5569992784621"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-6 bg-green-500 hover:bg-green-700 text-white rounded-full shadow-lg p-3 z-30"
      >
        <FaWhatsapp className="w-6 h-6" />
      </a>
    </section>
  );
};

export default MenuMobile;
