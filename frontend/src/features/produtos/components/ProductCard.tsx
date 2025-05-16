// frontend/src/components/ProductCard.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/features/produtos/store/cartStore";
import { useFavoritesStore } from "@/features/produtos/store/favoritesStore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaWhatsapp } from "react-icons/fa";
import { getProductImageUrl } from "@/lib/utils";

interface Product {
  id: string;
  nome: string;
  preco: number;
  imagemUrl: string | null | undefined;
  slug?: string; // Adicione a propriedade slug à interface Product (se existir)
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const productId = product.id;
  const isCurrentlyFavorite = useFavoritesStore((state) =>
    state.isFavorite(productId)
  );
  const addItemToFavorites = useFavoritesStore((state) => state.addItem);
  const removeItemFromFavorites = useFavoritesStore(
    (state) => state.removeItem
  );

  const imageUrl = getProductImageUrl(product.imagemUrl);

  const handleWhatsAppClick = () => {
    const phoneNumber = "5569992784621";
    const message = `Olá, gostaria de comprar o produto: ${
      product.nome
    } - R$ ${product.preco.toFixed(2)}`;
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappURL, "_blank");
  };

  const handleFavoriteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (isCurrentlyFavorite) {
      removeItemFromFavorites(productId);
      toast.error("Removido dos favoritos!", { ...toastConfig });
    } else {
      addItemToFavorites({
        id: product.id,
        imagemUrl: product.imagemUrl || "", // Garanta que não seja undefined
        slug: product.slug || `/produtos/${product.id}`, // Use slug se existir, senão uma rota padrão
        nome: product.nome,
      });
      toast.success("Adicionado aos favoritos!", { ...toastConfig });
    }
  };

  const handleAddToCartClick = () => {
    useCartStore.getState().addItem({ ...product, quantidade: 1 });
    toast.success(`${product.nome} adicionado ao carrinho!`, {
      ...toastConfig,
    });
  };

  const toastConfig = {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  return (
    <div
      className={`bg-white rounded-md shadow-md p-4 flex flex-col transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${className}`}
    >
      <div className="relative w-full h-32 mb-2 cursor-pointer sm:h-48">
        {" "}
        {/* Ajustado a altura inicial para mobile */}
        <Link
          href={`/produtos/${product.id}`}
          className="absolute inset-0 z-10"
        ></Link>
        <Image
          src={imageUrl}
          alt={product.nome}
          layout="fill"
          objectFit="cover"
          className="rounded-md"
        />
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 focus:outline-none z-20 transition-transform duration-200 hover:translate-y-[-2px]"
        >
          {isCurrentlyFavorite ? (
            <Heart className="h-6 w-6 fill-red-500" />
          ) : (
            <Heart className="h-6 w-6" />
          )}
        </button>
      </div>
      <h3 className="text-lg font-semibold mb-2">{product.nome}</h3>
      <p className="text-gray-600 mb-2">R$ {product.preco.toFixed(2)}</p>
      <div className="mt-2 flex gap-2">
        <Button
          onClick={handleWhatsAppClick}
          className="w-1/2 bg-green-300 hover:bg-green-500 text-white font-bold py-2 px-3 rounded text-sm flex items-center justify-center"
        >
          <FaWhatsapp className="mr-1 w-4 h-4" /> WhatsApp
        </Button>
        <Button
          onClick={handleAddToCartClick}
          className="w-1/2 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-2 rounded text-sm flex items-center justify-center"
        >
          <ShoppingCart className="mr-2 w-4 h-4" /> Carrinho
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
