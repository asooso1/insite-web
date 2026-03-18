"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  Briefcase,
  Building2,
  Package,
  Pin,
  PinOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  bems: Zap,
  becm: Zap,
  energy: Zap,
  analysis: BarChart3,
  mypage: Users,
  service: Briefcase,
  site: Building2,
  material: Package,
  client: Users,
};

function getMenuIcon(iconName: string): React.ComponentType<{ className?: string }> {
  const key = iconName?.toLowerCase() ?? "";
  for (const [k, v] of Object.entries(ICON_MAP)) {
    if (key.includes(k)) return v;
  }
  return HelpCircle;
}

// ============================================================================
// GNB 섹션 감지 / 필터
// ============================================================================

function detectGnbSection(pathname: string): string {
  if (pathname.startsWith("/bems")) return "bems";
  if (pathname.startsWith("/becm")) return "becm";
  if (pathname.startsWith("/settings")) return "settings";
  if (pathname.startsWith("/dashboard")) return "dashboard";
  return "fms";
}

const SECTION_PREFIXES: Record<string, string[]> = {
  dashboard: ["/dashboard"],
  fms: [
    "/work-orders", "/facilities", "/patrols", "/fieldwork", "/analysis",
    "/reports", "/boards", "/materials", "/licenses", "/mypage", "/users", "/clients",
    "/controls", "/duty", "/invoices", "/rentals", "/nfc-rounds", "/tags",
    "/personal-work-orders", "/privacy", "/support", "/service",
  ],
  bems: ["/bems"],
  becm: ["/becm"],
  settings: ["/settings"],
};

// ============================================================================
// 폴백 메뉴
// ============================================================================

const FALLBACK_MENUS: MenuDTO[] = [
  {
    id: 1, depth: 1, sortNo: 1, parentId: 0,
    name: "대시보드", use: true, url: "/dashboard", show: true, icon: "dashboard", children: [],
  },
  {
    id: 10, depth: 1, sortNo: 10, parentId: 0,
    name: "업무 관리", use: true, url: "/work-orders", show: true, icon: "workorder",
    children: [
      { id: 11, depth: 2, sortNo: 1, parentId: 10, name: "수시업무", use: true, url: "/work-orders", show: true, icon: "workorder", children: [] },
      { id: 12, depth: 2, sortNo: 2, parentId: 10, name: "SOP", use: true, url: "/work-orders/sop", show: true, icon: "workorder", children: [] },
      { id: 13, depth: 2, sortNo: 3, parentId: 10, name: "민원", use: true, url: "/work-orders/complain", show: true, icon: "workorder", children: [] },
      { id: 14, depth: 2, sortNo: 4, parentId: 10, name: "TBM", use: true, url: "/work-orders/tbm", show: true, icon: "workorder", children: [] },
    ],
  },
  { id: 20, depth: 1, sortNo: 20, parentId: 0, name: "시설 관리", use: true, url: "/facilities", show: true, icon: "facility", children: [] },
  { id: 21, depth: 1, sortNo: 21, parentId: 0, name: "순찰/점검", use: true, url: "/patrols", show: true, icon: "patrol", children: [] },
  { id: 22, depth: 1, sortNo: 22, parentId: 0, name: "현장작업", use: true, url: "/fieldwork", show: true, icon: "fieldwork", children: [] },
  { id: 23, depth: 1, sortNo: 23, parentId: 0, name: "분석", use: true, url: "/analysis", show: true, icon: "analytics", children: [] },
  { id: 24, depth: 1, sortNo: 24, parentId: 0, name: "보고서", use: true, url: "/reports", show: true, icon: "report", children: [] },
  { id: 25, depth: 1, sortNo: 25, parentId: 0, name: "게시판", use: true, url: "/boards", show: true, icon: "board", children: [] },
  { id: 26, depth: 1, sortNo: 26, parentId: 0, name: "자재 관리", use: true, url: "/materials", show: true, icon: "material", children: [] },
  { id: 27, depth: 1, sortNo: 27, parentId: 0, name: "자격증", use: true, url: "/licenses", show: true, icon: "license", children: [] },
  {
    id: 28, depth: 1, sortNo: 28, parentId: 0, name: "사용자 관리", use: true, url: "/users", show: true, icon: "users",
    children: [
      { id: 281, depth: 2, sortNo: 1, parentId: 28, name: "사용자 목록", use: true, url: "/users", show: true, icon: "users", children: [] },
      { id: 282, depth: 2, sortNo: 2, parentId: 28, name: "역할 관리", use: true, url: "/users/roles", show: true, icon: "users", children: [] },
    ],
  },
  { id: 29, depth: 1, sortNo: 29, parentId: 0, name: "고객 관리", use: true, url: "/clients", show: true, icon: "client", children: [] },
  { id: 30, depth: 1, sortNo: 30, parentId: 0, name: "마이페이지", use: true, url: "/mypage", show: true, icon: "mypage", children: [] },
  {
    id: 31, depth: 1, sortNo: 31, parentId: 0, name: "제어 관리", use: true, url: "/controls", show: true, icon: "settings",
    children: [],
  },
  {
    id: 32, depth: 1, sortNo: 32, parentId: 0, name: "당직 관리", use: true, url: "/duty", show: true, icon: "workorder",
    children: [],
  },
  {
    id: 33, depth: 1, sortNo: 33, parentId: 0, name: "서비스", use: true, url: "/service", show: true, icon: "service",
    children: [
      { id: 331, depth: 2, sortNo: 1, parentId: 33, name: "청소 관리", use: true, url: "/service/cleaning", show: true, icon: "service", children: [] },
      { id: 332, depth: 2, sortNo: 2, parentId: 33, name: "근태 관리", use: true, url: "/service/attendance", show: true, icon: "service", children: [] },
    ],
  },
  {
    id: 34, depth: 1, sortNo: 34, parentId: 0, name: "청구서", use: true, url: "/invoices", show: true, icon: "board",
    children: [],
  },
  {
    id: 35, depth: 1, sortNo: 35, parentId: 0, name: "임차 관리", use: true, url: "/rentals", show: true, icon: "facility",
    children: [],
  },
  {
    id: 36, depth: 1, sortNo: 36, parentId: 0, name: "NFC 라운드", use: true, url: "/nfc-rounds", show: true, icon: "patrol",
    children: [],
  },
  {
    id: 37, depth: 1, sortNo: 37, parentId: 0, name: "태그 관리", use: true, url: "/tags", show: true, icon: "sensor",
    children: [],
  },
  {
    id: 38, depth: 1, sortNo: 38, parentId: 0, name: "고객지원", use: true, url: "/support", show: true, icon: "board",
    children: [
      { id: 381, depth: 2, sortNo: 1, parentId: 38, name: "FAQ", use: true, url: "/support/faq", show: true, icon: "board", children: [] },
      { id: 382, depth: 2, sortNo: 2, parentId: 38, name: "QnA", use: true, url: "/support/qna", show: true, icon: "board", children: [] },
    ],
  },
  {
    id: 39, depth: 1, sortNo: 39, parentId: 0, name: "개인작업지시", use: true, url: "/personal-work-orders", show: true, icon: "workorder",
    children: [],
  },
  {
    id: 41, depth: 1, sortNo: 41, parentId: 0, name: "개인정보처리방침", use: true, url: "/privacy", show: true, icon: "license",
    children: [],
  },
  { id: 40, depth: 1, sortNo: 40, parentId: 0, name: "설정", use: true, url: "/settings", show: true, icon: "settings", children: [] },
];

// ============================================================================
// 스켈레톤
// ============================================================================

const SKELETON_ITEMS = [
  { key: "sk-1", w: "75%" },
  { key: "sk-2", w: "60%" },
  { key: "sk-3", w: "80%" },
  { key: "sk-4", w: "50%" },
  { key: "sk-5", w: "65%" },
] as const;

function MenuSkeleton(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-1 px-3 py-2">
      {SKELETON_ITEMS.map(({ key, w }, i) => (
        <div
          key={key}
          className="h-8 animate-pulse rounded-lg"
          style={{
            width: w,
            backgroundColor: "var(--sidebar-dark-hover)",
            opacity: 1 - i * 0.15,
          }}
        />
      ))}
    </div>
  );
}

// ============================================================================
// 메뉴 아이템
// ============================================================================

function SidebarMenuItem({
  item,
  isCollapsed,
  pathname,
  depth = 1,
}: {
  item: MenuDTO;
  isCollapsed: boolean;
  pathname: string;
  depth?: number;
}): React.JSX.Element {
  const Icon = getMenuIcon(item.icon);
  // insiteUrl(수동 매핑)이 있으면 우선, 없으면 하드코딩 변환 폴백
  const mappedUrl = item.insiteUrl ?? mapMenuUrl(item.url);
  const hasChildren =
    item.children.length > 0 && item.children.some((c) => c.use && c.show);
  const isActive = pathname.startsWith(mappedUrl);
  const isExactActive = pathname === mappedUrl;

  const [open, setOpen] = React.useState(isActive && hasChildren);

  React.useEffect(() => {
    if (isActive && hasChildren) setOpen(true);
  }, [pathname, isActive, hasChildren]);

  // ── 축소 모드: 아이콘 + 툴팁 ──
  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={mappedUrl}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg",
              "transition-colors duration-150",
              isActive
                ? "bg-[var(--sidebar-dark-active)] text-[var(--sidebar-dark-text-active)]"
                : "text-[var(--sidebar-dark-text)] hover:bg-[var(--sidebar-dark-hover)] hover:text-[var(--sidebar-dark-text-active)]"
            )}
            aria-current={isExactActive ? "page" : undefined}
          >
            <Icon className="h-[17px] w-[17px] shrink-0" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={12} className="text-[13px]">
          {item.name}
        </TooltipContent>
      </Tooltip>
    );
  }

  // ── 확장 모드: 리프 메뉴 ──
  if (!hasChildren) {
    return (
      <Link
        href={mappedUrl}
        className={cn(
          "relative flex items-center rounded-lg transition-colors duration-150",
          depth === 1 ? "h-8 gap-2.5 px-2.5 text-[13px] font-medium" : "h-7 gap-2 pl-2 text-[12.5px]",
          isActive
            ? "bg-[var(--sidebar-dark-active)] text-[var(--sidebar-dark-text-active)]"
            : "text-[var(--sidebar-dark-text)] hover:bg-[var(--sidebar-dark-hover)] hover:text-[var(--sidebar-dark-text-active)]"
        )}
        aria-current={isExactActive ? "page" : undefined}
      >
        {/* 활성 인디케이터 */}
        {isActive && depth === 1 && (
          <span className="absolute left-0 top-1/2 h-[55%] w-[3px] -translate-y-1/2 rounded-r-full bg-[#0064FF]" />
        )}
        {depth === 1 && <Icon className="h-[15px] w-[15px] shrink-0" />}
        <span className="truncate">{item.name}</span>
      </Link>
    );
  }

  // ── 확장 모드: 부모 메뉴 ──
  return (
    <div>
      <button
        type="button"
        className={cn(
          "relative flex h-8 w-full items-center gap-2.5 rounded-lg px-2.5",
          "text-[13px] font-medium transition-colors duration-150",
          isActive
            ? "bg-[var(--sidebar-dark-active)] text-[var(--sidebar-dark-text-active)]"
            : "text-[var(--sidebar-dark-text)] hover:bg-[var(--sidebar-dark-hover)] hover:text-[var(--sidebar-dark-text-active)]"
        )}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={`submenu-${item.id}`}
      >
        {isActive && (
          <span className="absolute left-0 top-1/2 h-[55%] w-[3px] -translate-y-1/2 rounded-r-full bg-[#0064FF]" />
        )}
        <Icon className="h-[15px] w-[15px] shrink-0" />
        <span className="flex-1 truncate text-left">{item.name}</span>
        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
          className="shrink-0"
        >
          <ChevronRight
            className="h-3.5 w-3.5"
            style={{ color: "var(--sidebar-dark-text)" }}
          />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`submenu-${item.id}`}
            key="submenu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
            role="list"
          >
            <div
              className="ml-[23px] mt-0.5 flex flex-col gap-0.5 border-l pb-1 pl-2.5"
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
                    depth={2}
                  />
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// 메뉴 목록
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
  const visible = menus
    .filter((m) => m.use && m.show)
    .sort((a, b) => a.sortNo - b.sortNo);

  return (
    <nav
      aria-label="사이드바 메뉴"
      className={cn(
        "flex flex-col gap-0.5",
        isCollapsed ? "items-center px-[10px]" : "px-2"
      )}
    >
      {visible.map((item, idx) => (
        <React.Fragment key={item.id}>
          {isCollapsed && idx > 0 && item.depth === 1 && (
            <div
              className="my-1 w-6"
              style={{ borderTop: "1px solid var(--sidebar-dark-border)" }}
            />
          )}
          <SidebarMenuItem
            item={item}
            isCollapsed={isCollapsed}
            pathname={pathname}
          />
        </React.Fragment>
      ))}
    </nav>
  );
}

// ============================================================================
// 로고
// ============================================================================

function SidebarLogo({ isCollapsed }: { isCollapsed: boolean }): React.JSX.Element {
  return (
    <div
      className={cn(
        "flex h-14 shrink-0 items-center",
        isCollapsed ? "justify-center px-2" : "gap-3 px-4"
      )}
      style={{ borderBottom: "1px solid var(--sidebar-dark-border)" }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#0064FF] to-[#4B90FF] shadow-lg shadow-blue-900/40">
            <Zap className="h-[14px] w-[14px] text-white" />
          </div>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right" sideOffset={12}>
            INSITE BEMS
          </TooltipContent>
        )}
      </Tooltip>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="flex min-w-0 flex-col"
          >
            <span className="font-display text-[15px] font-bold leading-none tracking-wide text-slate-800 dark:text-white/95">
              INSITE
            </span>
            <span className="mt-[3px] text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400/80 dark:text-white/30">
              BEMS Platform
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// 하단 사용자 영역
// ============================================================================

function SidebarFooter({
  isCollapsed,
  isPinned,
  user,
  onLogout,
  onPinToggle,
}: {
  isCollapsed: boolean;
  isPinned: boolean;
  user: { userName?: string; accountName?: string } | null;
  onLogout: () => void;
  onPinToggle: () => void;
}): React.JSX.Element {
  const initial = user?.userName?.charAt(0) ?? "U";

  return (
    <div
      className="shrink-0"
      style={{ borderTop: "1px solid var(--sidebar-dark-border)" }}
    >
      {/* 사용자 정보 (확장 시만) */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="flex items-center justify-between px-3 py-2.5"
          >
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0064FF] to-[#4B90FF]">
                <span className="text-[11px] font-bold text-white">{initial}</span>
              </div>
              <div className="flex min-w-0 flex-col">
                <span
                  className="truncate text-[12.5px] font-semibold leading-none"
                  style={{ color: "var(--sidebar-dark-text-active)" }}
                >
                  {user?.userName ?? "사용자"}
                </span>
                <span
                  className="mt-[3px] truncate text-[10px] leading-none"
                  style={{ color: "var(--sidebar-dark-text)" }}
                >
                  {user?.accountName ?? ""}
                </span>
              </div>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onLogout}
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                    "transition-colors duration-150",
                    "hover:bg-[var(--sidebar-dark-hover)] hover:text-[var(--sidebar-dark-text-active)]"
                  )}
                  style={{ color: "var(--sidebar-dark-text)" }}
                  aria-label="로그아웃"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={12}>
                로그아웃
              </TooltipContent>
            </Tooltip>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 핀 토글 */}
      <div className={cn("px-2 pb-2.5", isCollapsed ? "pt-2" : "pt-0")}>
        {isCollapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onPinToggle}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg",
                  "transition-colors duration-150",
                  "hover:bg-[var(--sidebar-dark-hover)]"
                )}
                style={{ color: "var(--sidebar-dark-text)" }}
                aria-label="사이드바 고정"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={12}>
              사이드바 고정
            </TooltipContent>
          </Tooltip>
        ) : (
          <button
            onClick={onPinToggle}
            className={cn(
              "flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5",
              "text-[12px] transition-colors duration-150",
              "hover:bg-[var(--sidebar-dark-hover)]"
            )}
            style={{ color: "var(--sidebar-dark-text)" }}
            aria-label={isPinned ? "사이드바 고정 해제" : "사이드바 고정"}
          >
            {isPinned ? (
              <PinOff className="h-3.5 w-3.5 shrink-0" />
            ) : (
              <Pin className="h-3.5 w-3.5 shrink-0" />
            )}
            <span>{isPinned ? "고정 해제" : "사이드바 고정"}</span>
            <ChevronLeft className="ml-auto h-3.5 w-3.5 shrink-0" />
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 사이드바 메인
// ============================================================================

/**
 * 다크 프로페셔널 사이드바 (SNB)
 * - 테마 무관 항상 다크 네이비 (#0F1623)
 * - 260px 확장 / 64px 축소, 스프링 애니메이션
 * - 백엔드 API 메뉴 동적 로딩 (실패 시 폴백)
 * - AnimatePresence 서브메뉴 슬라이드
 * - CSS 변수 기반 hover (inline 핸들러 없음)
 */
export function Sidebar(): React.JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarMode, sidebarWidth, pinSidebar, unpinSidebar } = useUIStore();
  const { user, clearAuth } = useAuthStore();

  const isCollapsed = sidebarMode === "closed";
  const isPinned = sidebarMode === "pinned";

  const handleLogout = async (): Promise<void> => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // API 실패해도 클라이언트 상태 정리
    } finally {
      clearAuth();
      router.push("/login");
    }
  };

  // 메뉴 데이터
  const buildingId = user?.currentBuildingId;
  const { data: menuData, isLoading } = useMenuTree(buildingId);

  const allMenus =
    !isLoading && menuData && menuData.length > 0 ? menuData : FALLBACK_MENUS;

  // 전체 메뉴 사용 (섹션 필터링 없음)
  const menus = allMenus;

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        animate={{ width: isCollapsed ? 64 : sidebarWidth }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className={cn(
          "fixed left-0 top-14 z-[var(--z-sticky)]",
          "flex h-[calc(100vh-56px)] flex-col overflow-hidden"
        )}
        style={{
          backgroundColor: "var(--sidebar-dark-bg)",
          borderRight: "1px solid var(--sidebar-dark-border)",
        }}
        aria-label="메인 내비게이션"
      >
        {/* 로고 */}
        <SidebarLogo isCollapsed={isCollapsed} />

        {/* 메뉴 */}
        <ScrollArea className="h-full flex-1">
          <div className="py-2 pb-4">
            {isLoading ? (
              <MenuSkeleton />
            ) : (
              <MenuList menus={menus} isCollapsed={isCollapsed} pathname={pathname} />
            )}
          </div>
        </ScrollArea>

        {/* 하단 */}
        <SidebarFooter
          isCollapsed={isCollapsed}
          isPinned={isPinned}
          user={user}
          onLogout={() => void handleLogout()}
          onPinToggle={isPinned ? unpinSidebar : pinSidebar}
        />
      </motion.aside>
    </TooltipProvider>
  );
}
