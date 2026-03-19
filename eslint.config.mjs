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
  // e2e 테스트 파일은 Playwright 환경이므로 React 훅 규칙 비적용
  {
    files: ["e2e/**"],
    rules: {
      "react-hooks/rules-of-hooks": "off",
    },
  },
]);

export default eslintConfig;
