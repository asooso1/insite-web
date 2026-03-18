import { PageHeader } from "@/components/common/page-header";
import { Sparkles } from "lucide-react";
import { CleaningForm } from "../_components/cleaning-form";

export default function NewCleaningPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="청소업체 등록" icon={Sparkles} />
      <div className="rounded-lg border bg-card p-6">
        <CleaningForm mode="create" />
      </div>
    </div>
  );
}
