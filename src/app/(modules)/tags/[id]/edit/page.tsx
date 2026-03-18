import { PageHeader } from "@/components/common/page-header";
import { BackButton } from "./_components/back-button";
import { TagForm } from "../../_components/tag-form";

interface TagEditPageProps {
  params: { id: string };
}

export default async function TagEditPage({
  params,
}: TagEditPageProps) {
  const id = Number(params.id);

  return (
    <div className="space-y-4">
      <PageHeader
        title="태그 수정"
        description="태그 정보를 수정합니다"
        actions={<BackButton />}
      />
      <div className="px-6">
        <TagForm />
      </div>
    </div>
  );
}
