"use client";

import * as React from "react";
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
 * 헤더 컴포넌트
 * - 52px 고정 높이
 * - Desktop: 사이드바 토글 | Mobile/Tablet: 드로어 열기
 * - 빌딩 컨텍스트, 검색, 알림, 테마, 사용자 메뉴
 */
export function Header({ onMobileMenuClick }: HeaderProps): React.JSX.Element {
  const { toggleSidebar, setCommandPaletteOpen } = useUIStore();
  const { user } = useAuthStore();
  const { currentBuilding, currentCompany } = useTenantStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

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

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-[var(--z-sticky)]",
        "flex h-[52px] items-center justify-between",
        "border-b border-border bg-[var(--bg-header)] backdrop-blur-sm",
        "px-4"
      )}
    >
      {/* 좌측: 메뉴 토글 + 빌딩 컨텍스트 */}
      <div className="flex items-center gap-4">
        {/* 사이드바 토글 (데스크톱: 사이드바 접기, 모바일/태블릿: 드로어 열기) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileMenuClick ?? toggleSidebar}
          className="h-8 w-8 lg:hidden"
          aria-label="메뉴 열기"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">메뉴 열기</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hidden h-8 w-8 lg:flex"
          aria-label="사이드바 토글"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">사이드바 토글</span>
        </Button>

        {/* 빌딩 컨텍스트 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-col items-start text-left">
                <span className="text-xs text-muted-foreground">
                  {currentCompany?.name ?? "회사 선택"}
                </span>
                <span className="text-sm font-medium">
                  {currentBuilding?.name ?? "빌딩 선택"}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuLabel>빌딩 선택</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>빌딩 목록 불러오기...</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 우측: 검색, 알림, 테마, 사용자 메뉴 */}
      <div className="flex items-center gap-2">
        {/* 검색 버튼 (Command Palette 트리거) */}
        <Button
          variant="outline"
          className="hidden h-8 w-64 justify-start text-muted-foreground md:flex"
          onClick={() => setCommandPaletteOpen(true)}
        >
          <Search className="mr-2 h-4 w-4" />
          <span>검색...</span>
          <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>

        {/* 모바일 검색 버튼 */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 md:hidden"
          onClick={() => setCommandPaletteOpen(true)}
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">검색</span>
        </Button>

        {/* 알림 */}
        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
          <span className="sr-only">알림</span>
        </Button>

        {/* 테마 토글 */}
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">테마 변경</span>
          </Button>
        )}

        {/* 사용자 메뉴 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <User className="h-5 w-5" />
              <span className="sr-only">사용자 메뉴</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user?.userName ?? "사용자"}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {user?.accountName ?? "계정"}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              마이페이지
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              설정
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              로그아웃
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
