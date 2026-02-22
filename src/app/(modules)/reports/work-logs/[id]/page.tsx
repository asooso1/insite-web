"use client";

import { useParams, useRouter } from "next/navigation";
import { AlertCircle, Edit, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/data-display/empty-state";
import { InfoPanel } from "@/components/data-display/info-panel";
import { useWorkLog } from "@/lib/hooks/use-reports";
import { ReportStateLabel, ReportStateStyle } from "@/lib/types/report";

export default function WorkLogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params["id"]);
  const { data: report, isLoading, isError } = useWorkLog(id);

  if (isLoading) {
    return <div className="flex items-center justify-center p-12"><div className="text-muted-foreground">불러오는 중...</div></div>;
  }

  if (isError || !report) {
    return (
      <EmptyState icon={AlertCircle} title="업무일지를 불러올 수 없습니다" description="잠시 후 다시 시도해주세요."
        action={{ label: "목록으로", onClick: () => router.push("/reports") }}
      />
    );
  }

  const state = report.state as keyof typeof ReportStateLabel;
  const stateLabel = ReportStateLabel[state] ?? report.state;
  const stateStyle = ReportStateStyle[state] ?? "";

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/reports")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">업무일지</h1>
          <p className="text-muted-foreground">{report.buildingName} · {report.workDate}</p>
        </div>
        <Button onClick={() => router.push(`/reports/work-logs/${id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />수정
        </Button>
      </div>
      <InfoPanel
        title="업무일지 정보"
        columns={2}
        items={[
          { label: "건물", value: report.buildingName },
          {
            label: "상태",
            value: (
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${stateStyle}`}>
                {stateLabel}
              </span>
            ),
          },
          { label: "업무일", value: report.workDate },
          { label: "업무 시간", value: `${report.workDateFrom || "-"} ~ ${report.workDateTo || "-"}` },
          { label: "작성자", value: report.writerName || "-" },
          { label: "작성일", value: report.writeDate || "-" },
          { label: "보고일", value: report.reportDate || "-" },
        ]}
      />
    </div>
  );
}
