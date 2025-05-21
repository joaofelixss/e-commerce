//src/features/checkout/components/form/BotaoSubmit.tsx
import { Button } from "@/components/ui/button";
import { FaWhatsapp } from "react-icons/fa";

export function BotaoSubmit({ submitting }: { submitting: boolean }) {
  return (
    <Button
      type="submit"
      className="w-full bg-foreground text-background font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      disabled={submitting}
    >
      <FaWhatsapp className="w-6 h-6 mr-2" />
      {submitting ? "Enviando Pedido..." : "Enviar Pedido via WhatsApp"}
    </Button>
  );
}
