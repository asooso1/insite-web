import { PageHeader } from "@/components/common/page-header";
import { PersonalWorkOrderForm } from "../_components/personal-work-order-form";

export default function NewPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="개인 작업 등록" />
      <PersonalWorkOrderForm />
    </div>
  );
}
