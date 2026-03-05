import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
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
