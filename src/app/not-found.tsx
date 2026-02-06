"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * 404 페이지
 */
export default function NotFound(): ReactNode {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* 404 아이콘 */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <FileQuestion className="h-10 w-10 text-muted-foreground" />
        </div>

        {/* 메시지 */}
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-foreground">404</h1>
          <h2 className="text-xl font-semibold text-foreground">
            페이지를 찾을 수 없습니다
          </h2>
          <p className="text-muted-foreground">
            요청하신 페이지가 존재하지 않거나 이동되었습니다.
          </p>
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild variant="default" className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              홈으로 이동
            </Link>
          </Button>
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            이전 페이지
          </Button>
        </div>
      </div>
    </div>
  );
}
