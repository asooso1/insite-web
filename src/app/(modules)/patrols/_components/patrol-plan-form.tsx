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

import { usePostPatrolPlan, usePutPatrolPlan } from "@/lib/hooks/use-patrols";
import {
  PatrolPlanType,
  PatrolPlanTypeLabel,
  type PatrolPlanDTO,
} from "@/lib/types/patrol";

// ============================================================================
// 폼 데이터 타입
// ============================================================================

interface PatrolPlanFormValues {
  name: string;
  patrolTeamId: string;
  planType: string;
  startDate: string;
  endDate: string;
  carNo: string;
}

interface PatrolPlanFormProps {
  defaultData?: PatrolPlanDTO;
  mode: "new" | "edit";
}

// ============================================================================
// 컴포넌트
// ============================================================================

export function PatrolPlanForm({ defaultData, mode }: PatrolPlanFormProps) {
  const router = useRouter();
  const postPlan = usePostPatrolPlan();
  const putPlan = usePutPatrolPlan();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PatrolPlanFormValues>({
    defaultValues: {
      name: defaultData?.name ?? "",
      patrolTeamId: defaultData?.patrolTeamId ? String(defaultData.patrolTeamId) : "",
      planType: defaultData?.planType ?? PatrolPlanType.SCHEDULED,
      startDate: defaultData?.startDate ?? "",
      endDate: defaultData?.endDate ?? "",
      carNo: defaultData?.carNo ?? "",
    },
  });

  const planType = watch("planType");

  const onSubmit = useCallback(
    async (values: PatrolPlanFormValues) => {
      const payload = {
        id: defaultData?.id,
        name: values.name,
        patrolTeamId: Number(values.patrolTeamId),
        planType: values.planType as PatrolPlanType,
        startDate: values.startDate,
        endDate: values.endDate,
        patrolPlanBuildings: defaultData?.patrolPlanBuildings.map((b) => ({ buildingId: b.buildingId })) ?? [],
        patrolPlanAccounts: defaultData?.patrolPlanAccounts.map((a) => ({ accountId: a.accountId })) ?? [],
      };

      if (mode === "new") {
        await postPlan.mutateAsync(payload);
      } else {
        await putPlan.mutateAsync(payload);
      }
      router.push("/patrols");
    },
    [mode, defaultData, postPlan, putPlan, router]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* 계획명 */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">계획명 *</Label>
        <Input
          id="name"
          {...register("name", { required: "계획명을 입력하세요" })}
          placeholder="순찰 계획명을 입력하세요"
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      {/* 유형 */}
      <div className="flex flex-col gap-1.5">
        <Label>유형 *</Label>
        <Select value={planType} onValueChange={(v) => setValue("planType", v)}>
          <SelectTrigger>
            <SelectValue placeholder="유형 선택" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(PatrolPlanTypeLabel).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 기간 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="startDate">시작일</Label>
          <Input id="startDate" type="date" {...register("startDate")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="endDate">종료일</Label>
          <Input id="endDate" type="date" {...register("endDate")} />
        </div>
      </div>

      {/* 차량번호 */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="carNo">차량번호</Label>
        <Input id="carNo" {...register("carNo")} placeholder="차량번호를 입력하세요" />
      </div>

      {/* 버튼 */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.push("/patrols")}>
          취소
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "저장 중..." : mode === "new" ? "등록" : "수정"}
        </Button>
      </div>
    </form>
  );
}
