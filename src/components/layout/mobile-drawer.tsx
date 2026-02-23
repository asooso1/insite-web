"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Building,
  Users,
  Settings,
  BarChart3,
  Zap,
  MapPin,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MENU_ITEMS = [
  { id: "dashboard", name: "대시보드", url: "/main", icon: LayoutDashboard },
  { id: "work-orders", name: "작업 관리", url: "/work-orders", icon: ClipboardList },
  { id: "facility", name: "시설 관리", url: "/facilities", icon: Building },
  { id: "users", name: "사용자 관리", url: "/users", icon: Users },
  { id: "sensors", name: "센서 모니터링", url: "/sensors", icon: Zap },
  { id: "analytics", name: "분석/리포트", url: "/reports", icon: BarChart3 },
  { id: "fieldwork", name: "현장작업", url: "/fieldwork", icon: MapPin },
  { id: "settings", name: "설정", url: "/settings", icon: Settings },
];

/**
 * 모바일/태블릿 사이드바 드로어
 * - 오버레이 배경 + 슬라이드-인 패널
 * - lg 미만 화면에서 AppShell의 사이드바 대체
 */
export function MobileDrawer({ open, onClose }: MobileDrawerProps): React.JSX.Element {
  const pathname = usePathname();

  // ESC 키로 닫기
  React.useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // 열릴 때 body 스크롤 잠금
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* 오버레이 */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-black/50 transition-opacity duration-200 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 드로어 패널 */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-[70] h-full w-64",
          "flex flex-col bg-sidebar shadow-xl",
          "transition-transform duration-200 ease-in-out lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="내비게이션 메뉴"
      >
        {/* 드로어 헤더 */}
        <div className="flex h-[52px] items-center justify-between border-b border-sidebar-border px-4">
          <span className="text-sm font-semibold">메뉴</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">메뉴 닫기</span>
          </Button>
        </div>

        {/* 메뉴 목록 */}
        <ScrollArea className="flex-1 py-4">
          <nav className="flex flex-col gap-1 px-2">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.url);
              return (
                <Link
                  key={item.id}
                  href={item.url}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5",
                    "text-sm font-medium transition-colors",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive && "bg-sidebar-accent text-sidebar-primary"
                  )}
                >
                  <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-sidebar-primary")} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
      </aside>
    </>
  );
}
