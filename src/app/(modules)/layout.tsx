import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";

/**
 * 모듈 레이아웃
 * - 헤더 + 사이드바 포함 AppShell 적용
 * - 인증이 필요한 모든 모듈 페이지에서 공유
 */
export default function ModulesLayout({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return <AppShell>{children}</AppShell>;
}
