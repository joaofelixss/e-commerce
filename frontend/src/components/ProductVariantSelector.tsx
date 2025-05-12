// frontend/src/components/ProductVariantSelector.tsx
import React, { useState, useEffect } from "react";
import { XCircleIcon } from "@heroicons/react/24/solid"; // Importe um ícone para indicar indisponibilidade

interface Variant {
  cor: string;
  numero?: number;
  imagemUrl?: string;
  disponivel?: boolean; // Adicione um campo para indicar disponibilidade (se vier da API)
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
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [emailToNotify, setEmailToNotify] = useState("");

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
    setShowEmailInput(false); // Esconde o input de e-mail ao mudar a cor
  };

  const handleNumberClick = (number: number | undefined) => {
    setSelectedNumber(number);
    onNumberSelect?.(number);
  };

  const uniqueColors = [...new Set(variants.map((v) => v.cor))];
  const availableSizes = [6, 8]; // Agora exibimos sempre 6 e 8

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
            {uniqueColors.map((color) => {
              const isColorAvailable = variants.some(
                (v) => v.cor === color && v.disponivel !== false
              );
              return (
                <option key={color} value={color} disabled={!isColorAvailable}>
                  {color}
                  {!isColorAvailable && (
                    <span className="ml-2 text-red-500">
                      (Indisponível)
                      {selectedColor === color && (
                        <button
                          type="button"
                          className="ml-2 text-sm text-blue-500 hover:underline focus:outline-none"
                          onClick={() => setShowEmailInput(true)}
                        >
                          Avise-me
                        </button>
                      )}
                    </span>
                  )}
                </option>
              );
            })}
          </select>
          {showEmailInput && selectedColor && (
            <div className="mt-2">
              <label
                htmlFor="emailNotify"
                className="block text-gray-700 text-sm font-bold mb-1"
              >
                Seu e-mail:
              </label>
              <input
                type="email"
                id="emailNotify"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={emailToNotify}
                onChange={(e) => setEmailToNotify(e.target.value)}
                placeholder="seu@email.com"
              />
              <button
                type="button"
                className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => {
                  // Aqui você implementaria a lógica para enviar a solicitação de e-mail
                  console.log(
                    `Solicitar notificação para ${emailToNotify} na cor ${selectedColor}`
                  );
                  setShowEmailInput(false);
                  setEmailToNotify("");
                }}
              >
                Enviar solicitação
              </button>
            </div>
          )}
        </div>
      )}

      {availableSizes.length > 0 && onNumberSelect && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Tamanho</h3>
          <div className="flex items-center space-x-3">
            {availableSizes.map((size) => {
              const isSizeAvailable = variants.some(
                (v) => v.numero === size && v.disponivel !== false
              );
              return (
                <button
                  key={size}
                  className={`py-2 px-4 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500
                    ${
                      isSizeAvailable
                        ? `border-gray-300 text-gray-700 hover:bg-gray-100 ${
                            selectedNumber === size
                              ? "bg-indigo-100 text-indigo-700"
                              : ""
                          }`
                        : "border-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  onClick={() =>
                    handleNumberClick(isSizeAvailable ? size : undefined)
                  }
                  disabled={!isSizeAvailable}
                >
                  {size}
                  {!isSizeAvailable && (
                    <XCircleIcon
                      className="ml-1 inline-block h-4 w-4 text-red-500"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductVariantSelector;
