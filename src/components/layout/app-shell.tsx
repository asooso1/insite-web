"use client";

import * as React from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { useUIStore } from "@/lib/stores/ui-store";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * 앱 셸 레이아웃
 * - Header (52px 고정)
 * - Sidebar (250px 확장 / 64px 축소)
 * - Main Content 영역
 */
export function AppShell({ children }: AppShellProps): React.JSX.Element {
  const { sidebarMode, sidebarWidth } = useUIStore();

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Header */}
      <Header />

      {/* Body: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main
          className={cn(
            "flex-1 overflow-auto transition-all duration-200",
            "bg-[var(--bg-gradient)]"
          )}
          style={{
            marginLeft: sidebarMode === "closed" ? 64 : sidebarWidth,
          }}
        >
          <div className="mx-auto max-w-[1920px] p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
