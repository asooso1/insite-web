import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  // 보안 헤더 설정
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // XSS 방지: 스크립트 출처 제한
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js 동적 스크립트 필요
              "style-src 'self' 'unsafe-inline'", // Tailwind 인라인 스타일 허용
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self'",
              "frame-ancestors 'none'", // Clickjacking 방지
            ].join("; "),
          },
          // Clickjacking 방지 (CSP frame-ancestors 보조)
          { key: "X-Frame-Options", value: "DENY" },
          // MIME 타입 스니핑 방지
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Referrer 정보 최소화
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // HTTPS 강제 (프로덕션)
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
        ],
      },
    ];
  },

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

  // 서버 컴포넌트 외부 패키지 (experimental에서 최상위로 이동됨)
  serverExternalPackages: [],

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
