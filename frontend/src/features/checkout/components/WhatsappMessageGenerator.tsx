// components/WhatsappMessageGenerator.tsx
import { CartItem } from "@/features/produtos/store/cartStore";

interface Props {
  name: string;
  phone: string;
  desejaEntrega: boolean;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  frete: number;
  cartItems: CartItem[]; // Tipagem correta aqui
  totalComFrete: number;
  formaPagamento: "dinheiro" | "pix" | "cartao";
  notes: string;
}

const WhatsappMessageGenerator: React.FC<Props> = ({
  name,
  phone,
  desejaEntrega,
  cep,
  endereco,
  numero,
  complemento,
  bairro,
  cidade,
  uf,
  frete,
  cartItems, // Removemos a tipagem "as CartItem[]" daqui
  totalComFrete,
  formaPagamento,
  notes,
}) => {
  const orderDetails = cartItems
    .map(
      (item) =>
        `- ${item.quantidade} x ${item.nome} ${
          item.cor ? `(Cor: ${item.cor})` : ""
        } ${item.tamanho ? `(Tamanho: ${item.tamanho})` : ""} - R$ ${(
          item.preco * item.quantidade
        ).toFixed(2)}`
    )
    .join("\n");

  const formattedFormaPagamento =
    formaPagamento === "dinheiro"
      ? "Dinheiro"
      : formaPagamento === "pix"
      ? "Pix"
      : "Cartão";

  let message = `🎉 Novo Pedido! 🎉\n\n*Dados do Cliente:*\n👤 Nome: ${name}\n📞 Telefone: ${phone}\n\n`;

  if (desejaEntrega) {
    message += `🚚 *Entrega:*\n✅ Sim\n📍 CEP: ${cep}\n🗺️ Endereço: ${endereco}, ${numero} ${
      complemento ? `(Complemento: ${complemento})` : ""
    }\n🏘️ Bairro: ${bairro}\n🏙️ Cidade: ${cidade} - ${uf}\n💸 Frete: R$ ${frete.toFixed(
      2
    )}\n\n`;
  } else {
    message += `📦 *Retirada no Local:*\n❌ Não (Cliente irá retirar)\n\n`;
  }

  message += `🛒 *Itens do Pedido:*\n${orderDetails}\n\n💰 *Total da Compra: R$ ${totalComFrete.toFixed(
    2
  )}*\n\n💳 *Forma de Pagamento:* ${formattedFormaPagamento}\n\n📝 *Observações:* ${notes}`;

  return encodeURIComponent(message);
};

export default WhatsappMessageGenerator;
