// frontend/src/components/ProductVariantSelector.tsx
import React, { useState, useEffect } from "react";

interface Variant {
  cor: string;
  numero?: number;
  imagemUrl?: string;
}

interface ProductVariantSelectorProps {
  variants: Variant[];
  onColorSelect: (color: string) => void;
  onNumberSelect?: (number: number | undefined) => void;
  onImageChange: (imageUrl: string | undefined) => void;
  initialColor?: string;
  initialNumber?: number;
}

const ProductVariantSelector: React.FC<ProductVariantSelectorProps> = ({
  variants,
  onColorSelect,
  onNumberSelect,
  onImageChange,
  initialColor,
  initialNumber,
}) => {
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    initialColor
  );
  const [selectedNumber, setSelectedNumber] = useState<number | undefined>(
    initialNumber
  );

  useEffect(() => {
    if (variants && variants.length > 0) {
      const initialVariant = variants.find((v) => v.cor === initialColor);
      if (initialVariant?.imagemUrl) {
        onImageChange(initialVariant.imagemUrl);
      } else if (variants[0].imagemUrl) {
        onImageChange(variants[0].imagemUrl);
      }
    }
  }, [variants, initialColor, onImageChange]);

  const handleColorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const color = event.target.value;
    setSelectedColor(color);
    onColorSelect(color);
    const selectedVariant = variants.find((v) => v.cor === color);
    if (selectedVariant?.imagemUrl) {
      onImageChange(selectedVariant.imagemUrl);
    }
  };

  const handleNumberClick = (number: number) => {
    setSelectedNumber(number);
    onNumberSelect?.(number);
  };

  // Filtra as cores únicas das variantes
  const uniqueColors = [...new Set(variants.map((v) => v.cor))];

  // Filtra os tamanhos 6 e 8 que existem nas variantes
  const availableSizes = [6, 8].filter((size) =>
    variants.some((v) => v.numero === size)
  );

  return (
    <div>
      {uniqueColors.length > 1 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Cor</h3>
          <select
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={selectedColor || ""}
            onChange={handleColorChange}
          >
            <option value="" disabled>
              Selecione a cor
            </option>
            {uniqueColors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>
      )}

      {availableSizes.length > 0 && onNumberSelect && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Tamanho</h3>
          <div className="flex items-center space-x-3">
            {availableSizes.map((size) => (
              <button
                key={size}
                className={`py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  selectedNumber === size ? "bg-indigo-100 text-indigo-700" : ""
                }`}
                onClick={() => handleNumberClick(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductVariantSelector;
