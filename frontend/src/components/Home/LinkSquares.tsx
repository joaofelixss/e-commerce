"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";

const LinkSquares = () => {
  const isDesktop = useMediaQuery({ minWidth: 768 });

  return (
    <section>
      {/* 4 Quadrados Contêineres com Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <Link
          href="/produtos/1"
          className="transition-transform duration-300 hover:scale-105"
        >
          <Image
            src="/images/barbantes.png"
            alt="Barbantes"
            width={isDesktop ? 300 : 150} // Ajusta a largura para desktop
            height={isDesktop ? 300 : 150} // Ajusta a altura para desktop
            className="mx-auto rounded-md shadow-lg"
          />
        </Link>
        <Link
          href="/produtos/3"
          className="transition-transform duration-300 hover:scale-105"
        >
          <Image
            src="/images/croches.png"
            alt="Crochês"
            width={isDesktop ? 300 : 150}
            height={isDesktop ? 300 : 150}
            className="mx-auto rounded-md shadow-lg"
          />
        </Link>
        <Link
          href="/produtos/2"
          className="transition-transform duration-300 hover:scale-105"
        >
          <Image
            src="/images/barrocos.png"
            alt="Tapetes"
            width={isDesktop ? 300 : 150}
            height={isDesktop ? 300 : 150}
            className="mx-auto rounded-md shadow-lg"
          />
        </Link>
        <Link
          href="/produtos/4"
          className="transition-transform duration-300 hover:scale-105"
        >
          <Image
            src="/images/roupas.png"
            alt="Novidades"
            width={isDesktop ? 300 : 150}
            height={isDesktop ? 300 : 150}
            className="mx-auto rounded-md shadow-lg"
          />
        </Link>
      </div>
    </section>
  );
};

export default LinkSquares;
