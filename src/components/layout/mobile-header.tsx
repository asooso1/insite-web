"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, Search, Building2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTenantStore } from "@/lib/stores/tenant-store";
import { cn } from "@/lib/utils";

interface MobileHeaderProps {
  /** 상단 타이틀 (없으면 빌딩 컨텍스트 표시) */
  title?: string;
  /** 뒤로가기 버튼 표시 여부 */
  showBack?: boolean;
  /** 추가 우측 액션 */
  rightActions?: React.ReactNode;
}

/**
 * 모바일 전용 헤더
 * - 52px 고정 높이
 * - 뒤로가기 / 타이틀 / 빌딩 컨텍스트 / 알림 / 검색
 */
export function MobileHeader({
  title,
  showBack = false,
  rightActions,
}: MobileHeaderProps): React.JSX.Element {
  const router = useRouter();
  const { currentBuilding, currentCompany } = useTenantStore();

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50",
        "flex h-[52px] items-center justify-between",
        "border-b border-border bg-background/95 backdrop-blur-sm",
        "px-4"
      )}
    >
      {/* 좌측 */}
      <div className="flex items-center gap-2">
        {showBack ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">뒤로가기</span>
          </Button>
        ) : null}

        {title ? (
          <h1 className="text-base font-semibold">{title}</h1>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex h-auto items-center gap-1.5 px-1 py-1"
              >
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col items-start text-left">
                  <span className="text-[10px] leading-none text-muted-foreground">
                    {currentCompany?.name ?? "회사 선택"}
                  </span>
                  <span className="text-sm font-medium leading-snug">
                    {currentBuilding?.name ?? "빌딩 선택"}
                  </span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-60">
              <DropdownMenuLabel>빌딩 선택</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>빌딩 목록 불러오기...</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* 우측 */}
      <div className="flex items-center gap-1">
        {rightActions}
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Search className="h-5 w-5" />
          <span className="sr-only">검색</span>
        </Button>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
          <span className="sr-only">알림</span>
        </Button>
      </div>
    </header>
  );
}
