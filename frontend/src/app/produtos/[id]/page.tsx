// frontend/src/app/produtos/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { getProductById } from "@/api/products";
import Navbar from "@/components/Navbar";
import MenuMobile from "@/components/MenuMobile";
import { Heart, ShoppingCart } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa"; // Importe o ícone do WhatsApp de react-icons
import ProductCard from "@/components/ProductCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ProductDetails {
  id: string;
  nome: string;
  preco: number;
  imagemUrl: string;
  descricao?: string;
}

interface RelatedProduct {
  id: string;
  nome: string;
  preco: number;
  imagemUrl: string;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const addItemToCart = useCartStore((state) => state.addItem);
  const [isFavorite, setIsFavorite] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        if (id) {
          const data = await getProductById(id as string);
          setProduct(data);
          const related = [
            {
              id: "rel1",
              nome: "Produto Relacionado 1",
              preco: 29.99,
              imagemUrl:
                "https://via.placeholder.com/200/FFC107/000000?Text=Rel1",
            },
            {
              id: "rel2",
              nome: "Produto Relacionado 2",
              preco: 49.5,
              imagemUrl:
                "https://via.placeholder.com/200/4CAF50/FFFFFF?Text=Rel2",
            },
            {
              id: "rel3",
              nome: "Produto Relacionado 3",
              preco: 19.9,
              imagemUrl:
                "https://via.placeholder.com/200/F44336/FFFFFF?Text=Rel3",
            },
          ];
          setRelatedProducts(related);
        }
      } catch (err: any) {
        setError(`Erro ao carregar detalhes do produto com ID ${id}`);
        console.error("Erro ao buscar detalhes do produto:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItemToCart({
        id: product.id,
        nome: product.nome,
        preco: product.preco,
        imagemUrl: product.imagemUrl || "",
        quantidade: 1,
      });
      toast.success(`${product.nome} adicionado ao carrinho!`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast[isFavorite ? "success" : "info"](
      `${product?.nome} ${
        isFavorite ? "adicionado" : "removido"
      } dos favoritos.`,
      {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      }
    );
    // Lógica real dos favoritos aqui
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 text-center">
        Carregando detalhes do produto...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-8 text-center">
        Produto não encontrado.
      </div>
    );
  }

  const imageUrl =
    product.imagemUrl && product.imagemUrl.startsWith("http")
      ? product.imagemUrl
      : "https://via.placeholder.com/400/EEEEEE/000000?Text=Sem+Imagem";

  const whatsappNumber = "SEU_NUMERO_DE_WHATSAPP"; // Substitua pelo seu número
  const whatsappMessage = `Olá! Gostaria de saber mais sobre o produto: ${product.nome} (ID: ${product.id})`;
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div>
      <MenuMobile />
      <Navbar />

      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Coluna da Imagem */}
          <div className="relative w-full aspect-w-1 aspect-h-1 rounded-lg overflow-hidden shadow-md">
            <Image
              src={imageUrl}
              alt={product.nome}
              layout="fill"
              objectFit="contain"
              className="transition-opacity duration-300 ease-in-out"
            />
          </div>

          {/* Coluna de Detalhes */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                {product.nome}
              </h1>
              <button
                onClick={handleToggleFavorite}
                className={`p-2 text-gray-500 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 rounded-full ${
                  isFavorite ? "text-red-500" : ""
                }`}
                aria-label={
                  isFavorite
                    ? "Remover dos favoritos"
                    : "Adicionar aos favoritos"
                }
              >
                <Heart
                  className={`h-6 w-6 ${
                    isFavorite ? "fill-red-500" : "fill-transparent"
                  }`}
                />
              </button>
            </div>
            <p className="text-xl text-gray-500">
              R$ {product.preco.toFixed(2)}
            </p>

            {product.descricao && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Descrição
                </h2>
                <p className="text-gray-700">{product.descricao}</p>
              </div>
            )}

            <div className="mt-6 flex items-center space-x-4">
              <button
                onClick={handleAddToCart}
                className="cursor-pointer bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-300 flex items-center"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Adicionar ao Carrinho
              </button>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-colors duration-300 flex items-center"
              >
                <FaWhatsapp className="h-5 w-5 mr-2" />
                WhatsApp
              </a>
            </div>
            {/* Mais informações ou funcionalidades aqui */}
          </div>
        </div>

        {/* Seção de Produtos Relacionados */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">
              Produtos Relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}
