"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { getProductById } from "@/api/products";
import { getProductImageUrl } from "@/lib/utils";
import { Heart, ShoppingCart } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/Navbar";
import MenuMobile from "@/components/MenuMobile";
import RelatedProductsSection from "@/components/RelatedProductsSection";
import { useFavoritesStore } from "@/store/favoritesStore";
import ProductVariantSelector from "@/components/ProductVariantSelector";

interface Variation {
  id: string;
  cor: string;
  numero: number | null;
  imagemUrl: string | null | undefined;
  quantidade: number;
  estoque: number;
  nivelMinimo: number | null;
  produtoId: string;
}

interface ProductDetails {
  id: string;
  nome: string;
  preco: number;
  imagemUrl: string | null | undefined;
  categoriaId: string;
  criadoEm: string;
  atualizadoEm: string;
  variacoes: Variation[];
}

const toastConfig = {
  position: "top-right",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [displayedImageUrl, setDisplayedImageUrl] = useState<
    string | null | undefined
  >(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantityToAdd, setQuantityToAdd] = useState(1);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        if (id) {
          const data = await getProductById(id);
          setProduct(data);
          setDisplayedImageUrl(data?.imagemUrl); // Inicializa com a imagem principal
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

  useEffect(() => {
    if (selectedColor && product?.variacoes) {
      const selectedVariation = product.variacoes.find(
        (v) => v.cor === selectedColor
      );
      if (selectedVariation?.imagemUrl) {
        setDisplayedImageUrl(selectedVariation.imagemUrl);
      } else {
        setDisplayedImageUrl(product?.imagemUrl); // Se não houver imagem para a cor, volta para a principal
      }
    } else if (!selectedColor) {
      setDisplayedImageUrl(product?.imagemUrl); // Se nenhuma cor estiver selecionada, mostra a principal
    }
  }, [selectedColor, product?.variacoes, product?.imagemUrl]);

  const handleAddToCart = () => {
    if (product) {
      const itemToAdd = {
        id: product.id,
        nome: product.nome,
        preco: product.preco,
        imagemUrl: displayedImageUrl || "", // Use displayedImageUrl aqui
        quantidade: quantityToAdd,
        cor: selectedColor,
        tamanho: selectedSize,
      };
      // @ts-ignore
      addItemToCart(itemToAdd);
      toast.success(`${product.nome} adicionado ao carrinho!`, {
        ...toastConfig,
      });
    } else {
      toast.error("Erro ao adicionar ao carrinho.");
    }
  };

  // @ts-ignore
  const isFavorite = useFavoritesStore((state) => state.isFavorite(id));
  // @ts-ignore
  const addItemToFavorites = useFavoritesStore((state) => state.addItem);
  // @ts-ignore
  const removeItemFromFavorites = useFavoritesStore(
    (state) => state.removeItem
  );

  const handleFavoriteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (product) {
      if (isFavorite) {
        removeItemFromFavorites(product.id);
        toast.error("Removido dos favoritos!", { ...toastConfig });
      } else {
        addItemToFavorites(product.id);
        toast.success("Adicionado aos favoritos!", { ...toastConfig });
      }
    }
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (
      !isNaN(value) &&
      value > 0 &&
      product?.estoque !== undefined &&
      value <= product.estoque
    ) {
      setQuantityToAdd(value);
    } else if (!isNaN(value) && value > 0 && product?.estoque === undefined) {
      setQuantityToAdd(value);
    }
  };

  const handleColorSelect = (cor: string) => {
    setSelectedColor(cor);
    // Opcional: resetar a seleção de tamanho ao mudar de cor
    // setSelectedSize(null);
  };
  const handleSizeSelect = useCallback(
    (size: number | undefined) => {
      setSelectedSize(String(size));
      // Lógica adicional se a imagem mudar por tamanho
    },
    [setSelectedSize]
  );

  const handleImageChange = useCallback(
    (imageUrl: string | undefined) => {
      setDisplayedImageUrl(imageUrl);
    },
    [setDisplayedImageUrl]
  );

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

  const imageUrl = getProductImageUrl(displayedImageUrl);
  const whatsappNumber = "SEU_NUMERO_DE_WHATSAPP";
  const whatsappMessage = `Olá! Gostaria de saber mais sobre o produto: ${product.nome} (ID: ${product.id})`;
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  // Código antes do return
  console.log("Produto:", product);
  console.log("Cor Selecionada:", selectedColor);
  console.log("URL da Imagem Exibida:", displayedImageUrl);

  return (
    <div>
      <MenuMobile />
      <Navbar />

      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Coluna da Imagem */}
          <div className="relative w-full aspect-w-1 aspect-h-1 rounded-lg overflow-hidden shadow-md">
            <Image
              src={
                imageUrl ||
                "https://via.placeholder.com/400/EEEEEE/000000?Text=Sem+Imagem"
              }
              alt={product.nome}
              layout="fill"
              objectFit="contain"
              className="transition-opacity duration-300 ease-in-out"
            />
            <button
              onClick={handleFavoriteClick}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 focus:outline-none z-20 transition-transform duration-200 hover:translate-y-[-2px]"
            >
              {isFavorite ? (
                <Heart className="h-6 w-6 fill-red-500" />
              ) : (
                <Heart className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Coluna de Detalhes */}
          <div className="space-y-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {product.nome}
            </h1>
            <p className="text-xl text-gray-500">
              R$ {product.preco.toFixed(2)}
            </p>

            {product.variacoes && product.variacoes.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Cores
                </h3>
                <div className="flex items-center space-x-3">
                  {product.variacoes.map((variacao) => (
                    <button
                      key={variacao.id}
                      className={`w-8 h-8 rounded-full shadow-md focus:outline-none ${
                        selectedColor === variacao.cor
                          ? "ring-2 ring-indigo-500"
                          : ""
                      }`}
                      style={{ backgroundColor: variacao.cor }}
                      onClick={() => handleColorSelect(variacao.cor)}
                      aria-label={`Selecionar cor ${variacao.cor}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {product.variacoes &&
              Array.from(
                new Set(product.variacoes.map((v) => v.numero).filter(Boolean))
              )
                .sort(
                  (a, b) => (a === null || b === null ? 0 : a - b) as number
                )
                .map((tamanho) => (
                  <div key={`tamanho-${tamanho}`} className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Tamanhos
                    </h3>
                    <div className="flex items-center space-x-3">
                      {product.variacoes
                        .filter((v) => v.numero === tamanho)
                        .map((variacao) => (
                          <button
                            key={variacao.id}
                            className={`py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                              selectedSize === String(variacao.numero)
                                ? "bg-indigo-100 text-indigo-700"
                                : ""
                            }`}
                            onClick={() =>
                              setSelectedSize(String(variacao.numero))
                            }
                          >
                            {tamanho}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}

            <div className="mt-6 flex items-center space-x-4">
              {product.estoque !== undefined && product.estoque > 0 ? (
                <>
                  <div className="flex items-center space-x-2">
                    <label
                      htmlFor="quantity"
                      className="font-semibold text-gray-700"
                    >
                      Quantidade:
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      className="w-20 border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={quantityToAdd}
                      onChange={handleQuantityChange}
                      min="1"
                      max={product.estoque}
                    />
                    {product.estoque < 5 && (
                      <span className="text-red-500 text-sm">
                        (Apenas {product.estoque} disponíveis)
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="cursor-pointer bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-colors duration-300 flex items-center"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Adicionar ao Carrinho
                  </button>
                </>
              ) : (
                <p className="text-red-600 font-semibold">
                  Produto indisponível no momento.
                </p>
              )}
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
            <ProductVariantSelector
              variants={product.variacoes.map((v) => ({
                cor: v.cor,
                numero: v.numero,
                imagemUrl: v.imagemUrl,
              }))}
              onColorSelect={handleColorSelect}
              onNumberSelect={handleSizeSelect}
              onImageChange={handleImageChange}
              initialColor={selectedColor || product.variacoes[0]?.cor}
              initialNumber={
                selectedSize
                  ? parseInt(selectedSize, 10)
                  : product.variacoes[0]?.numero
              }
            />
          </div>
        </div>

        <RelatedProductsSection />
      </div>

      <ToastContainer />
    </div>
  );
}
