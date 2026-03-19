import { defineConfig, globalIgnores } from "eslint/config";
import jsEslint from "@eslint/js";

const eslintConfig = defineConfig([
  jsEslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
  },
  // Ignore patterns
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
    ".git/**",
    "dist/**",
  ]),
]);

export default eslintConfig;
