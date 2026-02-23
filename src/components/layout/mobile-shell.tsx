"use client";

import * as React from "react";
import { MobileHeader } from "./mobile-header";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { cn } from "@/lib/utils";

interface MobileShellProps {
  children: React.ReactNode;
  /** 헤더 타이틀 */
  headerTitle?: string;
  /** 뒤로가기 버튼 */
  showBack?: boolean;
  /** 하단 탭 숨김 여부 (상세 페이지 등) */
  hideBottomNav?: boolean;
  /** 헤더 우측 추가 액션 */
  headerRightActions?: React.ReactNode;
}

/**
 * 모바일 전용 셸 레이아웃
 * - 상단: MobileHeader (52px)
 * - 중간: 스크롤 가능한 컨텐츠 영역
 * - 하단: MobileBottomNav (64px) - 선택적 숨김
 */
export function MobileShell({
  children,
  headerTitle,
  showBack = false,
  hideBottomNav = false,
  headerRightActions,
}: MobileShellProps): React.JSX.Element {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      <MobileHeader
        title={headerTitle}
        showBack={showBack}
        rightActions={headerRightActions}
      />

      {/* 컨텐츠 영역: 헤더(52px) + 하단탭(64px) 제외 */}
      <main
        className={cn(
          "flex-1 overflow-y-auto overscroll-y-contain",
          "pt-[52px]",
          !hideBottomNav && "pb-16"
        )}
      >
        <div className="mx-auto max-w-lg px-4 py-4">{children}</div>
      </main>

      {!hideBottomNav && <MobileBottomNav />}
    </div>
  );
}
