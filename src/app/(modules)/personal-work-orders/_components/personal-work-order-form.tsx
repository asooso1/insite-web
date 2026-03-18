"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldWrapper } from "@/components/forms/form-field";
import { toast } from "sonner";
import { handleApiError } from "@/lib/api/error-handler";
import {
  useAddPersonalWorkOrder,
  useUpdatePersonalWorkOrder,
} from "@/lib/hooks/use-personal-work-orders";
import type {
  PersonalWorkOrderVO,
  PersonalWorkOrderUpdateVO,
  PersonalWorkOrderDetailDTO,
} from "@/lib/types/personal-work-order";

// ============================================================================
// 스키마
// ============================================================================

const schema = z.object({
  title: z.string().min(1, "업무명을 입력해주세요"),
  description: z.string().min(1, "업무 설명을 입력해주세요"),
  confirmAccountId: z.number().min(1, "승인자를 선택해주세요"),
  isAlertPush: z.boolean(),
  buildingId: z.number().optional(),
  buildingFloorZoneId: z.number().optional(),
  facilityId: z.number().optional(),
  buildingUserGroupId: z.number().optional(),
});

type FormValues = z.infer<typeof schema>;

// ============================================================================
// 컴포넌트
// ============================================================================

interface PersonalWorkOrderFormProps {
  defaultValues?: PersonalWorkOrderDetailDTO;
}

export function PersonalWorkOrderForm({
  defaultValues,
}: PersonalWorkOrderFormProps) {
  const router = useRouter();
  const { mutate: addWorkOrder, isPending: isAdding } =
    useAddPersonalWorkOrder();
  const { mutate: updateWorkOrder, isPending: isUpdating } =
    useUpdatePersonalWorkOrder();

  const isPending = isAdding || isUpdating;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues
      ? {
          title: defaultValues.title,
          description: defaultValues.description,
          confirmAccountId: defaultValues.confirmInfo.id,
          isAlertPush: defaultValues.isAlertPushAlarm,
          buildingId: defaultValues.buildingId,
          buildingFloorZoneId: defaultValues.buildingFloorZoneId,
          facilityId: defaultValues.facilityId,
          buildingUserGroupId: defaultValues.buildingUserGroupId,
        }
      : {
          title: "",
          description: "",
          confirmAccountId: 0,
          isAlertPush: false,
        },
  });

  async function onSubmit(data: FormValues) {
    try {
      if (defaultValues) {
        // 수정
        await updateWorkOrder({
          id: defaultValues.personalWorkOrderId,
          title: data.title,
          description: data.description,
          confirmAccountId: data.confirmAccountId,
          isAlertPush: data.isAlertPush,
          buildingId: data.buildingId,
          buildingFloorZoneId: data.buildingFloorZoneId,
          facilityId: data.facilityId,
          buildingUserGroupId: data.buildingUserGroupId,
        } as PersonalWorkOrderUpdateVO);
        toast.success("업무가 수정되었습니다.");
      } else {
        // 등록
        await addWorkOrder({
          title: data.title,
          description: data.description,
          confirmAccountId: data.confirmAccountId,
          isAlertPush: data.isAlertPush,
          buildingId: data.buildingId,
          buildingFloorZoneId: data.buildingFloorZoneId,
          facilityId: data.facilityId,
          buildingUserGroupId: data.buildingUserGroupId,
        } as PersonalWorkOrderVO);
        toast.success("업무가 등록되었습니다.");
      }
      router.push("/personal-work-orders");
    } catch (error) {
      handleApiError(error as Error);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FieldWrapper
          label="업무명"
          required
          errorMessage={form.formState.errors.title?.message}
        >
          <Input
            aria-invalid={!!form.formState.errors.title}
            {...form.register("title")}
            placeholder="업무명을 입력해주세요"
          />
        </FieldWrapper>

        <FieldWrapper
          label="승인자"
          required
          errorMessage={form.formState.errors.confirmAccountId?.message}
        >
          <Input
            type="number"
            aria-invalid={!!form.formState.errors.confirmAccountId}
            {...form.register("confirmAccountId", { valueAsNumber: true })}
            placeholder="승인자 ID"
          />
        </FieldWrapper>
      </div>

      <FieldWrapper
        label="업무 설명"
        required
        errorMessage={form.formState.errors.description?.message}
      >
        <Textarea
          aria-invalid={!!form.formState.errors.description}
          {...form.register("description")}
          placeholder="업무 설명을 입력해주세요"
          rows={5}
        />
      </FieldWrapper>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FieldWrapper label="건물" errorMessage={form.formState.errors.buildingId?.message}>
          <Input
            type="number"
            {...form.register("buildingId", { valueAsNumber: true })}
            placeholder="건물 ID"
          />
        </FieldWrapper>

        <FieldWrapper label="팀" errorMessage={form.formState.errors.buildingUserGroupId?.message}>
          <Input
            type="number"
            {...form.register("buildingUserGroupId", { valueAsNumber: true })}
            placeholder="팀 ID"
          />
        </FieldWrapper>

        <FieldWrapper label="구역" errorMessage={form.formState.errors.buildingFloorZoneId?.message}>
          <Input
            type="number"
            {...form.register("buildingFloorZoneId", { valueAsNumber: true })}
            placeholder="구역 ID"
          />
        </FieldWrapper>

        <FieldWrapper label="설비" errorMessage={form.formState.errors.facilityId?.message}>
          <Input
            type="number"
            {...form.register("facilityId", { valueAsNumber: true })}
            placeholder="설비 ID"
          />
        </FieldWrapper>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          취소
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "저장 중..." : "저장"}
        </Button>
      </div>
    </form>
  );
}
