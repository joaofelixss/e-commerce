"use client";

import React, { useState, useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import Navbar from "@/components/Navbar";
import BannerCarousel from "@/components/BannerCarousel";
import InfoCarousel from "@/components/InfoCarousel";
import MenuMobile from "@/components/MenuMobile";
import LinkSquares from "@/components/LinkSquares";
import { ToastContainer } from "react-toastify";
import ProductCard from "@/components/ProductCard";
import { Truck } from "lucide-react";
import { getProductImageUrl } from "@/lib/utils";
import { getFeaturedProducts } from "@/api/products";
import Footer from "./footer/page";
import { motion } from "framer-motion"; // Import framer-motion

interface Product {
  id: string;
  nome: string;
  preco: number;
  imagemUrl: string;
}

interface Banner {
  id: number;
  img: string;
  link: string;
}

const HomePage = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [destaques, setDestaques] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDestaques = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getFeaturedProducts();
        if (data && data.data) {
          const produtosComUrlCompleta = data.data.map((produto: Product) => ({
            ...produto,
            imagemUrl: getProductImageUrl(produto.imagemUrl),
          }));
          setDestaques(produtosComUrlCompleta);
        } else {
          setError("Erro: Dados de produtos inválidos.");
        }
      } catch (err: any) {
        setError("Erro ao carregar os destaques.");
        console.error("Erro ao buscar destaques:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestaques();
  }, []);

  if (loading) {
    return <div>Carregando destaques...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const banners: Banner[] = [
    { id: 1, img: "/images/banner-1.png", link: "/ptodutos" },
    { id: 2, img: "/images/banner-2.png", link: "/produtos" },
    { id: 3, img: "/images/banner-3.png", link: "/roupas" },
  ];
  const infoItems = [
    {
      id: 1,
      text: (
        <>
          <strong>Entrega rápida</strong> <br /> Entregamos para toda região
        </>
      ),
    },
    {
      id: 2,
      icon: <Truck />,
      text: (
        <>
          <strong>Atendimento</strong> <br /> Fale conosco e tire suas dúvidas
        </>
      ),
    },
    {
      id: 3,
      text: (
        <>
          <strong>Pague com cartão</strong> <br /> Compre parcelado com cartão
          de crédito
        </>
      ),
    },
    {
      id: 4,
      text: (
        <>
          <strong>Segurança </strong>
          <br /> Compre online e com total segurança
        </>
      ),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Anima os filhos com um pequeno atraso
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="mx-auto w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <MenuMobile />
      </motion.div>
      <motion.div variants={itemVariants}>
        <Navbar />
      </motion.div>
      <motion.div variants={itemVariants}>
        <BannerCarousel banners={banners} />
      </motion.div>
      <motion.div variants={itemVariants}>
        <InfoCarousel items={infoItems} />
      </motion.div>
      <motion.div variants={itemVariants}>
        <LinkSquares />
      </motion.div>
      {/* Seção Nossos Destaques */}
      <section className="p-9 mt-12 bg-foreground">
        <motion.h2
          variants={itemVariants}
          className="text-5xl font-bold p-8 text-center text-background"
        >
          Nossos Destaques
        </motion.h2>
        {isMobile ? (
          <motion.div
            ref={carouselRef}
            className="overflow-x-auto overflow-x-hidden whitespace-nowrap scroll-smooth snap-x snap-mandatory -ml-4 pl-4"
            variants={containerVariants}
          >
            {destaques.length > 0 ? (
              destaques.map((produto) => (
                <motion.div
                  key={produto.id}
                  className="inline-block w-64 mr-4 snap-start"
                  variants={itemVariants}
                >
                  <ProductCard product={produto} />
                </motion.div>
              ))
            ) : (
              <motion.p
                variants={itemVariants}
                className="text-gray-500 text-center py-4"
              >
                Nenhum destaque no momento.
              </motion.p>
            )}
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            variants={containerVariants}
          >
            {destaques.length > 0 ? (
              destaques.map((produto) => (
                <motion.div
                  key={produto.id}
                  className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02] flex flex-col items-center"
                  variants={itemVariants}
                >
                  <ProductCard product={produto} />
                </motion.div>
              ))
            ) : (
              <motion.p
                variants={itemVariants}
                className="text-gray-500 text-center py-4 col-span-full"
              >
                Nenhum destaque no momento.
              </motion.p>
            )}
          </motion.div>
        )}
      </section>
      <motion.div variants={itemVariants}>
        <ToastContainer />
      </motion.div>
      <motion.div variants={itemVariants}>
        <Footer />
      </motion.div>
    </motion.div>
  );
};

export default HomePage;
