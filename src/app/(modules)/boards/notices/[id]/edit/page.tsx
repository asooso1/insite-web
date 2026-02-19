"use client";

import { useParams, useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/data-display/empty-state";

import { useNoticeView } from "@/lib/hooks/use-boards";
import { NoticeForm } from "../../../_components/notice-form";

export default function NoticeEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { data: notice, isLoading, isError } = useNoticeView(id);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError || !notice) {
    return (
      <div className="p-6">
        <EmptyState
          icon={AlertCircle}
          title="공지사항을 찾을 수 없습니다"
          description="요청하신 공지사항이 존재하지 않거나 접근 권한이 없습니다."
          action={{
            label: "목록으로 돌아가기",
            onClick: () => router.push("/boards"),
          }}
        />
      </div>
    );
  }

  return <NoticeForm mode="edit" initialData={notice} noticeId={id} />;
}
