"use client";

import { useParams, useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/data-display/empty-state";

import { useReferenceDataView } from "@/lib/hooks/use-boards";
import { DataForm } from "../../../_components/data-form";

export default function DataEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { data: refData, isLoading, isError } = useReferenceDataView(id);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError || !refData) {
    return (
      <div className="p-6">
        <EmptyState
          icon={AlertCircle}
          title="자료를 찾을 수 없습니다"
          description="요청하신 자료가 존재하지 않거나 접근 권한이 없습니다."
          action={{
            label: "목록으로 돌아가기",
            onClick: () => router.push("/boards"),
          }}
        />
      </div>
    );
  }

  return <DataForm mode="edit" initialData={refData} dataId={id} />;
}
