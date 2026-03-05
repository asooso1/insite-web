import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";

/**
 * 대시보드 레이아웃 - AppShell 적용
 */
export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return <AppShell>{children}</AppShell>;
}
