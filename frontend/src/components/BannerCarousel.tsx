/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils"; // Certifique-se de ter este arquivo de utilidades do Shadcn UI

interface Banner {
  id: number;
  img: string;
  link: string;
}

const BannerCarousel = ({ banners }: { banners: Banner[] }) => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 7000); // 7 segundos

    return () => clearInterval(intervalId);
  }, [banners.length]);

  return (
    <div className="overflow-hidden relative w-full">
      {" "}
      {/* Container wrapper */}
      <div
        ref={carouselRef}
        className="flex transition-transform duration-500 ease-in-out"
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
              className="w-full h-auto md:h-96 object-contain" // Alterado para md:h-72
            />
          </Link>
        ))}
      </div>
      {/* Opcional: Indicadores de slide */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              currentBannerIndex === index ? "bg-foreground" : "bg-background"
            }`}
            onClick={() => setCurrentBannerIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
