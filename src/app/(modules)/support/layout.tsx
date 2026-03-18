import type { ReactNode } from "react";

/**
 * Support 모듈 레이아웃
 * - 부모 레이아웃(AppShell)의 스타일 상속
 */
export default function SupportLayout({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return children;
}
