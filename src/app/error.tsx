"use client";

import { useEffect, type ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * 전역 에러 바운더리
 * - 렌더링 중 발생한 에러 처리
 * - 에러 복구 및 홈으로 이동 옵션 제공
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): ReactNode {
  useEffect(() => {
    // 에러 로깅 (향후 Sentry 연동)
    console.error("렌더링 에러:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* 에러 아이콘 */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>

        {/* 에러 메시지 */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            오류가 발생했습니다
          </h1>
          <p className="text-muted-foreground">
            페이지를 표시하는 중 문제가 발생했습니다.
            <br />
            잠시 후 다시 시도해 주세요.
          </p>
        </div>

        {/* 에러 상세 (개발 환경에서만) */}
        {process.env.NODE_ENV === "development" && (
          <div className="rounded-lg bg-muted p-4 text-left">
            <p className="text-sm font-mono text-muted-foreground break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="mt-2 text-xs text-muted-foreground">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} variant="default" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            다시 시도
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            홈으로 이동
          </Button>
        </div>
      </div>
    </div>
  );
}
