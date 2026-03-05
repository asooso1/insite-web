"use client";

import { PageHeader } from "@/components/common/page-header";
import { Plus } from "lucide-react";
import { FieldProjectForm } from "../_components/field-project-form";

export default function NewFieldProjectPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="프로젝트 추가"
        description="새로운 현장 프로젝트를 등록하세요"
        icon={Plus}
      />

      <FieldProjectForm mode="create" />
    </div>
  );
}
