/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Assumindo que você tem o componente Button da Shadcn
import { ChevronLeft, ChevronRight } from "lucide-react"; // Ícones para as setas

interface Banner {
  id: number;
  img: string;
  link: string;
}

const BannerCarousel = ({ banners }: { banners: Banner[] }) => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const goToNextBanner = useCallback(() => {
    setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
  }, [banners.length]);

  const goToPrevBanner = useCallback(() => {
    setCurrentBannerIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  }, [banners.length]);

  useEffect(() => {
    const intervalId = setInterval(goToNextBanner, 7000); // 7 segundos

    return () => clearInterval(intervalId);
  }, [goToNextBanner]);

  // Função para lidar com o scroll do carrossel (opcional, para navegação por arrasto)
  // No entanto, para um carrossel simples com transição de slide, as setas e indicadores são suficientes.
  // Se quiser implementar arrasto, a lógica seria mais complexa e envolveria eventos touch/mouse.

  return (
    <div className="relative w-full overflow-hidden rounded-lg shadow-md pt-10 pb-10">
      {/* Container wrapper */}
      <div
        ref={carouselRef}
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentBannerIndex * 100}%)` }}
      >
        {banners.map((banner) => (
          <Link
            key={banner.id}
            href={banner.link}
            className="w-full flex-shrink-0 flex justify-center"
          >
            <img
              src={banner.img}
              alt={`Banner ${banner.id}`}
              // Ajuste a altura para ser mais flexível e responsiva
              className="h-84 lg:h-124 rounded-lg"
              // Adicione classes para garantir que a imagem ocupe o espaço e seja cortada se necessário
            />
          </Link>
        ))}
      </div>

      {/* Navegação por setas */}
      {banners.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/50 hover:bg-white/70 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            onClick={goToPrevBanner}
            aria-label="Previous banner"
          >
            <ChevronLeft className="h-6 w-6 text-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/50 hover:bg-white/70 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            onClick={goToNextBanner}
            aria-label="Next banner"
          >
            <ChevronRight className="h-6 w-6 text-foreground" />
          </Button>
        </>
      )}

      {/* Indicadores de slide aprimorados */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-all duration-300
                ${
                  currentBannerIndex === index
                    ? "w-6 bg-primary"
                    : "bg-white/70 hover:bg-white"
                }`}
              onClick={() => setCurrentBannerIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerCarousel;
