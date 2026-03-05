"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/data-display/empty-state";
import { PatrolPlanForm } from "../../_components/patrol-plan-form";
import { usePatrolPlan } from "@/lib/hooks/use-patrols";

export default function PatrolPlanEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params["id"]);
  const { data: plan, isLoading, isError } = usePatrolPlan(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-muted-foreground">불러오는 중...</div>
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

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push(`/patrols/${id}`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">순찰 계획 수정</h1>
          <p className="text-muted-foreground">{plan.name}</p>
        </div>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <PatrolPlanForm mode="edit" defaultData={plan} />
      </div>
    </div>
  );
}
