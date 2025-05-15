// src/app/(public)/produtos/[id]/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { getProductById } from "@/api/products";
import { getProductImageUrl } from "@/lib/utils";
import { Heart, ShoppingCart } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "sonner";
import RelatedProductsSection from "@/components/BarrocoCrocheSection";
import { useFavoritesStore } from "@/store/favoritesStore";
import ProductVariantSelector from "@/features/produtos/components/ProductVariantSelector";
import { useCartStore } from "@/store/cartStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  estoque: number;
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
} as const;

export default function ProductDetailPage() {
  const { id } = useParams();
  const productId = typeof id === "string" ? id : undefined;
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [displayedImageUrl, setDisplayedImageUrl] = useState<
    string | null | undefined
  >(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantityToAdd, setQuantityToAdd] = useState(1);
  const [availableQuantity, setAvailableQuantity] = useState<
    number | undefined
  >(undefined);

  const addItemToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        if (id) {
          const data = await getProductById(id);
          setProduct(data);
          setDisplayedImageUrl(
            Array.isArray(data?.imagemUrl)
              ? data?.imagemUrl[0] // Pega a primeira imagem do array
              : data?.imagemUrl
          );
        }
      } catch (err: unknown) {
        setError(`Erro ao carregar detalhes do produto com ID ${id}`);
        console.error("Erro ao buscar detalhes do produto:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    console.log("Page - ID:", id, "selectedColor:", selectedColor);
    if (selectedColor && product?.variacoes) {
      const selectedVariation = product.variacoes.find(
        (v) => v.cor === selectedColor
      );
      if (selectedVariation?.imagemUrl) {
        setDisplayedImageUrl(selectedVariation.imagemUrl);
      } else {
        setDisplayedImageUrl(product?.imagemUrl);
      }
    } else if (!selectedColor) {
      setDisplayedImageUrl(product?.imagemUrl);
    }
    // Resetar a quantidade disponível ao mudar a cor
    setAvailableQuantity(undefined);
  }, [selectedColor, product?.variacoes, product?.imagemUrl, id]);

  useEffect(() => {
    console.log(
      "Page - ID:",
      id,
      "selectedColor:",
      selectedColor,
      "selectedSize:",
      selectedSize
    );
    if (selectedColor && selectedSize && product?.variacoes) {
      const selectedVariation = product.variacoes.find(
        (v) => v.cor === selectedColor && String(v.numero) === selectedSize
      );
      setAvailableQuantity(selectedVariation?.quantidade);
      console.log(
        "Page - ID:",
        id,
        "availableQuantity (cor e tamanho):",
        selectedVariation?.quantidade
      );
    } else if (selectedColor && !selectedSize && product?.variacoes) {
      const firstColorVariation = product.variacoes.find(
        (v) => v.cor === selectedColor
      );
      setAvailableQuantity(firstColorVariation?.quantidade);
      console.log(
        "Page - ID:",
        id,
        "availableQuantity (apenas cor):",
        firstColorVariation?.quantidade
      );
    } else {
      setAvailableQuantity(product?.estoque);
      console.log(
        "Page - ID:",
        id,
        "availableQuantity (nenhuma seleção):",
        product?.estoque
      );
    }
  }, [selectedColor, selectedSize, product?.variacoes, product?.estoque, id]);

  const handleAddToCart = () => {
    if (!product) {
      toast.error("Erro ao adicionar ao carrinho: produto não encontrado.");
      return;
    }

    const hasSizes = product.variacoes.some((v) => v.numero !== null);

    if (hasSizes && !selectedSize) {
      toast.error(
        "Por favor, selecione um tamanho antes de adicionar ao carrinho."
      );
      return;
    }

    if (availableQuantity !== undefined && availableQuantity > 0) {
      const itemToAdd = {
        id: product.id,
        nome: product.nome,
        preco: product.preco,
        imagemUrl: displayedImageUrl || "",
        quantidade: quantityToAdd,
        cor: selectedColor,
        tamanho: selectedSize,
      };
      addItemToCart(itemToAdd);
      toast.success(
        `${product.nome} (Cor: ${selectedColor || "N/A"}, Tamanho: ${
          selectedSize || "N/A"
        }) adicionado ao carrinho!`,
        {
          ...toastConfig,
        }
      );
    } else {
      toast.error("Produto indisponível com a seleção feita.");
    }
  };

  const isFavorite = useFavoritesStore((state) =>
    state.isFavorite(productId || "")
  );
  const addItemToFavorites = useFavoritesStore((state) => state.addItem);
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
        addItemToFavorites({
          id: product.id,
          nome: product.nome,
          imagemUrl: product.imagemUrl || "",
          slug: product.id,
        });
        toast.success("Adicionado aos favoritos!", { ...toastConfig });
      }
    }
  };

  const handleQuantityChange = (value: number) => {
    if (
      !isNaN(value) &&
      value > 0 &&
      availableQuantity !== undefined &&
      value <= availableQuantity
    ) {
      setQuantityToAdd(value);
    } else if (!isNaN(value) && value > 0 && availableQuantity === undefined) {
      setQuantityToAdd(value);
    } else if (availableQuantity !== undefined && value > availableQuantity) {
      toast.error(
        `A quantidade máxima disponível é ${availableQuantity}.`,
        toastConfig
      );
      setQuantityToAdd(availableQuantity);
    } else if (value < 1) {
      setQuantityToAdd(1); // Garante que a quantidade mínima seja 1
    } else {
      setQuantityToAdd(value);
    }
  };

  const handleColorSelect = (cor: string) => {
    setSelectedColor(cor);
    setSelectedSize(null); // Resetar o tamanho ao mudar a cor
    console.log("Page - handleColorSelect:", cor);
  };

  const handleSizeSelect = useCallback(
    (size: number | undefined) => {
      setSelectedSize(String(size));
      console.log("Page - handleSizeSelect:", size);
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
  const whatsappNumber = "5569992784621";
  const whatsappMessage = `Olá! Gostaria de saber mais sobre o produto: ${product.nome} (ID: ${product.id})`;
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div>
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Coluna da Imagem */}
          <div className="relative w-full aspect-w-1 aspect-h-1 rounded-lg overflow-hidden shadow-md md:aspect-auto">
            <Image
              src={imageUrl}
              alt={product.nome}
              layout="responsive" // Para responsividade da imagem
              width={500} // Largura base
              height={500} // Altura base
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

            <ProductVariantSelector
              variants={product.variacoes.map((v) => ({
                cor: v.cor,
                numero: v.numero,
                imagemUrl: v.imagemUrl,
                disponivel: v.quantidade > 0, // Adiciona a disponibilidade com base na quantidade
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

            <div className="mt-6 flex flex-col space-y-4">
              {availableQuantity !== undefined ? (
                availableQuantity > 0 ? (
                  <p className="text-green-500 font-semibold">
                    {availableQuantity} unidades disponíveis
                  </p>
                ) : (
                  <p className="text-red-600 font-semibold">
                    Produto indisponível com a seleção feita.
                  </p>
                )
              ) : (
                product.estoque !== undefined && (
                  <p className="text-gray-500">
                    Estoque geral: {product.estoque} unidades (selecione cor e
                    tamanho para ver a disponibilidade específica)
                  </p>
                )
              )}

              {/* Quantidade com Input Shadcn */}
              <div className="flex items-center space-x-2">
                <label
                  htmlFor="quantity"
                  className="font-semibold text-gray-700"
                >
                  Quantidade:
                </label>
                <Input
                  type="number"
                  id="quantity"
                  className="w-24 text-center"
                  value={quantityToAdd}
                  onChange={(e) =>
                    handleQuantityChange(parseInt(e.target.value, 10))
                  }
                  min="1"
                  max={
                    availableQuantity !== undefined
                      ? availableQuantity
                      : product?.estoque !== undefined
                      ? product.estoque
                      : 1
                  }
                  disabled={availableQuantity === 0}
                />
                {availableQuantity !== undefined &&
                  availableQuantity < 5 &&
                  availableQuantity > 0 && (
                    <span className="text-red-500 text-sm">
                      (Apenas {availableQuantity} disponíveis)
                    </span>
                  )}
              </div>

              {/* Botões responsivos */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={handleAddToCart}
                  className={cn(
                    "w-full sm:w-auto",
                    availableQuantity === 0
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  )}
                  disabled={availableQuantity === 0}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Adicionar ao Carrinho
                </Button>
                <Button
                  asChild
                  className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-colors duration-300 flex items-center"
                >
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-grow flex items-center justify-center"
                  >
                    <FaWhatsapp className="h-5 w-5 mr-2" />
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <RelatedProductsSection />
      </div>
    </div>
  );
}
