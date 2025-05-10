import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getProductImageUrl = (
  imageUrl: string | null | undefined
): string => {
  if (imageUrl?.startsWith("http")) {
    return imageUrl;
  }
  if (imageUrl) {
    return `/oferta.png`;
  }
  return "https://via.placeholder.com/300/EEEEEE/000000?Text=Sem+Imagem";
};
