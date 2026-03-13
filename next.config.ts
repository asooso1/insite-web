import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  // 백엔드 API 프록시 (브라우저 → Next.js → csp-was)
  async rewrites() {
    const backendUrl = process.env.BACKEND_INTERNAL_URL || "http://localhost:8081";
    return [
      {
        // auth, services/menus는 Next.js API Routes에서 처리
        // 나머지 /api/* 는 csp-was로 프록시
        source: "/api/:path((?!auth|services).*)",
        destination: `${backendUrl}/api/:path`,
      },
      {
        // /widget/* → csp-was 위젯 API 프록시
        source: "/widget/:path*",
        destination: `${backendUrl}/widget/:path*`,
      },
    ];
  },

  // 이미지 최적화
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // 실험적 기능
  experimental: {
    // 패키지 외부화 (서버 컴포넌트 최적화)
    serverComponentsExternalPackages: [],
  },

  // 번들 크기 최적화
  compiler: {
    // 프로덕션에서 console.log 제거
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },
};

export default withBundleAnalyzer(nextConfig);
