import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.ts", "**/*.tsx"], // Aplica essas regras a arquivos TS e TSX
    rules: {
      "@typescript-eslint/no-unused-vars": "off", // Ou "error" se você quiser que seja um erro
    },
  },
  // Outras configurações podem vir aqui
];

export default eslintConfig;
