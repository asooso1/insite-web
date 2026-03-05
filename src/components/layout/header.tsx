"use client";

import * as React from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  User,
  LogOut,
  Settings,
  Building2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUIStore } from "@/lib/stores/ui-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useTenantStore } from "@/lib/stores/tenant-store";
import { cn } from "@/lib/utils";

interface HeaderProps {
  /** 모바일에서 햄버거 클릭 시 콜백 (MobileDrawer 열기용) */
  onMobileMenuClick?: () => void;
}

/**
 * 프리미엄 글래스모피즘 헤더
 * - 52px 고정 높이
 * - 배경 블러 + 그라데이션 하단 라인
 * - 빌딩 컨텍스트, 글래스 검색바, 알림, 테마, 아바타 드롭다운
 */
export function Header({ onMobileMenuClick }: HeaderProps): React.JSX.Element {
  const { toggleSidebar, setCommandPaletteOpen } = useUIStore();
  const { user, clearAuth } = useAuthStore();
  const { currentBuilding, currentCompany } = useTenantStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // 스크롤 기반 애니메이션
  const { scrollY } = useScroll();
  const shadowOpacity = useTransform(scrollY, [0, 50], [0, 1]);
  const shadowValue = useMotionTemplate`0 1px 3px rgba(0,0,0,${useTransform(
    shadowOpacity,
    (v) => v * 0.1
  )}), 0 1px 2px rgba(0,0,0,${useTransform(shadowOpacity, (v) => v * 0.06)})`;

  // 하이드레이션 문제 방지
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // CMD+K / CTRL+K 단축키
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setCommandPaletteOpen]);

  /** 사용자 이니셜 (첫 글자) */
  const userInitial = user?.userName?.charAt(0) ?? "U";

  return (
    <motion.header
      className={cn(
        "fixed left-0 right-0 top-0 z-[var(--z-sticky)]",
        "flex h-[52px] items-center justify-between",
        "bg-[var(--bg-header-upgrade)] [backdrop-filter:var(--backdrop-header)]",
        "px-4"
      )}
      style={{
        boxShadow: shadowValue,
      }}
    >
      {/* 하단 그라데이션 라인 */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, var(--border) 20%, var(--border) 80%, transparent 100%)",
        }}
      />

      {/* 좌측: 메뉴 토글 + 빌딩 컨텍스트 */}
      <div className="flex items-center gap-3">
        {/* 사이드바 토글 (모바일/태블릿: 드로어 열기) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileMenuClick ?? toggleSidebar}
          className="h-8 w-8 rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
          aria-label="메뉴 열기"
        >
          <Menu className="h-[18px] w-[18px]" />
        </Button>
        {/* 사이드바 토글 (데스크톱) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hidden h-8 w-8 rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:flex"
          aria-label="사이드바 토글"
        >
          <Menu className="h-[18px] w-[18px]" />
        </Button>

        {/* 빌딩 컨텍스트 드롭다운 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-9 items-center gap-2 rounded-lg px-2.5 text-sm transition-colors hover:bg-accent"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10">
                <Building2 className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="hidden flex-col items-start text-left sm:flex">
                <span className="text-[11px] leading-tight text-muted-foreground">
                  {currentCompany?.name ?? "회사 선택"}
                </span>
                <span className="text-[13px] font-semibold leading-tight">
                  {currentBuilding?.name ?? "빌딩 선택"}
                </span>
              </div>
              <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-72">
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              현재 빌딩
            </DropdownMenuLabel>
            <DropdownMenuItem className="flex flex-col items-start gap-0.5 py-2">
              <span className="font-medium">
                {currentBuilding?.name ?? "빌딩 미선택"}
              </span>
              <span className="text-xs text-muted-foreground">
                {currentCompany?.name ?? ""}
              </span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-xs text-muted-foreground"
              disabled
            >
              빌딩 전환 기능 준비 중
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 중앙: 검색 바 (데스크톱) */}
      <div className="hidden flex-1 justify-center px-8 md:flex">
        <Button
          variant="outline"
          className={cn(
            "h-8 w-full max-w-md justify-start gap-2 rounded-lg",
            "border-border/50 bg-accent/50 text-muted-foreground",
            "transition-all hover:border-border hover:bg-accent"
          )}
          onClick={() => setCommandPaletteOpen(true)}
        >
          <Search className="h-3.5 w-3.5" />
          <span className="text-[13px]">검색...</span>
          <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-0.5 rounded border border-border/70 bg-background/80 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-[11px]">⌘</span>K
          </kbd>
        </Button>
      </div>

      {/* 우측: 검색(모바일), 알림, 테마, 사용자 */}
      <div className="flex items-center gap-1">
        {/* 모바일 검색 */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground md:hidden"
          onClick={() => setCommandPaletteOpen(true)}
          aria-label="검색"
        >
          <Search className="h-[18px] w-[18px]" />
        </Button>

        {/* 알림 (TODO: 알림 API 연동 후 뱃지 활성화) */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="알림"
        >
          <Bell className="h-[18px] w-[18px]" />
        </Button>

        {/* 테마 토글 */}
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="테마 변경"
          >
            {theme === "dark" ? (
              <Sun className="h-[18px] w-[18px]" />
            ) : (
              <Moon className="h-[18px] w-[18px]" />
            )}
          </Button>
        )}

        {/* 사용자 아바타 드롭다운 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="ml-1 h-8 w-8 rounded-full p-0"
              aria-label="사용자 메뉴"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#0064FF] to-[#4B90FF] ring-2 ring-background">
                <span className="text-[12px] font-semibold text-white">
                  {userInitial}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold">
                  {user?.userName ?? "사용자"}
                </span>
                <span className="text-xs font-normal text-muted-foreground">
                  {user?.accountName ?? "계정"}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2">
              <User className="h-4 w-4" />
              마이페이지
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Settings className="h-4 w-4" />
              설정
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-destructive focus:text-destructive"
              onClick={() => clearAuth()}
            >
              <LogOut className="h-4 w-4" />
              로그아웃
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
}
