"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Building,
  FileText,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 모바일 하단 탭 네비게이션 아이템
 */
interface BottomNavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  matchPaths?: string[];
}

const NAV_ITEMS: BottomNavItem[] = [
  {
    id: "home",
    label: "홈",
    href: "/m",
    icon: LayoutDashboard,
    matchPaths: ["/m"],
  },
  {
    id: "work-orders",
    label: "작업",
    href: "/m/work-orders",
    icon: ClipboardList,
    matchPaths: ["/m/work-orders"],
  },
  {
    id: "facilities",
    label: "시설",
    href: "/m/facilities",
    icon: Building,
    matchPaths: ["/m/facilities"],
  },
  {
    id: "reports",
    label: "보고서",
    href: "/m/reports",
    icon: FileText,
    matchPaths: ["/m/reports"],
  },
  {
    id: "profile",
    label: "내 정보",
    href: "/m/profile",
    icon: User,
    matchPaths: ["/m/profile"],
  },
];

/**
 * 모바일 하단 탭 네비게이션
 * - 64px 고정 높이 (Safe Area 고려)
 * - 5개 탭: 홈 / 작업 / 시설 / 보고서 / 내 정보
 */
export function MobileBottomNav(): React.JSX.Element {
  const pathname = usePathname();

  const isActive = (item: BottomNavItem): boolean => {
    if (item.matchPaths) {
      return item.matchPaths.some((path) =>
        path === "/m" ? pathname === "/m" : pathname.startsWith(path)
      );
    }
    return pathname.startsWith(item.href);
  };

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "flex h-16 items-stretch",
        "border-t border-border bg-background/95 backdrop-blur-sm",
        "pb-safe" // iOS Safe Area
      )}
      aria-label="하단 탭 네비게이션"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isActive(item);

        return (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1",
              "text-muted-foreground transition-colors",
              "active:scale-95 active:transition-none",
              active && "text-primary"
            )}
            aria-current={active ? "page" : undefined}
          >
            <Icon
              className={cn(
                "h-5 w-5 transition-transform",
                active && "scale-110"
              )}
            />
            <span
              className={cn(
                "text-[10px] font-medium leading-none",
                active && "font-semibold"
              )}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
