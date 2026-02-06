"use client";

import { useCallback, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  FileText,
  Settings,
  User,
  Building2,
  Wrench,
  BarChart3,
  Search,
  LogOut,
  Moon,
  Sun,
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

interface CommandItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  action: () => void;
}

interface CommandGroup {
  heading: string;
  items: CommandItem[];
}

/**
 * Command Palette 컴포넌트
 * - Cmd+K (Mac) / Ctrl+K (Windows)로 열기
 * - 페이지 이동, 설정, 테마 변경 등
 */
export function CommandPalette(): ReactNode {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const { clearAuth } = useAuthStore();

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

  const commandGroups: CommandGroup[] = [
    {
      heading: "빠른 이동",
      items: [
        {
          id: "home",
          label: "홈",
          icon: Home,
          action: () => router.push("/"),
        },
        {
          id: "work-orders",
          label: "작업 목록",
          icon: Wrench,
          action: () => router.push("/work-orders"),
        },
        {
          id: "facilities",
          label: "시설 관리",
          icon: Building2,
          action: () => router.push("/facilities"),
        },
        {
          id: "dashboard",
          label: "대시보드",
          icon: BarChart3,
          action: () => router.push("/dashboard"),
        },
        {
          id: "reports",
          label: "보고서",
          icon: FileText,
          action: () => router.push("/reports"),
        },
      ],
    },
    {
      heading: "설정",
      items: [
        {
          id: "profile",
          label: "프로필",
          icon: User,
          action: () => router.push("/settings/profile"),
        },
        {
          id: "settings",
          label: "환경설정",
          icon: Settings,
          action: () => router.push("/settings"),
        },
        {
          id: "theme-toggle",
          label: theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환",
          icon: theme === "dark" ? Sun : Moon,
          action: () => setTheme(theme === "dark" ? "light" : "dark"),
        },
      ],
    },
    {
      heading: "계정",
      items: [
        {
          id: "logout",
          label: "로그아웃",
          icon: LogOut,
          action: handleLogout,
        },
      ],
    },
  ];

  return (
    <CommandDialog open={isCommandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <CommandInput placeholder="명령어 또는 페이지 검색..." />
      <CommandList>
        <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>

        {commandGroups.map((group, groupIndex) => (
          <div key={group.heading}>
            {groupIndex > 0 && <CommandSeparator />}
            <CommandGroup heading={group.heading}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => runCommand(item.action)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.label}</span>
                  {item.shortcut && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      {item.shortcut}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
