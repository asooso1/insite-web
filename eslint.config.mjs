import { defineConfig, globalIgnores } from "eslint/config";
import nextConfig from "eslint-config-next";

const eslintConfig = defineConfig([
  // Next.js 공식 ESLint 설정 (TypeScript 파서, React 규칙, 브라우저 글로벌 포함)
  ...nextConfig,
  // Ignore patterns
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
    ".git/**",
    "dist/**",
    "storybook-static/**",
  ]),
  // React Compiler ESLint 규칙 비활성화 (이 프로젝트는 React Compiler 미사용)
  // eslint-plugin-react-hooks v7이 추가한 React Compiler 전용 규칙들
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/static-components": "off",
      "react-hooks/error-boundaries": "off",
      "react-hooks/preserve-manual-memoization": "off",
      "react-hooks/incompatible-library": "off",
    },
  },
  // e2e 테스트 파일은 Playwright 환경이므로 React 훅 규칙 비적용
  {
    files: ["e2e/**"],
    rules: {
      "react-hooks/rules-of-hooks": "off",
    },
  },
  // Storybook stories 파일: render 함수 안에서 훅 사용 패턴 허용 + 코드 예제 문자열 허용
  {
    files: ["**/*.stories.tsx", "**/*.stories.ts"],
    rules: {
      "react-hooks/rules-of-hooks": "off",
      "react/no-unescaped-entities": "off",
    },
  },
]);

export default eslintConfig;
