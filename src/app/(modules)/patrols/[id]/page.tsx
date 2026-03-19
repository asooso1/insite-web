"use client";

import { useParams, useRouter } from "next/navigation";
import { AlertCircle, Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/data-display/empty-state";
import { InfoPanel } from "@/components/data-display/info-panel";
import { StatusBadge } from "@/components/data-display/status-badge";
import { PageHeader } from "@/components/common/page-header";

import { usePatrolPlan } from "@/lib/hooks/use-patrols";
import {
  PatrolPlanStateLabel,
  PatrolPlanTypeLabel,
} from "@/lib/types/patrol";

export default function PatrolPlanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params["id"]);

  const { data: plan, isLoading, isError } = usePatrolPlan(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <span className="text-muted-foreground">불러오는 중...</span>
      </div>
    );
  }

  if (isError || !plan) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="순찰 계획을 불러올 수 없습니다"
        description="잠시 후 다시 시도해주세요."
        action={{ label: "목록으로", onClick: () => router.push("/patrols") }}
      />
    );
  }

  const typeLabel = PatrolPlanTypeLabel[plan.planType] ?? plan.planTypeName;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* 헤더 */}
      <PageHeader
        title={plan.name}
        description={plan.patrolTeamName}
        actions={
          <Button onClick={() => router.push(`/patrols/${id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            수정
          </Button>
        }
      />

      {/* 기본 정보 */}
      <InfoPanel
        title="순찰 계획 기본 정보"
        columns={2}
        items={[
          { label: "계획명", value: plan.name },
          { label: "팀명", value: plan.patrolTeamName || "-" },
          {
            label: "상태",
            value: (
              <StatusBadge
                status={plan.state}
                label={PatrolPlanStateLabel[plan.state] ?? plan.stateName}
              />
            ),
          },
          { label: "유형", value: typeLabel },
          { label: "시작일", value: plan.startDate ?? "-" },
          { label: "종료일", value: plan.endDate ?? "-" },
          { label: "차량번호", value: plan.carNo || "-" },
          { label: "작성일", value: plan.writeDate || "-" },
        ]}
      />

      {/* 담당 건물 목록 */}
      {plan.patrolPlanBuildings.length > 0 && (
        <div className="rounded-lg border bg-card p-4">
          <h2 className="mb-3 font-semibold">담당 건물 ({plan.patrolPlanBuildings.length}개)</h2>
          <div className="divide-y">
            {plan.patrolPlanBuildings.map((building) => (
              <div key={building.id} className="flex items-center justify-between py-2">
                <span>{building.buildingName}</span>
                <span className="text-sm text-muted-foreground">{building.stateName}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 담당자 목록 */}
      {plan.patrolPlanAccounts.length > 0 && (
        <div className="rounded-lg border bg-card p-4">
          <h2 className="mb-3 font-semibold">담당자 ({plan.patrolPlanAccounts.length}명)</h2>
          <div className="divide-y">
            {plan.patrolPlanAccounts.map((account) => (
              <div key={account.id} className="py-2">
                <span>{account.accountName}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
