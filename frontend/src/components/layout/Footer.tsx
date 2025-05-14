"use client";

import React, { useState } from "react";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaInstagram,
} from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Importe os estilos do react-toastify

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubscribe = async () => {
    if (!email.trim()) {
      toast.error("Por favor, insira seu e-mail.");
      return;
    }

    setIsSubscribing(true);

    // Simulação de envio do e-mail (substitua pela sua lógica real)
    try {
      console.log("Enviando e-mail para assinar:", email);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula uma chamada de API

      toast.success(`Obrigado por se inscrever com o e-mail: ${email}`);
      setEmail("");
    } catch (error: any) {
      toast.error(error.message || "Ocorreu um erro ao tentar assinar.");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-gray-100 py-12 text-gray-600 pb-5">
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {/* Seção de Contato */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contato</h3>
          <ul className="list-none p-0">
            <li className="flex items-center mb-2">
              <FaMapMarkerAlt className="mr-2 text-gray-400" />
              <address className="not-italic">
                Avenida Tubírio Odilon Ribeiro, 841 - Alvorada, <br />
                Pimenta Bueno - RO, 76970-000
              </address>
            </li>
            <li className="flex items-center mb-2">
              <FaEnvelope className="mr-2 text-gray-400" />
              <a
                href="mailto:ssfelixjoao651@gmail.com"
                className="hover:text-blue-500"
              >
                ssfelixjoao651@gmail.com
              </a>
            </li>
            <li className="flex items-center mb-2">
              <FaPhone className="mr-2 text-gray-400" />
              <a href="tel:+5569999086693" className="hover:text-blue-500">
                +55 (69) 99908-6693
              </a>
            </li>
            <li className="flex items-center mb-2">
              <FaInstagram className="mr-2 text-gray-400" />
              <a
                href="https://www.instagram.com/soniaaviamentoss"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-500"
              >
                @soniaaviamentoss
              </a>
            </li>
          </ul>
        </div>

        {/* Seção de Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Receba Novidades</h3>
          <p className="mb-2 text-sm">
            Assine nossa newsletter e fique por dentro de todas as novidades e
            promoções!
          </p>
          <div className="flex rounded-md shadow-sm">
            <Input
              type="email"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Seu e-mail"
              value={email}
              onChange={handleInputChange}
            />
            <Button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-foreground hover:bg-foreground/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground"
              onClick={handleSubscribe}
              disabled={isSubscribing}
            >
              {isSubscribing ? "Assinando..." : "Assinar"}
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Sonia Aviamentos. Todos os direitos
        reservados.
      </div>
    </footer>
  );
};

export default Footer;
