"use client";

import { useRouter } from "next/navigation";
import { useQuestion } from "@/lib/hooks/use-qna";
import { PageHeader } from "@/components/common/page-header";
import { InfoPanel } from "@/components/data-display/info-panel";
import { StatusBadge } from "@/components/data-display/status-badge";
import { EmptyState } from "@/components/data-display/empty-state";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { QnaStateLabel, QnaStateStyle, type QnaState } from "@/lib/types/qna";

// ============================================================================
// BackButton (Client Component)
// ============================================================================

function BackButton() {
  const router = useRouter();
  return (
    <Button variant="ghost" size="sm" onClick={() => router.back()}>
      ← 목록으로
    </Button>
  );
}

// ============================================================================
// 상세 페이지
// ============================================================================

export default function QnaDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  const router = useRouter();
  const { data: question, isLoading, isError, refetch } = useQuestion(id);

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

  if (!question) {
    return (
      <EmptyState
        title="질문을 찾을 수 없습니다"
        description="존재하지 않는 질문입니다."
        action={{
          label: "목록으로",
          onClick: () => router.push("/support/qna"),
        }}
      />
    );
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={question.title}
        actions={<BackButton />}
      />

      <InfoPanel
        items={[
          {
            label: "상태",
            value: (
              <StatusBadge
                status={QnaStateStyle[question.state as QnaState]}
                label={QnaStateLabel[question.state as QnaState]}
              />
            ),
          },
          { label: "작성자", value: question.authorName },
          { label: "등록일", value: question.createdAt },
          ...(question.answeredAt
            ? [{ label: "답변일", value: question.answeredAt }]
            : []),
        ]}
      />

      {/* 질문 내용 */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="mb-4 text-base font-semibold">질문</h3>
        <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground">
          {question.content}
        </div>
      </div>

      {/* 답변 내용 */}
      {question.answer && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950">
          <h3 className="mb-4 text-base font-semibold">답변</h3>
          <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground">
            {question.answer}
          </div>
        </div>
      )}
    </div>
  );
}
