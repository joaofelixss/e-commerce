// frontend/src/components/ProductVariantSelector.tsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Variant {
  cor: string;
  numero?: number | null;
  imagemUrl?: string | null | undefined;
  disponivel?: boolean;
}

interface ProductVariantSelectorProps {
  variants: Variant[];
  onColorSelect: (color: string) => void;
  onNumberSelect?: (number: number | undefined) => void;
  onImageChange: (imageUrl: string | undefined) => void;
  initialColor?: string;
  initialNumber?: number | null;
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
    undefined
  );
  const [selectedNumber, setSelectedNumber] = useState<number | undefined>(
    undefined
  );
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [emailToNotify, setEmailToNotify] = useState("");

  const sizesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sizesContainerRef.current) {
      const focusedElement = sizesContainerRef.current.querySelector(":focus");
      if (focusedElement) {
      }
    }
  }, []); // Executa apenas uma vez após a montagem

  useEffect(() => {
    if (variants && variants.length > 0) {
      const initialVariant = variants.find((v) => v.cor === initialColor);
      console.log(
        "Initial color:",
        initialColor,
        "Initial variant:",
        initialVariant
      );
      if (initialVariant?.imagemUrl) {
        onImageChange(initialVariant.imagemUrl);
      } else if (variants[0]?.imagemUrl) {
        onImageChange(variants[0].imagemUrl);
      }
    }
  }, [variants, initialColor, onImageChange]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    onColorSelect(color);
    const selectedVariant = variants.find((v) => v.cor === color);
    if (selectedVariant?.imagemUrl) {
      onImageChange(selectedVariant.imagemUrl);
    }
    setShowEmailInput(false);
  };

  const handleNumberClick = useCallback(
    (number: number | undefined) => {
      setSelectedNumber(number);
      console.log("Selector - handleNumberClick:", number);
      onNumberSelect?.(number);
      console.log("Selector - onNumberSelect called with:", number);
    },
    [onNumberSelect, setSelectedNumber]
  );

  const uniqueColors = [...new Set(variants.map((v) => v.cor))];
  const availableSizes = [
    ...new Set(
      variants
        .filter(
          (v) =>
            v.numero !== null &&
            v.numero !== undefined &&
            v.cor === selectedColor // Filtrar por cor selecionada
        )
        .map((v) => v.numero)
    ),
  ].sort((a, b) => (a || 0) - (b || 0));

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="color" className="text-sm font-semibold">
          Cor
        </Label>
        <Select value={selectedColor} onValueChange={handleColorChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione a cor" />
          </SelectTrigger>
          <SelectContent>
            {uniqueColors.map((color) => {
              const isColorAvailable = variants.some(
                (v) => v.cor === color && v.disponivel !== false
              );
              console.log(`Color: ${color}, Available: ${isColorAvailable}`);
              return (
                <SelectItem
                  key={color}
                  value={color}
                  disabled={!isColorAvailable}
                >
                  {color}
                  {!isColorAvailable && (
                    <span className="ml-2 text-red-500">
                      (Indisponível)
                      {selectedColor === color && (
                        <Button
                          variant="link"
                          size="sm"
                          className="ml-2"
                          onClick={() => setShowEmailInput(true)}
                        >
                          Avise-me
                        </Button>
                      )}
                    </span>
                  )}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        {showEmailInput && selectedColor && (
          <div className="mt-2 space-y-2">
            <Label htmlFor="emailNotify" className="text-sm font-bold">
              Seu e-mail:
            </Label>
            <Input
              type="email"
              id="emailNotify"
              className="w-full"
              value={emailToNotify}
              onChange={(e) => setEmailToNotify(e.target.value)}
              placeholder="seu@email.com"
            />
            <Button
              size="sm"
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
            </Button>
          </div>
        )}
      </div>

      {availableSizes.length > 0 && onNumberSelect && (
        <div>
          <Label htmlFor="size" className="text-sm font-semibold">
            Tamanho
          </Label>
          <div className="flex items-center space-x-2" ref={sizesContainerRef}>
            {availableSizes.map((size) => {
              const isSizeAvailable = variants.some(
                (v) => v.numero === size && v.disponivel !== false
              );
              return (
                <Button
                  key={size}
                  variant={selectedNumber === size ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "rounded-md",
                    isSizeAvailable
                      ? "hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      : "cursor-not-allowed opacity-50"
                  )}
                  onClick={() => {
                    console.log("Button Size Clicked:", size); // ADICIONE ESTE LOG
                    handleNumberClick(isSizeAvailable ? size : undefined);
                  }}
                  disabled={!isSizeAvailable}
                >
                  {size}
                  {!isSizeAvailable && (
                    <XCircleIcon
                      className="ml-1 inline-block h-4 w-4 text-red-500"
                      aria-hidden="true"
                    />
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductVariantSelector;
