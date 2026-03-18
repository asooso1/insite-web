import { PageHeader } from "@/components/common/page-header";
import { InfoPanel } from "@/components/data-display/info-panel";
import { Sparkles } from "lucide-react";
import { getCleaningBimView } from "@/lib/api/cleaning";
import { CleaningDetailActions } from "./_components/cleaning-detail-actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CleaningDetailPage({ params }: Props) {
  const { id } = await params;
  const item = await getCleaningBimView(Number(id));

  return (
    <div className="space-y-4">
      <PageHeader
        title={item.companyName}
        icon={Sparkles}
        actions={<CleaningDetailActions id={item.id} />}
      />
      <div className="rounded-lg border bg-card p-6">
        <InfoPanel
          items={[
            { label: "업체명", value: item.companyName },
            { label: "담당자", value: item.contactName },
            { label: "연락처", value: item.phone },
            { label: "담당 구역", value: item.area },
            { label: "계약 시작일", value: item.contractStart },
            { label: "계약 종료일", value: item.contractEnd },
            { label: "빌딩", value: item.buildingName },
            { label: "등록일", value: item.createdAt },
          ]}
        />
      </div>
    </div>
  );
}
