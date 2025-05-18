// frontend/src/components/ProductCard.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useFavoritesStore } from "@/features/produtos/store/favoritesStore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Brush, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProductImageUrl } from "@/lib/utils";

interface Product {
  id: string;
  nome: string;
  preco: number;
  imagemUrl: string | null | undefined;
  slug?: string;
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

  const handleFavoriteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (isCurrentlyFavorite) {
      removeItemFromFavorites(productId);
      toast.error("Removido dos favoritos!");
    } else {
      addItemToFavorites({
        id: product.id,
        imagemUrl: product.imagemUrl || "", // Garanta que não seja undefined
        slug: product.slug || `/produtos/${product.id}`, // Use slug se existir, senão uma rota padrão
        nome: product.nome,
      });
      toast.success("Adicionado aos favoritos!");
    }
  };
  
  return (
    <div
      className={`bg-white rounded-md shadow-md p-4 flex flex-col transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${className}`}
    >
      <div className="relative sm:w-72 h-48 mb-2 cursor-pointer">
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
      <div className=" flex justify-center items-center">
        <Link href={`/produtos/${product.id}`}>
          <Button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded text-sm flex items-center justify-center transition-transform duration-200 transform hover:scale-105  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-blue-500/50 cursor-pointer">
            <Brush className="mr-2 w-4 h-4" /> Ver detalhes
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
