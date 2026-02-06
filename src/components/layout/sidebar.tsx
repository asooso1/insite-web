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
  ChevronRight,
  Pin,
  PinOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUIStore } from "@/lib/stores/ui-store";
import { cn } from "@/lib/utils";

/**
 * 메뉴 아이템 타입
 */
interface MenuItem {
  id: string;
  name: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: MenuItem[];
}

/**
 * 임시 메뉴 데이터 (실제로는 API에서 조회)
 */
const MENU_ITEMS: MenuItem[] = [
  {
    id: "dashboard",
    name: "대시보드",
    url: "/main",
    icon: LayoutDashboard,
  },
  {
    id: "work-orders",
    name: "작업 관리",
    url: "/work-orders",
    icon: ClipboardList,
  },
  {
    id: "facility",
    name: "시설 관리",
    url: "/facility",
    icon: Building,
  },
  {
    id: "users",
    name: "사용자 관리",
    url: "/users",
    icon: Users,
  },
  {
    id: "sensors",
    name: "센서 모니터링",
    url: "/sensors",
    icon: Zap,
  },
  {
    id: "analytics",
    name: "분석/리포트",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    id: "fieldwork",
    name: "현장작업",
    url: "/fieldwork",
    icon: MapPin,
  },
  {
    id: "settings",
    name: "설정",
    url: "/settings",
    icon: Settings,
  },
];

/**
 * 사이드바 컴포넌트
 * - 250px 확장 / 64px 축소
 * - 메뉴 트리 렌더링
 * - 고정(pin) 기능
 */
export function Sidebar(): React.JSX.Element {
  const pathname = usePathname();
  const { sidebarMode, sidebarWidth, pinSidebar, unpinSidebar } = useUIStore();

  const isCollapsed = sidebarMode === "closed";
  const isPinned = sidebarMode === "pinned";

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-[52px] z-[var(--z-sticky)]",
          "flex h-[calc(100vh-52px)] flex-col",
          "border-r border-sidebar-border bg-sidebar",
          "transition-all duration-200"
        )}
        style={{ width: isCollapsed ? 64 : sidebarWidth }}
      >
        {/* 메뉴 영역 */}
        <ScrollArea className="flex-1 py-4">
          <nav className="flex flex-col gap-1 px-2">
            {MENU_ITEMS.map((item) => (
              <SidebarMenuItem
                key={item.id}
                item={item}
                isCollapsed={isCollapsed}
                isActive={pathname.startsWith(item.url)}
              />
            ))}
          </nav>
        </ScrollArea>

        {/* 하단: 고정 버튼 */}
        {!isCollapsed && (
          <div className="border-t border-sidebar-border p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground"
              onClick={isPinned ? unpinSidebar : pinSidebar}
            >
              {isPinned ? (
                <>
                  <PinOff className="mr-2 h-4 w-4" />
                  고정 해제
                </>
              ) : (
                <>
                  <Pin className="mr-2 h-4 w-4" />
                  사이드바 고정
                </>
              )}
            </Button>
          </div>
        )}
      </aside>
    </TooltipProvider>
  );
}

/**
 * 사이드바 메뉴 아이템
 */
function SidebarMenuItem({
  item,
  isCollapsed,
  isActive,
}: {
  item: MenuItem;
  isCollapsed: boolean;
  isActive: boolean;
}): React.JSX.Element {
  const Icon = item.icon;

  const content = (
    <Link
      href={item.url}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2",
        "text-sm font-medium transition-colors",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isActive && "bg-sidebar-accent text-sidebar-primary",
        isCollapsed && "justify-center px-2"
      )}
    >
      <Icon
        className={cn("h-5 w-5 shrink-0", isActive && "text-sidebar-primary")}
      />
      {!isCollapsed && (
        <>
          <span className="flex-1">{item.name}</span>
          {item.children && item.children.length > 0 && (
            <ChevronRight className="h-4 w-4" />
          )}
        </>
      )}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={10}>
          {item.name}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}
