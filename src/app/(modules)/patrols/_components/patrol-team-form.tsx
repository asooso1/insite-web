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

import { usePostPatrolTeam, usePutPatrolTeam } from "@/lib/hooks/use-patrols";
import {
  PatrolTeamState,
  PatrolTeamStateLabel,
  type PatrolTeamDTO,
} from "@/lib/types/patrol";

interface PatrolTeamFormValues {
  name: string;
  state: string;
  carNo: string;
}

interface PatrolTeamFormProps {
  defaultData?: PatrolTeamDTO;
  mode: "new" | "edit";
}

export function PatrolTeamForm({ defaultData, mode }: PatrolTeamFormProps) {
  const router = useRouter();
  const postTeam = usePostPatrolTeam();
  const putTeam = usePutPatrolTeam();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PatrolTeamFormValues>({
    defaultValues: {
      name: defaultData?.name ?? "",
      state: defaultData?.state ?? PatrolTeamState.ACTIVE,
      carNo: defaultData?.carNo ?? "",
    },
  });

  const state = watch("state");

  const onSubmit = useCallback(
    async (values: PatrolTeamFormValues) => {
      const payload = {
        id: defaultData?.id,
        name: values.name,
        state: values.state as PatrolTeamState,
        carId: defaultData?.carId ?? 0,
        carNo: values.carNo,
        patrolTeamBuildings: defaultData?.patrolTeamBuildings.map((b) => ({ buildingId: b.buildingId })) ?? [],
        patrolTeamAccounts: defaultData?.patrolTeamAccounts.map((a) => ({ accountId: a.accountId })) ?? [],
      };

      if (mode === "new") {
        await postTeam.mutateAsync(payload);
      } else {
        await putTeam.mutateAsync(payload);
      }
      router.push("/patrols");
    },
    [mode, defaultData, postTeam, putTeam, router]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* 팀명 */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">팀명 *</Label>
        <Input
          id="name"
          {...register("name", { required: "팀명을 입력하세요" })}
          placeholder="순찰 팀명을 입력하세요"
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      {/* 상태 */}
      <div className="flex flex-col gap-1.5">
        <Label>상태</Label>
        <Select value={state} onValueChange={(v) => setValue("state", v)}>
          <SelectTrigger>
            <SelectValue placeholder="상태 선택" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(PatrolTeamStateLabel).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
