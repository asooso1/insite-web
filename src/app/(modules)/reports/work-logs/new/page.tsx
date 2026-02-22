"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportForm } from "../../_components/report-form";
import { useAddWorkLog } from "@/lib/hooks/use-reports";
import type { ReportVO } from "@/lib/types/report";

export default function WorkLogNewPage() {
  const router = useRouter();
  const addWorkLog = useAddWorkLog();

  const handleSubmit = async (data: ReportVO) => {
    await addWorkLog.mutateAsync(data);
    router.push("/reports");
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/reports")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">업무일지 등록</h1>
          <p className="text-muted-foreground">새 업무일지를 작성합니다.</p>
        </div>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <ReportForm reportType="workLog" mode="new" onSubmit={handleSubmit} backPath="/reports" />
      </div>
    </div>
  );
}
