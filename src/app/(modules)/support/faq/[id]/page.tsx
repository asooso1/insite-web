"use client";

import { useRouter } from "next/navigation";
import { useFaq } from "@/lib/hooks/use-faqs";
import { PageHeader } from "@/components/common/page-header";
import { InfoPanel } from "@/components/data-display/info-panel";
import { EmptyState } from "@/components/data-display/empty-state";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

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

export default function FaqDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  const router = useRouter();
  const { data: faq, isLoading, isError, refetch } = useFaq(id);

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

  if (!faq) {
    return (
      <EmptyState
        title="FAQ를 찾을 수 없습니다"
        description="존재하지 않는 FAQ입니다."
        action={{
          label: "목록으로",
          onClick: () => router.push("/support/faq"),
        }}
      />
    );
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={faq.title}
        actions={<BackButton />}
      />

      <InfoPanel
        items={[
          { label: "카테고리", value: faq.menuName },
          { label: "조회수", value: String(faq.viewCount) },
          { label: "작성자", value: faq.createdBy },
          { label: "등록일", value: faq.createdAt },
        ]}
      />

      <div className="rounded-lg border bg-card p-6">
        <h3 className="mb-4 text-base font-semibold">내용</h3>
        <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground">
          {faq.content}
        </div>
      </div>
    </div>
  );
}
