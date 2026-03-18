import { PageHeader } from "@/components/common/page-header";
import { BackButton } from "./_components/back-button";
import { TagForm } from "../_components/tag-form";

export default function TagCreatePage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="새 태그"
        description="NFC/QR 태그를 등록합니다"
        actions={<BackButton />}
      />
      <div className="px-6">
        <TagForm />
      </div>
    </div>
  );
}
