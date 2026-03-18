"use client";

import { useRouter } from "next/navigation";
import { usePrivacyPolicy } from "@/lib/hooks/use-privacy";
import { EmptyState } from "@/components/data-display/empty-state";
import { Button } from "@/components/ui/button";
import { AlertCircle, Edit } from "lucide-react";

// ============================================================================
// 개인정보정책 조회 페이지
// ============================================================================

export default function PrivacyPage() {
  const router = useRouter();
  const { data: policy, isLoading, isError, refetch } = usePrivacyPolicy();

  if (isError) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="데이터를 불러올 수 없습니다"
        description="잠시 후 다시 시도해주세요."
        action={{ label: "다시 시도", onClick: () => refetch() }}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <div className="h-8 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  if (!policy) {
    return (
      <EmptyState
        title="개인정보정책이 없습니다"
        description="등록된 개인정보정책이 없습니다."
        action={{
          label: "정책 등록",
          onClick: () => router.push("/privacy/edit"),
        }}
      />
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">개인정보정책</h1>
          <p className="text-muted-foreground">
            개인정보처리방침을 확인하고 관리합니다.
          </p>
        </div>
        <Button
          onClick={() => router.push("/privacy/edit")}
          className="gap-2"
        >
          <Edit className="h-4 w-4" />
          수정
        </Button>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold">정책 내용</h3>
          <span className="text-sm text-muted-foreground">
            적용일: {policy.effectiveDate}
          </span>
        </div>
        <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground">
          {policy.content}
        </div>
      </div>

      {policy.createdAt && (
        <div className="text-sm text-muted-foreground">
          등록일: {policy.createdAt}
        </div>
      )}
    </div>
  );
}
