"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Menu,
  Search,
  Sun,
  Moon,
  User,
  LogOut,
  Settings,
  Building2,
  ChevronDown,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUIStore } from "@/lib/stores/ui-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useTenantStore } from "@/lib/stores/tenant-store";
import { useUserBuildings, useAdminBuildings } from "@/lib/hooks/use-buildings";
import type { CommonListDTO } from "@/lib/api/building";
import { NotificationPanel } from "./notification-panel";
import { cn } from "@/lib/utils";

// ============================================================================
// 타입 / 상수
// ============================================================================

interface HeaderProps {
  onMobileMenuClick?: () => void;
}

interface GnbSection {
  id: string;
  label: string;
  href: string;
  prefixes: string[];
  disabled?: boolean;
}

const GNB_SECTIONS: readonly GnbSection[] = [
  { id: "dashboard", label: "대시보드", href: "/dashboard", prefixes: ["/dashboard"] },
  {
    id: "fms",
    label: "FMS",
    href: "/work-orders",
    prefixes: [
      "/work-orders", "/facilities", "/patrols", "/fieldwork", "/analysis",
      "/reports", "/boards", "/materials", "/licenses", "/mypage", "/users", "/clients",
    ],
  },
  { id: "bems", label: "BEMS", href: "/bems", prefixes: ["/bems"], disabled: true },
  { id: "becm", label: "BECM", href: "/becm", prefixes: ["/becm"], disabled: true },
  { id: "settings", label: "설정", href: "/settings", prefixes: ["/settings"] },
] as const;

// ============================================================================
// 서브 컴포넌트: 빌딩 셀렉터
// ============================================================================

const ADMIN_ROLES = ["ROLE_LABS_SYSTEM_ADMIN", "ROLE_SYSTEM_ADMIN"] as const;

function BuildingSelector(): React.JSX.Element {
  const { user, setAuth } = useAuthStore();
  const { currentBuilding, currentCompany, setContext } = useTenantStore();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = React.useState("");

  const isAdmin = user?.userRoles.some((r) => ADMIN_ROLES.includes(r as typeof ADMIN_ROLES[number])) ?? false;
  const isViewingAll = currentBuilding?.id === "0";

  // 관리자: 전체 빌딩 목록 / 일반: 배정된 빌딩 목록
  const { buildings: userBuildings } = useUserBuildings(isAdmin ? undefined : user?.userId);
  const { buildings: adminBuildings } = useAdminBuildings(isAdmin);

  // 통합 빌딩 목록 (공통 표시 형태로 변환)
  const allBuildings: Array<{ buildingId: number; buildingName: string }> = isAdmin
    ? adminBuildings.map((b: CommonListDTO) => ({
        buildingId: b.buildingId,
        buildingName: b.buildingName,
      }))
    : userBuildings;

  // 검색어 필터링
  const buildings = searchQuery.trim()
    ? allBuildings.filter((b) =>
        b.buildingName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allBuildings;

  // 관리자 전용 - 전체 빌딩 보기 (토큰 갱신 없이 컨텍스트만 초기화)
  const handleViewAll = (): void => {
    setContext(
      { id: currentCompany?.id ?? "", name: currentCompany?.name ?? "" },
      { id: "0", name: "전체 빌딩" }
    );
    void queryClient.invalidateQueries();
  };

  // 특정 빌딩 전환 - 토큰 갱신 후 캐시 무효화
  const handleBuildingSwitch = async (buildingId: number, buildingName: string): Promise<void> => {
    try {
      const response = await fetch("/api/auth/token", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buildingId }),
        credentials: "include",
      });

      if (!response.ok) {
        // 토큰 갱신 실패 - 컨텍스트만 변경 (폴백)
        setContext(
          { id: currentCompany?.id ?? "", name: currentCompany?.name ?? "" },
          { id: String(buildingId), name: buildingName }
        );
        return;
      }

      const data = await response.json();

      if (data.accessToken && data.user) {
        setAuth(data.accessToken, data.user);
      }
      setContext(
        { id: currentCompany?.id ?? "", name: currentCompany?.name ?? "" },
        { id: String(buildingId), name: buildingName }
      );
    } catch {
      // 네트워크 오류 - 컨텍스트만 변경 (폴백)
      setContext(
        { id: currentCompany?.id ?? "", name: currentCompany?.name ?? "" },
        { id: String(buildingId), name: buildingName }
      );
    } finally {
      // 빌딩 전환 후 전체 캐시 무효화
      await queryClient.invalidateQueries();
    }
  };

  return (
    <DropdownMenu onOpenChange={(open) => { if (!open) setSearchQuery(""); }}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex h-9 items-center gap-2 rounded-lg px-2.5",
            "transition-colors duration-150 hover:bg-accent",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
          aria-label="빌딩 전환"
        >
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10">
            <Building2 className="h-3.5 w-3.5 text-primary" />
          </div>
          <div className="hidden flex-col items-start sm:flex">
            <span className="text-[10px] leading-none text-muted-foreground">
              {currentCompany?.name ?? "회사"}
            </span>
            <span className="mt-[3px] text-[13px] font-semibold leading-none text-foreground">
              {currentBuilding?.name ?? "빌딩 선택"}
            </span>
          </div>
          <ChevronDown className="hidden h-3 w-3 text-muted-foreground/60 sm:block" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-64 z-[150]"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DropdownMenuLabel className="pb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          빌딩 전환
        </DropdownMenuLabel>

        {/* 빌딩 검색 */}
        <div className="px-2 pb-1.5">
          <div className="flex items-center gap-1.5 rounded-md border border-border/60 bg-muted/40 px-2 py-1.5">
            <Search className="h-3 w-3 shrink-0 text-muted-foreground" />
            <input
              className="flex-1 bg-transparent text-[12px] outline-none placeholder:text-muted-foreground/60"
              placeholder="빌딩 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
            />
            {searchQuery && (
              <button
                className="text-muted-foreground/60 hover:text-muted-foreground"
                onClick={() => setSearchQuery("")}
                aria-label="검색어 지우기"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* 관리자 전용: 전체 빌딩 보기 */}
        {isAdmin && (
          <>
            <DropdownMenuItem className="gap-2.5" onClick={handleViewAll}>
              <div
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
                  isViewingAll ? "bg-primary/15" : "bg-muted"
                )}
              >
                <Building2
                  className={cn(
                    "h-3.5 w-3.5",
                    isViewingAll ? "text-primary" : "text-muted-foreground"
                  )}
                />
              </div>
              <span className={cn("flex-1 text-[13px]", isViewingAll && "font-semibold")}>
                전체 빌딩
              </span>
              {isViewingAll && <Check className="h-3.5 w-3.5 text-primary" />}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <div className="max-h-[280px] overflow-y-auto">
          {buildings.length > 0 ? (
            buildings.map((b) => {
              const isActive = !isViewingAll && currentBuilding?.id === String(b.buildingId);
              return (
                <DropdownMenuItem
                  key={b.buildingId}
                  className="gap-2.5"
                  onClick={() => void handleBuildingSwitch(b.buildingId, b.buildingName)}
                >
                  <div
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
                      isActive ? "bg-primary/15" : "bg-muted"
                    )}
                  >
                    <Building2
                      className={cn(
                        "h-3.5 w-3.5",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                  </div>
                  <span className={cn("flex-1 text-[13px]", isActive && "font-semibold")}>
                    {b.buildingName}
                  </span>
                  {isActive && <Check className="h-3.5 w-3.5 text-primary" />}
                </DropdownMenuItem>
              );
            })
          ) : (
            <DropdownMenuItem disabled className="text-xs text-muted-foreground">
              배정된 빌딩이 없습니다
            </DropdownMenuItem>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================================================
// 서브 컴포넌트: GNB 탭 (슬라이딩 pill)
// ============================================================================

function GnbTabs({ activeSection }: { activeSection: string }): React.JSX.Element {
  // framer-motion layoutId는 SSR에서 렌더링 시 hydration 불일치 유발 → 마운트 후에만 표시
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);

  return (
    <nav
      aria-label="주요 메뉴"
      className="hidden flex-1 items-center justify-center md:flex"
    >
      {/* pill 컨테이너 */}
      <div className="flex items-center gap-0.5 rounded-xl bg-black/[0.04] p-0.5 dark:bg-white/[0.06]">
        {GNB_SECTIONS.map((section) => {
          const isActive = activeSection === section.id;

          if (section.disabled) {
            return (
              <span
                key={section.id}
                className="cursor-not-allowed select-none rounded-lg px-3.5 py-1.5 text-[13px] font-medium opacity-30"
              >
                {section.label}
              </span>
            );
          }

          return (
            <Link
              key={section.id}
              href={section.href}
              className={cn(
                "relative rounded-lg px-3.5 py-1.5 text-[13px] font-medium",
                "transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && mounted && (
                <motion.div
                  layoutId="gnb-active-pill"
                  className="absolute inset-0 rounded-lg bg-background shadow-[var(--shadow-card)] dark:bg-[var(--panel-20)]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative">{section.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// ============================================================================
// 서브 컴포넌트: 사용자 드롭다운
// ============================================================================

function UserDropdown({
  user,
  onLogout,
}: {
  user: { userName?: string; accountName?: string } | null;
  onLogout: () => void;
}): React.JSX.Element {
  const initial = user?.userName?.charAt(0) ?? "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex h-[30px] w-[30px] items-center justify-center rounded-full",
            "bg-gradient-to-br from-[#0064FF] to-[#4B90FF]",
            "ring-2 ring-background transition-opacity duration-150 hover:opacity-90",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
          )}
          aria-label="사용자 메뉴"
        >
          <span className="text-[11px] font-bold text-white">{initial}</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 z-[150]">
        <DropdownMenuLabel className="py-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0064FF] to-[#4B90FF]">
              <span className="text-[12px] font-bold text-white">{initial}</span>
            </div>
            <div className="flex flex-col gap-[2px]">
              <span className="text-[13px] font-semibold leading-none">
                {user?.userName ?? "사용자"}
              </span>
              <span className="text-[11px] leading-none text-muted-foreground">
                {user?.accountName ?? ""}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="gap-2.5 text-[13px]" asChild>
          <Link href="/mypage">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            마이페이지
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2.5 text-[13px]" asChild>
          <Link href="/settings">
            <Settings className="h-3.5 w-3.5 text-muted-foreground" />
            설정
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="gap-2.5 text-[13px] text-destructive focus:bg-destructive/10 focus:text-destructive"
          onClick={onLogout}
        >
          <LogOut className="h-3.5 w-3.5" />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================================================
// 헤더 메인
// ============================================================================

/**
 * 글로벌 네비게이션 바 (GNB)
 * - 56px 고정 높이, 글래스모피즘 배경
 * - 좌: 사이드바 토글 + 빌딩 셀렉터
 * - 중: 슬라이딩 pill GNB 탭 (framer-motion layoutId)
 * - 우: 검색(⌘K), 알림, 테마, 사용자
 */
export function Header({ onMobileMenuClick }: HeaderProps): React.JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const { toggleSidebar, setCommandPaletteOpen } = useUIStore();
  const { user, clearAuth } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => { setMounted(true); }, []);

  // ⌘K 단축키
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [setCommandPaletteOpen]);

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

  const activeSection =
    GNB_SECTIONS.find((s) => s.prefixes.some((p) => pathname.startsWith(p)))?.id ??
    "dashboard";

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-[var(--z-sticky)]",
        "flex h-14 items-center justify-between gap-2 px-3",
        "border-b border-border/60",
        "bg-[var(--bg-header-upgrade)] [backdrop-filter:var(--backdrop-header)]"
      )}
    >
      {/* ── 좌측 ── */}
      <div className="flex shrink-0 items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileMenuClick ?? toggleSidebar}
          className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden"
          aria-label="메뉴 열기"
        >
          <Menu className="h-[17px] w-[17px]" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hidden h-8 w-8 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground lg:flex"
          aria-label="사이드바 토글"
        >
          <Menu className="h-[17px] w-[17px]" />
        </Button>

        <BuildingSelector />
      </div>

      {/* ── 중앙: GNB 탭 ── */}
      <GnbTabs activeSection={activeSection} />

      {/* ── 우측 ── */}
      <div className="flex shrink-0 items-center gap-0.5">
        {/* 검색 버튼 */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className={cn(
            "hidden h-8 items-center gap-2 rounded-lg border border-border/70 px-2.5",
            "text-[12px] text-muted-foreground transition-all duration-150",
            "hover:border-border hover:bg-accent hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "sm:flex"
          )}
          aria-label="검색 (⌘K)"
        >
          <Search className="h-[13px] w-[13px]" />
          <span>검색</span>
          <kbd className="hidden rounded bg-muted px-1 py-px text-[10px] font-medium leading-none lg:block">
            ⌘K
          </kbd>
        </button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground sm:hidden"
          onClick={() => setCommandPaletteOpen(true)}
          aria-label="검색"
        >
          <Search className="h-[17px] w-[17px]" />
        </Button>

        {/* 알림 */}
        <NotificationPanel />

        {/* 테마 토글 */}
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? "라이트 모드" : "다크 모드"}
          >
            {theme === "dark" ? (
              <Sun className="h-[17px] w-[17px]" />
            ) : (
              <Moon className="h-[17px] w-[17px]" />
            )}
          </Button>
        )}

        {/* 사용자 */}
        <div className="ml-1">
          <UserDropdown user={user} onLogout={() => void handleLogout()} />
        </div>
      </div>
    </header>
  );
}
