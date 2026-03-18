import { AlertCircle } from "lucide-react";

import { EmptyState } from "@/components/data-display/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { InfoPanel } from "@/components/data-display/info-panel";
import { StatusBadge } from "@/components/data-display/status-badge";

import { getControlView } from "@/lib/api/control";
import { ControlState, ControlStateLabel, ControlStateStyle } from "@/lib/types/control";
import { ControlDetailActions } from "./_components/control-detail-actions";

interface ControlDetailPageProps {
  params: { id: string };
}

export default async function ControlDetailPage({
  params,
}: ControlDetailPageProps) {
  const controlId = Number(params.id);

  try {
    const control = await getControlView(controlId);

    return (
      <div className="flex flex-col gap-6 p-6">
        {/* 헤더 */}
        <PageHeader
          title={control.name}
          actions={<ControlDetailActions control={control} />}
        />

        {/* 정보 패널 */}
        <div className="rounded-lg border border-border bg-card p-6">
          <InfoPanel
            items={[
              {
                label: "상태",
                value: (
                  <StatusBadge
                    status={ControlStateStyle[control.state as ControlState]}
                    label={ControlStateLabel[control.state as ControlState]}
                  />
                ),
              },
              {
                label: "시설명",
                value: control.facilityName,
              },
              {
                label: "빌딩명",
                value: control.buildingName,
              },
              {
                label: "목표값",
                value: control.targetValue,
              },
              {
                label: "현재값",
                value: control.currentValue || "-",
              },
              {
                label: "설명",
                value: control.description || "-",
              },
              {
                label: "등록일",
                value: control.createdAt,
              },
            ]}
          />
        </div>
      </div>
    );
  } catch {
    return (
      <EmptyState
        icon={AlertCircle}
        title="제어를 찾을 수 없습니다"
        description="존재하지 않는 제어입니다."
      />
    );
  }
}
