import { PageHeader } from "@/components/common/page-header";
import { InfoPanel } from "@/components/data-display/info-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BackButton } from "./_components/back-button";

interface TagDetailPageProps {
  params: { id: string };
}

export default async function TagDetailPage({
  params,
}: TagDetailPageProps) {
  const id = Number(params.id);

  return (
    <div className="space-y-4">
      <PageHeader
        title="태그 상세"
        actions={<BackButton />}
      />
      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">기본정보</TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          <InfoPanel
            items={[
              { label: "태그유형", value: "로딩 중..." },
              { label: "태그코드", value: "로딩 중..." },
              { label: "시설명", value: "로딩 중..." },
              { label: "층", value: "로딩 중..." },
              { label: "구역", value: "로딩 중..." },
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
