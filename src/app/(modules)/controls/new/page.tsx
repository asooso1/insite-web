import { PageHeader } from "@/components/common/page-header";
import { ControlForm } from "../_components/control-form";

export default function NewControlPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="제어 등록"
        description="새로운 제어를 등록합니다."
      />

      <div className="rounded-lg border border-border bg-card p-6">
        <ControlForm />
      </div>
    </div>
  );
}
