import { AlertCircle } from "lucide-react";

import { EmptyState } from "@/components/data-display/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { ControlForm } from "../../_components/control-form";

import { getControlView } from "@/lib/api/control";

interface EditControlPageProps {
  params: { id: string };
}

export default async function EditControlPage({
  params,
}: EditControlPageProps) {
  const controlId = Number(params.id);

  try {
    const control = await getControlView(controlId);

    return (
      <div className="flex flex-col gap-6 p-6">
        <PageHeader
          title="제어 수정"
          description={control.name}
        />

        <div className="rounded-lg border border-border bg-card p-6">
          <ControlForm defaultValues={control} isEdit />
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
