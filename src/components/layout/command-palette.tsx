"use client";

import { useCallback, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
  HelpCircle,
  LayoutDashboard,
  ClipboardList,
  Building,
  Users,
  BarChart3,
  MapPin,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { useTheme } from "next-themes";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useUIStore } from "@/lib/stores/ui-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useMenuTree } from "@/lib/hooks/use-menu";
import { mapMenuUrl } from "@/lib/utils/menu-url-mapper";
import type { MenuDTO } from "@/lib/types/menu";

// ============================================================================
// 아이콘 매핑 (sidebar.tsx와 동일 패턴)
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
// 메뉴 항목 평탄화 (depth 무관하게 검색 가능하도록)
// ============================================================================

function flattenMenus(menus: MenuDTO[]): MenuDTO[] {
  return menus.flatMap((m) => {
    const visible = m.use && m.show;
    if (!visible) return [];
    const children = m.children?.length ? flattenMenus(m.children) : [];
    return [m, ...children];
  });
}

// ============================================================================
// Command Palette
// ============================================================================

/**
 * Command Palette 컴포넌트
 * - Cmd+K (Mac) / Ctrl+K (Windows)로 열기
 * - 백엔드 메뉴 API 기반 동적 페이지 이동
 * - 설정, 테마 변경, 로그아웃
 */
export function CommandPalette(): ReactNode {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const { user, clearAuth } = useAuthStore();

  const buildingId = user?.currentBuildingId;
  const { data: menuData } = useMenuTree(buildingId);
  const flatMenus = flattenMenus(menuData ?? []);

  // 단축키 핸들러
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  const runCommand = useCallback(
    (command: () => void) => {
      setCommandPaletteOpen(false);
      command();
    },
    [setCommandPaletteOpen]
  );

  const handleLogout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    clearAuth();
    router.push("/login");
  }, [clearAuth, router]);

  return (
    <CommandDialog
      open={isCommandPaletteOpen}
      onOpenChange={setCommandPaletteOpen}
    >
      <CommandInput placeholder="페이지 이동 또는 명령어 검색..." />
      <CommandList>
        <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>

        {/* 동적 메뉴 그룹 */}
        {flatMenus.length > 0 && (
          <CommandGroup heading="메뉴">
            {flatMenus.map((item) => {
              const Icon = getMenuIcon(item.icon);
              const href = mapMenuUrl(item.url);
              return (
                <CommandItem
                  key={item.id}
                  value={item.name}
                  onSelect={() => runCommand(() => router.push(href))}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{item.name}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}

        <CommandSeparator />

        {/* 설정 그룹 */}
        <CommandGroup heading="설정">
          <CommandItem
            value="프로필 마이페이지"
            onSelect={() =>
              runCommand(() => router.push("/settings/profile"))
            }
          >
            <User className="mr-2 h-4 w-4" />
            <span>마이페이지</span>
          </CommandItem>
          <CommandItem
            value="환경설정 설정"
            onSelect={() => runCommand(() => router.push("/settings"))}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>환경설정</span>
          </CommandItem>
          <CommandItem
            value="테마 다크모드 라이트모드"
            onSelect={() =>
              runCommand(() =>
                setTheme(theme === "dark" ? "light" : "dark")
              )
            }
          >
            {theme === "dark" ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            <span>
              {theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
            </span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* 계정 그룹 */}
        <CommandGroup heading="계정">
          <CommandItem
            value="로그아웃"
            onSelect={() => runCommand(handleLogout)}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>로그아웃</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
