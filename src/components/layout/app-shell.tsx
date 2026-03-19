"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Header } from "./header";
import { Footer } from "./footer";
import { MobileDrawer } from "./mobile-drawer";

// SSR 비활성화: Radix UI useId 카운터 서버/클라이언트 불일치 방지
const Sidebar = dynamic(() => import("./sidebar").then((m) => ({ default: m.Sidebar })), {
  ssr: false,
});
// CommandPalette: Dialog 내부 Radix 컴포넌트가 SSR에서 ID를 소비하여 Header ID 불일치 유발
const CommandPalette = dynamic(() => import("./command-palette").then((m) => ({ default: m.CommandPalette })), {
  ssr: false,
});
import { useUIStore } from "@/lib/stores/ui-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { AuthInitializer } from "@/components/auth/auth-initializer";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * 앱 셸 레이아웃
 * - Desktop (lg+): Header(52px) + 고정 Sidebar + marginLeft으로 컨텐츠 오프셋
 * - Tablet/Mobile (<lg): Header + MobileDrawer 오버레이 + 전체폭 컨텐츠
 */
export function AppShell({ children }: AppShellProps): React.JSX.Element {
  const { sidebarMode, sidebarWidth } = useUIStore();
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [isDesktop, setIsDesktop] = React.useState(false);

  // 반응형: lg 브레이크포인트 감지 (1024px)
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent): void => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const sidebarOffset = isDesktop
    ? sidebarMode === "closed"
      ? 64
      : sidebarWidth
    : 0;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <AuthInitializer />
      <Header onMobileMenuClick={() => setDrawerOpen(true)} />

      {/* 모바일/태블릿 드로어 */}
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* 데스크톱 사이드바 */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Command Palette (전역) */}
      <CommandPalette />

      {/* Main Content - auth 초기화 완료 후 렌더링 (새로고침 시 401 race condition 방지) */}
      <main
        className={cn(
          "flex-1 overflow-auto pt-14 transition-all duration-200",
          "bg-[var(--bg-gradient)]"
        )}
        style={{ marginLeft: sidebarOffset }}
      >
        <div className="mx-auto max-w-[1920px] p-4 md:p-6">
          {isInitialized ? children : null}
          <Footer />
        </div>
      </main>
    </div>
  );
}
