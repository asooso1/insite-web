import { PageHeader } from "@/components/common/page-header";
import { InfoPanel } from "@/components/data-display/info-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BackButton } from "./_components/back-button";

interface NfcRoundDetailPageProps {
  params: { id: string };
}

export default async function NfcRoundDetailPage({
  params,
}: NfcRoundDetailPageProps) {
  // Server Component에서는 데이터 페칭을 직접 수행
  // 클라이언트 컴포넌트에서는 useNfcRoundDetail 훅 사용

  const id = Number(params.id);

  return (
    <div className="space-y-4">
      <PageHeader
        title="NFC 라운드 상세"
        actions={<BackButton />}
      />
      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">기본정보</TabsTrigger>
          <TabsTrigger value="issues">이슈 목록</TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          <InfoPanel
            items={[
              { label: "라운드명", value: "로딩 중..." },
              { label: "시설명", value: "로딩 중..." },
              { label: "상태", value: "로딩 중..." },
            ]}
          />
        </TabsContent>
        <TabsContent value="issues">
          <div className="text-muted-foreground">이슈 목록 로딩 중...</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
