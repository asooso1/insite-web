"use client";

import { use } from "react";
import { CalendarClock, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/data-display/empty-state";
import { useTbmView } from "@/lib/hooks/use-tbms";
import { TbmForm } from "../../_components/tbm-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default function TbmEditPage({ params }: Props) {
  const { id } = use(params);
  const tbmId = Number(id);

  const { data: tbm, isLoading, isError } = useTbmView(tbmId);

  if (isLoading) {
    return <div className="p-6 text-muted-foreground">불러오는 중...</div>;
  }

  if (isError || !tbm) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="TBM을 불러올 수 없습니다"
        description="잠시 후 다시 시도해주세요."
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="TBM 수정"
        description="작업전미팅 정보를 수정합니다."
        icon={CalendarClock}
      />
      <TbmForm mode="edit" initialData={tbm} />
    </div>
  );
}
