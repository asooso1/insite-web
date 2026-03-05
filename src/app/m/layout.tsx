import type { Metadata, Viewport } from "next";
import type * as React from "react";

export const metadata: Metadata = {
  title: "insite 모바일",
  description: "빌딩 시설 관리 시스템 - 모바일",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // iOS Safe Area
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

/**
 * /m/* 모바일 전용 레이아웃
 * - viewport: device-width, userScalable=false (앱 느낌)
 * - viewportFit: cover (iOS 노치/홈버튼 영역 활용)
 * - 인증은 미들웨어에서 처리 (PUBLIC_PATHS에 /m 포함)
 */
export default function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return <>{children}</>;
}
