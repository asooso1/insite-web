"use client";

import { use } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Edit, AlertCircle } from "lucide-react";
import { EmptyState } from "@/components/data-display/empty-state";
import { FieldProjectForm } from "../../_components/field-project-form";
import { useFieldProject } from "@/lib/hooks/use-field-projects";

export default function EditFieldProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const projectId = Number(id);

  const { data: project, isLoading, isError } = useFieldProject(projectId);

  if (isError) {
    return (
      <EmptyState
        title="오류 발생"
        description="프로젝트 정보를 불러올 수 없습니다"
        icon={AlertCircle}
      />
    );
  }

  if (isLoading || !project) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-muted-foreground">불러오는 중...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="프로젝트 수정"
        description={`${project.projectName} 정보를 수정하세요`}
        icon={Edit}
      />

      <FieldProjectForm mode="edit" data={project} />
    </div>
  );
}
