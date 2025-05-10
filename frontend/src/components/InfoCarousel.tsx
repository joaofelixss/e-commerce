"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Truck, Phone, CreditCard, ShieldCheck } from "lucide-react";
import { useMediaQuery } from "react-responsive";

interface InfoItem {
  id: number;
  icon?: React.ReactNode;
  text: string;
}

const InfoCarousel = ({ items }: { items: InfoItem[] }) => {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isMobile) {
      intervalId = setInterval(() => {
        setCurrentItemIndex((prevIndex) => (prevIndex + 1) % items.length);
      }, 8000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isMobile, items.length]);

  const getIcon = (id: number) => {
    switch (id) {
      case 1:
        return <Truck className="w-6 h-6 mr-2 text-foreground" />;
      case 2:
        return <Phone className="w-6 h-6 mr-2 text-foreground" />;
      case 3:
        return <CreditCard className="w-6 h-6 mr-2 text-foreground" />;
      case 4:
        return <ShieldCheck className="w-6 h-6 mr-2 text-foreground" />;
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full bg-gray-50 py-4 overflow-hidden">
      <div
        className={`
          transition-transform gap-1 duration-500 ease-in-out
          flex ${
            isMobile ? `w-[${items.length * 100}%]` : "justify-center gap-3"
          }
        `}
        style={{
          transform: isMobile
            ? `translateX(-${currentItemIndex * 100}%)`
            : "none",
        }}
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`
              text-center text-foreground flex items-center justify-center gap-3
              ${
                isMobile ? "w-full flex-shrink-0 pr-4" : ""
              } // Adicionando margem direita
            `}
            style={{
              marginRight: isMobile && index < items.length - 1 ? "16px" : "0", // Espaçamento condicional
            }}
          >
            {getIcon(item.id)}
            <p className="text-left">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoCarousel;
