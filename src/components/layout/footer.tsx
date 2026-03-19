import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const CURRENT_YEAR = new Date().getFullYear();

/**
 * 앱 푸터
 * - 메인 콘텐츠 영역 하단에 위치 (스크롤과 함께 이동)
 * - 저작권, 버전, 빠른 링크 표시
 */
export function Footer({ className }: { className?: string }): React.JSX.Element {
  return (
    <footer
      className={cn(
        "mt-8 border-t border-border/40",
        "px-0 py-4",
        className
      )}
    >
      <div className="flex flex-col items-center justify-between gap-2 text-[11px] text-muted-foreground sm:flex-row">
        {/* 저작권 */}
        <span>
          © {CURRENT_YEAR} HDC Labs. All rights reserved.
        </span>

        {/* 빠른 링크 */}
        <nav aria-label="푸터 링크" className="flex items-center gap-4">
          <Link
            href="/settings"
            className="transition-colors hover:text-foreground"
          >
            설정
          </Link>
          <Link
            href="/mypage"
            className="transition-colors hover:text-foreground"
          >
            마이페이지
          </Link>
          <span className="text-border">|</span>
          <span>insite v{process.env.NEXT_PUBLIC_APP_VERSION ?? "1.0.0"}</span>
        </nav>
      </div>
    </footer>
  );
}
