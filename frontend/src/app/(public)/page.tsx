// src/app/(publi)/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import BannerCarousel from "@/components/Home/BannerCarousel";
import InfoCarousel from "@/components/Home/InfoCarousel";
import LinkSquares from "@/components/Home/LinkSquares";
import { Toaster } from "sonner";
import ProductCard from "@/features/produtos/components/ProductCard";
import { Truck } from "lucide-react";
import { getProductImageUrl } from "@/lib/utils";
import { getAllProducts } from "@/api/products";
import { motion } from "framer-motion";
import { Banner } from "@/types/banner";
import { Product } from "@/features/produtos/types/product";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const HomePage = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [destaques, setDestaques] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestaques = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllProducts();
        if (data && data.data) {
          const produtosComUrlCompleta = data.data.map((produto: Product) => ({
            ...produto,
            imagemUrl: getProductImageUrl(produto.imagemUrl),
          }));
          setDestaques(produtosComUrlCompleta);
        } else {
          setError("Erro: Dados de produtos inválidos.");
        }
      } catch (err: unknown) {
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
    { id: 1, img: "/images/banner-1.png", link: "/produtos" },
    { id: 2, img: "/images/banner-2.png", link: "/produtos" },
    { id: 3, img: "/images/rosa.jpeg", link: "/produtos/4" },
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
        staggerChildren: 0.1,
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
        <InfoCarousel items={infoItems} />
      </motion.div>
      <motion.div variants={itemVariants}>
        <LinkSquares />
      </motion.div>

      {/* Seção Nossos Destaques */}
      <section className="p-9 mt-12 bg-foreground">
        <motion.h2
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="text-5xl font-bold p-8 text-center text-background"
        >
          Nossos Destaques
        </motion.h2>

        {destaques.length > 0 ? (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            // Adicionamos a propriedade 'spacing' para controlar o espaço entre os itens
            // 'md:spacing-8' significa que em telas médias (md) e maiores, o espaçamento será de 2rem (32px)
            // Você pode ajustar 'spacing-4' para o espaçamento padrão em telas menores
            className="w-full max-w-sm mx-auto md:max-w-4xl lg:max-w-6xl"
          >
            <CarouselContent className="-ml-4 md:-ml-8">
              {" "}
              {/* Ajuste o ml para compensar o padding/spacing dos itens */}
              {destaques.map((produto) => (
                <CarouselItem
                  key={produto.id}
                  // Definimos 'basis-full' para telas pequenas (1 item por vez)
                  // 'sm:basis-1/2' para 2 itens em telas pequenas
                  // 'md:basis-1/3' para 3 itens em telas médias e maiores
                  className="pl-4 md:pl-8 basis-full sm:basis-1/2 md:basis-1/3"
                >
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02] flex flex-col items-center"
                  >
                    <ProductCard product={produto} />
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <motion.p
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className=" text-center py-4 text-background"
          >
            Nenhum destaque no momento.
          </motion.p>
        )}
      </section>
      <motion.div variants={itemVariants}>
        <BannerCarousel banners={banners} />
      </motion.div>
      <motion.div variants={itemVariants}>
        <Toaster />
      </motion.div>
    </motion.div>
  );
};

export default HomePage;
