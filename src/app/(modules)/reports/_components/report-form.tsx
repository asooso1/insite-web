"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ReportState,
  ReportStateLabel,
  type ReportVO,
} from "@/lib/types/report";

// ============================================================================
// 공통 폼 타입
// ============================================================================

export type ReportType = "monthly" | "weekly" | "workLog";

interface ReportFormValues {
  buildingId: string;
  companyId: string;
  state: string;
  // 월간
  workYear: string;
  workMonth: string;
  // 주간
  workDateFrom: string;
  workDateTo: string;
  // 업무일지
  workDate: string;
  // 내용
  building: string;
  workOrder: string;
  etc: string;
}

interface ReportFormProps {
  reportType: ReportType;
  defaultReportId?: number;
  defaultValues?: Partial<ReportFormValues>;
  mode: "new" | "edit";
  onSubmit: (data: ReportVO) => Promise<void>;
  backPath: string;
}

// ============================================================================
// 컴포넌트
// ============================================================================

export function ReportForm({
  reportType,
  defaultReportId,
  defaultValues,
  mode,
  onSubmit,
  backPath,
}: ReportFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<ReportFormValues>({
    defaultValues: {
      buildingId: "",
      companyId: "",
      state: ReportState.DRAFT,
      workYear: "",
      workMonth: "",
      workDateFrom: "",
      workDateTo: "",
      workDate: "",
      building: "",
      workOrder: "",
      etc: "",
      ...defaultValues,
    },
  });

  const state = watch("state");

  const handleFormSubmit = useCallback(
    async (values: ReportFormValues) => {
      const info: ReportVO["info"] = {
        reportId: defaultReportId,
        companyId: Number(values.companyId) || 0,
        buildingId: Number(values.buildingId) || 0,
        state: values.state as ReportState,
        receptIds: [],
        sendPush: false,
      };

      if (reportType === "monthly") {
        info.workYear = values.workYear;
        info.workMonth = values.workMonth;
      } else if (reportType === "weekly") {
        info.workDateFrom = values.workDateFrom;
        info.workDateTo = values.workDateTo;
      } else {
        info.workDate = values.workDate;
        info.workDateFrom = values.workDateFrom;
        info.workDateTo = values.workDateTo;
      }

      await onSubmit({
        info,
        building: values.building || undefined,
        workOrder: values.workOrder || undefined,
        etc: values.etc || undefined,
      });
    },
    [reportType, defaultReportId, onSubmit]
  );

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-6">
      {/* 상태 */}
      <div className="flex flex-col gap-1.5">
        <Label>상태</Label>
        <Select value={state} onValueChange={(v) => setValue("state", v)}>
          <SelectTrigger>
            <SelectValue placeholder="상태 선택" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(ReportStateLabel).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 월간 - 년월 */}
      {reportType === "monthly" && (
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="workYear">년도</Label>
            <Input id="workYear" {...register("workYear")} placeholder="예: 2026" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="workMonth">월</Label>
            <Input id="workMonth" {...register("workMonth")} placeholder="예: 02" />
          </div>
        </div>
      )}

      {/* 주간 - 기간 */}
      {reportType === "weekly" && (
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="workDateFrom">시작일</Label>
            <Input id="workDateFrom" type="date" {...register("workDateFrom")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="workDateTo">종료일</Label>
            <Input id="workDateTo" type="date" {...register("workDateTo")} />
          </div>
        </div>
      )}

      {/* 업무일지 - 업무일 */}
      {reportType === "workLog" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="workDate">업무일</Label>
            <Input id="workDate" type="date" {...register("workDate")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="workDateFrom">업무 시작시간</Label>
            <Input id="workDateFrom" type="time" {...register("workDateFrom")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="workDateTo">업무 종료시간</Label>
            <Input id="workDateTo" type="time" {...register("workDateTo")} />
          </div>
        </div>
      )}

      {/* 건물 현황 */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="building">건물 현황</Label>
        <textarea
          id="building"
          {...register("building")}
          rows={4}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          placeholder="건물 현황을 입력하세요"
        />
      </div>

      {/* 작업 현황 */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="workOrder">작업 현황</Label>
        <textarea
          id="workOrder"
          {...register("workOrder")}
          rows={4}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          placeholder="작업 현황을 입력하세요"
        />
      </div>

      {/* 기타 */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="etc">기타</Label>
        <textarea
          id="etc"
          {...register("etc")}
          rows={3}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          placeholder="기타 내용을 입력하세요"
        />
      </div>

      {/* 버튼 */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.push(backPath)}>
          취소
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "저장 중..." : mode === "new" ? "등록" : "수정"}
        </Button>
      </div>
    </form>
  );
}
