"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/data-display/empty-state";
import { ReportForm } from "../../../_components/report-form";
import { useMonthlyReport, useEditMonthlyReport } from "@/lib/hooks/use-reports";
import type { ReportVO } from "@/lib/types/report";

export default function MonthlyReportEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params["id"]);
  const { data: report, isLoading, isError } = useMonthlyReport(id);
  const editReport = useEditMonthlyReport();

  if (isLoading) {
    return <div className="flex items-center justify-center p-12"><div className="text-muted-foreground">불러오는 중...</div></div>;
  }

  if (isError || !report) {
    return (
      <EmptyState icon={AlertCircle} title="보고서를 불러올 수 없습니다" description="잠시 후 다시 시도해주세요."
        action={{ label: "목록으로", onClick: () => router.push("/reports") }}
      />
    );
  }

  const handleSubmit = async (data: ReportVO) => {
    await editReport.mutateAsync(data);
    router.push(`/reports/monthly/${id}`);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push(`/reports/monthly/${id}`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">월간보고서 수정</h1>
          <p className="text-muted-foreground">{report.buildingName} · {report.workYear}년 {report.workMonth}월</p>
        </div>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <ReportForm
          reportType="monthly"
          mode="edit"
          defaultReportId={id}
          defaultValues={{
            buildingId: String(report.buildingId),
            companyId: String(report.companyId),
            state: report.state,
            workYear: report.workYear,
            workMonth: report.workMonth,
          }}
          onSubmit={handleSubmit}
          backPath={`/reports/monthly/${id}`}
        />
      </div>
    </div>
  );
}
