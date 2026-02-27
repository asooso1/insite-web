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
  Activity,
  MapPin,
  FileText,
  ShieldCheck,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUIStore } from "@/lib/stores/ui-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useMenuTree } from "@/lib/hooks/use-menu";
import type { MenuDTO } from "@/lib/types/menu";
import { cn } from "@/lib/utils";
import { mapMenuUrl } from "@/lib/utils/menu-url-mapper";
import { containerVariants, itemVariants } from "@/lib/animations";

// ============================================================================
// 아이콘 매핑
// ============================================================================

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  dashboard: LayoutDashboard,
  "work-order": ClipboardList,
  workorder: ClipboardList,
  facility: Building,
  building: Building,
  user: Users,
  users: Users,
  settings: Settings,
  setting: Settings,
  analytics: BarChart3,
  report: BarChart3,
  sensor: Activity,
  fieldwork: MapPin,
  patrol: MapPin,
  board: FileText,
  license: ShieldCheck,
};

function getMenuIcon(
  iconName: string
): React.ComponentType<{ className?: string }> {
  const key = iconName?.toLowerCase() ?? "";
  for (const [k, v] of Object.entries(ICON_MAP)) {
    if (key.includes(k)) return v;
  }
  return HelpCircle;
}

// ============================================================================
// 폴백 메뉴 (API 실패 또는 buildingId 없을 때)
// ============================================================================

const FALLBACK_MENUS: MenuDTO[] = [
  {
    id: 1,
    depth: 1,
    sortNo: 1,
    parentId: 0,
    name: "대시보드",
    use: true,
    url: "/main",
    show: true,
    icon: "dashboard",
    children: [],
  },
  {
    id: 2,
    depth: 1,
    sortNo: 2,
    parentId: 0,
    name: "작업 관리",
    use: true,
    url: "/work-orders",
    show: true,
    icon: "workorder",
    children: [],
  },
  {
    id: 3,
    depth: 1,
    sortNo: 3,
    parentId: 0,
    name: "시설 관리",
    use: true,
    url: "/facilities",
    show: true,
    icon: "facility",
    children: [],
  },
  {
    id: 4,
    depth: 1,
    sortNo: 4,
    parentId: 0,
    name: "사용자 관리",
    use: true,
    url: "/users",
    show: true,
    icon: "user",
    children: [],
  },
  {
    id: 5,
    depth: 1,
    sortNo: 5,
    parentId: 0,
    name: "설정",
    use: true,
    url: "/settings",
    show: true,
    icon: "settings",
    children: [],
  },
];

// ============================================================================
// 스켈레톤 컴포넌트
// ============================================================================

function MenuSkeleton(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-1 px-2 py-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-9 animate-pulse rounded-md"
          style={{ backgroundColor: "var(--sidebar-dark-hover)" }}
        />
      ))}
    </div>
  );
}

// ============================================================================
// 사이드바 메뉴 아이템 (서브메뉴 포함)
// ============================================================================

function SidebarMenuItem({
  item,
  isCollapsed,
  pathname,
}: {
  item: MenuDTO;
  isCollapsed: boolean;
  pathname: string;
}): React.JSX.Element {
  const Icon = getMenuIcon(item.icon);
  const hasChildren =
    item.children.length > 0 && item.children.some((c) => c.use && c.show);
  const mappedUrl = mapMenuUrl(item.url);
  const isActive = pathname.startsWith(mappedUrl);
  const [open, setOpen] = React.useState(isActive);

  const linkContent = (
    <Link
      href={mapMenuUrl(item.url)}
      className={cn(
        "group flex items-center rounded-md py-2 text-sm font-medium",
        "transition-all duration-150",
        isCollapsed ? "justify-center px-2" : "gap-3 px-3",
        isActive && !isCollapsed && "border-l-2 border-[#0064FF] pl-[10px]"
      )}
      style={{
        color: isActive
          ? "var(--sidebar-dark-text-active)"
          : "var(--sidebar-dark-text)",
        backgroundColor: isActive ? "var(--sidebar-dark-active)" : "transparent",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = "var(--sidebar-dark-hover)";
          e.currentTarget.style.color = "var(--sidebar-dark-text-active)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = "var(--sidebar-dark-text)";
        }
      }}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />
      {!isCollapsed && <span className="flex-1 truncate">{item.name}</span>}
      {!isCollapsed && hasChildren && (
        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 shrink-0 transition-transform duration-150",
            open && "rotate-90"
          )}
          style={{ color: "var(--sidebar-dark-text)" }}
        />
      )}
    </Link>
  );

  if (isCollapsed) {
    return (
      <div>
        <Tooltip>
          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
          <TooltipContent side="right" sideOffset={10}>
            {item.name}
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  if (hasChildren) {
    return (
      <div>
        <button
          type="button"
          className={cn(
            "group flex w-full items-center rounded-md py-2 text-sm font-medium",
            "transition-all duration-150 gap-3 px-3",
            isActive && "border-l-2 border-[#0064FF] pl-[10px]"
          )}
          style={{
            color: isActive
              ? "var(--sidebar-dark-text-active)"
              : "var(--sidebar-dark-text)",
            backgroundColor: isActive
              ? "var(--sidebar-dark-active)"
              : "transparent",
          }}
          onClick={() => setOpen((prev) => !prev)}
          onMouseEnter={(e) => {
            if (!isActive) {
              e.currentTarget.style.backgroundColor =
                "var(--sidebar-dark-hover)";
              e.currentTarget.style.color = "var(--sidebar-dark-text-active)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive) {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--sidebar-dark-text)";
            }
          }}
          aria-expanded={open}
        >
          <Icon className="h-[18px] w-[18px] shrink-0" />
          <span className="flex-1 truncate text-left">{item.name}</span>
          <ChevronRight
            className={cn(
              "h-3.5 w-3.5 shrink-0 transition-transform duration-150",
              open && "rotate-90"
            )}
            style={{ color: "var(--sidebar-dark-text)" }}
          />
        </button>
        {open && (
          <div className="ml-4 mt-0.5 flex flex-col gap-0.5 border-l pl-2"
            style={{ borderColor: "var(--sidebar-dark-border)" }}
          >
            {item.children
              .filter((c) => c.use && c.show)
              .sort((a, b) => a.sortNo - b.sortNo)
              .map((child) => (
                <SidebarMenuItem
                  key={child.id}
                  item={child}
                  isCollapsed={false}
                  pathname={pathname}
                />
              ))}
          </div>
        )}
      </div>
    );
  }

  return linkContent;
}

// ============================================================================
// 메뉴 목록 렌더링
// ============================================================================

function MenuList({
  menus,
  isCollapsed,
  pathname,
}: {
  menus: MenuDTO[];
  isCollapsed: boolean;
  pathname: string;
}): React.JSX.Element {
  const visibleMenus = menus
    .filter((m) => m.use && m.show)
    .sort((a, b) => a.sortNo - b.sortNo);

  return (
    <motion.nav
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="flex flex-col gap-0.5 px-2"
      aria-label="사이드바 메뉴"
    >
      {visibleMenus.map((item, idx) => (
        <motion.div key={item.id} variants={itemVariants}>
          {/* depth=1 항목 사이에 구분선 (축소 시, 첫 번째 제외) */}
          {isCollapsed && idx > 0 && item.depth === 1 && (
            <div
              className="mx-3 my-2"
              style={{ borderTop: "1px solid var(--sidebar-dark-border)" }}
            />
          )}
          <SidebarMenuItem
            item={item}
            isCollapsed={isCollapsed}
            pathname={pathname}
          />
        </motion.div>
      ))}
    </motion.nav>
  );
}

// ============================================================================
// 사이드바 메인
// ============================================================================

/**
 * 다크 프로페셔널 사이드바
 * - 테마 무관 항상 다크 네이비 배경
 * - 250px 확장 / 64px 축소
 * - 백엔드 API에서 메뉴 동적 로딩
 * - 로딩 중 스켈레톤 / 에러 시 폴백 메뉴
 */
export function Sidebar(): React.JSX.Element {
  const pathname = usePathname();
  const { sidebarMode, sidebarWidth, pinSidebar, unpinSidebar } = useUIStore();
  const { user, clearAuth } = useAuthStore();

  const isCollapsed = sidebarMode === "closed";
  const isPinned = sidebarMode === "pinned";

  const buildingId = user?.currentBuildingId;
  const { data: menuData, isLoading, isError } = useMenuTree(buildingId);

  // 표시할 메뉴 결정: API 데이터 > 폴백
  const menus: MenuDTO[] =
    !isLoading && !isError && menuData && menuData.length > 0
      ? menuData
      : FALLBACK_MENUS;

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        animate={{ width: isCollapsed ? 64 : sidebarWidth }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed left-0 top-[52px] z-[var(--z-sticky)]",
          "flex h-[calc(100vh-52px)] flex-col overflow-hidden"
        )}
        style={{
          backgroundColor: "var(--sidebar-dark-bg)",
          borderRight: "1px solid var(--sidebar-dark-border)",
        }}
        aria-label="메인 내비게이션"
      >
        {/* 로고 영역 */}
        <div
          className={cn(
            "flex h-[52px] shrink-0 items-center",
            isCollapsed ? "justify-center px-2" : "gap-2.5 px-4"
          )}
          style={{ borderBottom: "1px solid var(--sidebar-dark-border)" }}
        >
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#0064FF] to-[#4B90FF]">
                  <Zap className="h-4 w-4 text-white" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={10}>
                INSITE BEMS
              </TooltipContent>
            </Tooltip>
          ) : (
            <>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#0064FF] to-[#4B90FF]">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-[15px] font-bold tracking-wide text-white/95">
                  INSITE
                </span>
                <span className="text-[10px] font-medium tracking-[0.15em] text-white/40">
                  BEMS
                </span>
              </div>
            </>
          )}
        </div>

        {/* 메뉴 영역 */}
        <ScrollArea className="flex-1 py-3">
          {isLoading ? (
            <MenuSkeleton />
          ) : (
            <MenuList
              menus={menus}
              isCollapsed={isCollapsed}
              pathname={pathname}
            />
          )}
        </ScrollArea>

        {/* 하단: 사용자 정보 + 핀 토글 */}
        <div
          className="shrink-0"
          style={{ borderTop: "1px solid var(--sidebar-dark-border)" }}
        >
          {/* 사용자 정보 (확장 시만) */}
          {!isCollapsed && (
            <div className="flex items-center justify-between px-3 py-2.5">
              <div className="flex min-w-0 items-center gap-2.5">
                {/* 이니셜 아바타 */}
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0064FF] to-[#4B90FF]">
                  <span className="text-[11px] font-semibold text-white">
                    {user?.userName?.charAt(0) ?? "U"}
                  </span>
                </div>
                <span
                  className="truncate text-[13px] font-medium"
                  style={{ color: "var(--sidebar-dark-text)" }}
                >
                  {user?.userName ?? "사용자"}
                </span>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 hover:bg-white/5"
                    onClick={() => clearAuth()}
                    aria-label="로그아웃"
                  >
                    <LogOut
                      className="h-3.5 w-3.5"
                      style={{ color: "var(--sidebar-dark-text)" }}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={10}>
                  로그아웃
                </TooltipContent>
              </Tooltip>
            </div>
          )}

          {/* 핀/언핀 토글 */}
          <div className={cn("px-2 pb-2", isCollapsed ? "pt-2" : "pt-0")}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full hover:bg-white/5",
                    isCollapsed ? "justify-center px-0" : "justify-start gap-2"
                  )}
                  onClick={isPinned ? unpinSidebar : pinSidebar}
                  aria-label={isPinned ? "사이드바 고정 해제" : "사이드바 고정"}
                >
                  <ChevronLeft
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      isCollapsed && "rotate-180"
                    )}
                    style={{ color: "var(--sidebar-dark-text)" }}
                  />
                  {!isCollapsed && (
                    <span
                      className="text-xs"
                      style={{ color: "var(--sidebar-dark-text)" }}
                    >
                      {isPinned ? "고정 해제" : "사이드바 고정"}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right" sideOffset={10}>
                  사이드바 고정
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}
