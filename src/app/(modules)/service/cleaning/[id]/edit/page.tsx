import { PageHeader } from "@/components/common/page-header";
import { Sparkles } from "lucide-react";
import { getCleaningBimView } from "@/lib/api/cleaning";
import { CleaningForm } from "../../_components/cleaning-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCleaningPage({ params }: Props) {
  const { id } = await params;
  const item = await getCleaningBimView(Number(id));

  return (
    <div className="space-y-4">
      <PageHeader title="청소업체 수정" icon={Sparkles} />
      <div className="rounded-lg border bg-card p-6">
        <CleaningForm mode="edit" defaultValues={item} />
      </div>
    </div>
  );
}
