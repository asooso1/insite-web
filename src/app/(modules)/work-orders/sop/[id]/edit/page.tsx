"use client";

import { useParams } from "next/navigation";
import { AlertCircle } from "lucide-react";

import { EmptyState } from "@/components/data-display/empty-state";
import { useSopView } from "@/lib/hooks/use-sops";
import { SopForm } from "../../_components/sop-form";

export default function EditSopPage() {
  const params = useParams();
  const id = Number(params.id);

  const { data: sop, isLoading, isError, refetch } = useSopView(id);

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (!sop) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="SOP를 찾을 수 없습니다"
        description="존재하지 않는 SOP입니다."
      />
    );
  }

  return <SopForm mode="edit" initialData={sop} sopId={id} />;
}
