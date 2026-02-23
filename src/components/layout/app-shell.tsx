"use client";

import * as React from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { MobileDrawer } from "./mobile-drawer";
import { useUIStore } from "@/lib/stores/ui-store";
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
      <Header onMobileMenuClick={() => setDrawerOpen(true)} />

      {/* 모바일/태블릿 드로어 */}
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* 데스크톱 사이드바 */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 overflow-auto pt-[52px] transition-all duration-200",
          "bg-[var(--bg-gradient)]"
        )}
        style={{ marginLeft: sidebarOffset }}
      >
        <div className="mx-auto max-w-[1920px] p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
