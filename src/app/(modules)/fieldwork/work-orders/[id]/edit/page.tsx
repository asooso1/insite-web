"use client";

import { use } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Edit, AlertCircle } from "lucide-react";
import { EmptyState } from "@/components/data-display/empty-state";
import { FieldWorkOrderForm } from "../../_components/field-work-order-form";
import { useFieldWorkOrder } from "@/lib/hooks/use-field-work-orders";

// TODO: 실제로는 프로젝트 목록을 API에서 조회해야 함
const MOCK_PROJECTS = [
  { id: 1, projectName: "프로젝트 A" },
  { id: 2, projectName: "프로젝트 B" },
  { id: 3, projectName: "프로젝트 C" },
];

export default function EditFieldWorkOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const workOrderId = Number(id);

  const { data: workOrder, isLoading, isError } = useFieldWorkOrder(workOrderId);

  if (isError) {
    return (
      <EmptyState
        title="오류 발생"
        description="작업지시 정보를 불러올 수 없습니다"
        icon={AlertCircle}
      />
    );
  }

  if (isLoading || !workOrder) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-muted-foreground">불러오는 중...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="작업지시 수정"
        description={`${workOrder.title} 정보를 수정하세요`}
        icon={Edit}
      />

      <FieldWorkOrderForm
        mode="edit"
        data={workOrder}
        projects={MOCK_PROJECTS}
      />
    </div>
  );
}
