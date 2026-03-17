"use client";

import { PageHeader } from "@/components/common/page-header";
import { Plus } from "lucide-react";
import { FieldWorkOrderForm } from "../_components/field-work-order-form";

// TODO: 실제로는 프로젝트 목록을 API에서 조회해야 함
const MOCK_PROJECTS = [
  { id: 1, projectName: "프로젝트 A" },
  { id: 2, projectName: "프로젝트 B" },
  { id: 3, projectName: "프로젝트 C" },
];

export default function NewFieldWorkOrderPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="수시업무 추가"
        description="새로운 현장 작업을 지시하세요"
        icon={Plus}
      />

      <FieldWorkOrderForm mode="create" projects={MOCK_PROJECTS} />
    </div>
  );
}
