"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, Edit, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/data-display/status-badge";
import { EmptyState } from "@/components/data-display/empty-state";
import { useTbmView } from "@/lib/hooks/use-tbms";
import {
  TbmTypeLabel,
  TbmStateLabel,
  TbmStateStyle,
} from "@/lib/types/tbm";

interface Props {
  params: Promise<{ id: string }>;
}

export default function TbmDetailPage({ params }: Props) {
  const { id } = use(params);
  const tbmId = Number(id);
  const router = useRouter();

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
        title={tbm.name}
        description="TBM 상세 정보"
        icon={CalendarClock}
        actions={
          <Button onClick={() => router.push(`/work-orders/tbm/${tbmId}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            수정
          </Button>
        }
      />

      {/* 기본 정보 */}
      <div className="rounded-lg border p-6">
        <h2 className="mb-4 font-semibold">기본 정보</h2>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
          <div>
            <dt className="text-muted-foreground">상태</dt>
            <dd className="mt-1">
              <StatusBadge
                status={TbmStateStyle[tbm.tbmState]}
                label={TbmStateLabel[tbm.tbmState]}
              />
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">구분</dt>
            <dd className="mt-1">{TbmTypeLabel[tbm.tbmType]}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">빌딩</dt>
            <dd className="mt-1">{tbm.buildingDTO?.name ?? "-"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">담당팀</dt>
            <dd className="mt-1">{tbm.userGroupDTO?.name ?? "-"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">주기</dt>
            <dd className="mt-1">{tbm.cycle ? `${tbm.cycle}일` : "-"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">최종수정자</dt>
            <dd className="mt-1">{tbm.lastModifierName ?? "-"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">최근 실행일</dt>
            <dd className="mt-1">
              {tbm.lastExecuteTime?.split("T")[0] ?? "-"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">다음 실행일</dt>
            <dd className="mt-1">
              {tbm.nextExecuteTime?.split("T")[0] ?? "-"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">최종 수정일</dt>
            <dd className="mt-1">
              {tbm.lastModifyDate?.split("T")[0] ?? "-"}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
