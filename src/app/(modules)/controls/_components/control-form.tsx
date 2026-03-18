"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldWrapper } from "@/components/forms/form-field";

import { useAddControl, useUpdateControl } from "@/lib/hooks/use-controls";
import { handleApiError } from "@/lib/api/error-handler";
import type { ControlDTO, ControlVO } from "@/lib/types/control";

// ============================================================================
// Zod 스키마
// ============================================================================

const controlSchema = z.object({
  name: z.string().min(1, "제어명을 입력해주세요"),
  targetValue: z.string().min(1, "목표값을 입력해주세요"),
  facilityId: z.number().min(1, "시설을 선택해주세요"),
  description: z.string(),
});

type FormValues = z.infer<typeof controlSchema>;

interface ControlFormProps {
  defaultValues?: Partial<ControlDTO>;
  isEdit?: boolean;
}

export function ControlForm({
  defaultValues,
  isEdit = false,
}: ControlFormProps) {
  const router = useRouter();
  const { mutate: addControl, isPending: isAdding } = useAddControl();
  const { mutate: updateControl, isPending: isUpdating } = useUpdateControl();

  const form = useForm<FormValues>({
    resolver: zodResolver(controlSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      targetValue: defaultValues?.targetValue || "",
      facilityId: Number(defaultValues?.facilityId) || 0,
      description: defaultValues?.description || "",
    },
  });

  const isPending = isAdding || isUpdating;

  async function onSubmit(data: FormValues): Promise<void> {
    const payload: ControlVO = {
      id: isEdit && defaultValues?.id ? defaultValues.id : undefined,
      name: data.name,
      targetValue: data.targetValue,
      facilityId: data.facilityId,
      description: data.description,
    };

    if (isEdit) {
      updateControl(payload, {
        onSuccess: () => {
          toast.success("제어가 수정되었습니다.");
          router.push(`/controls/${defaultValues?.id}`);
        },
        onError: (error) => {
          handleApiError(error as Error);
        },
      });
    } else {
      addControl(payload, {
        onSuccess: () => {
          toast.success("제어가 등록되었습니다.");
          router.push("/controls");
        },
        onError: (error) => {
          handleApiError(error as Error);
        },
      });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FieldWrapper
          label="제어명"
          required
          errorMessage={form.formState.errors.name?.message}
        >
          <Input
            aria-invalid={!!form.formState.errors.name}
            placeholder="제어명을 입력하세요"
            {...form.register("name")}
          />
        </FieldWrapper>

        <FieldWrapper
          label="시설ID"
          required
          errorMessage={form.formState.errors.facilityId?.message}
        >
          <Input
            aria-invalid={!!form.formState.errors.facilityId}
            type="number"
            placeholder="시설 ID를 입력하세요"
            {...form.register("facilityId", { valueAsNumber: true })}
          />
        </FieldWrapper>
      </div>

      <FieldWrapper
        label="목표값"
        required
        errorMessage={form.formState.errors.targetValue?.message}
      >
        <Input
          aria-invalid={!!form.formState.errors.targetValue}
          placeholder="목표값을 입력하세요"
          {...form.register("targetValue")}
        />
      </FieldWrapper>

      <FieldWrapper
        label="설명"
        errorMessage={form.formState.errors.description?.message}
      >
        <Textarea
          placeholder="제어에 대한 설명을 입력하세요"
          rows={4}
          {...form.register("description")}
        />
      </FieldWrapper>

      <div className="flex justify-end gap-2 border-t pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
        >
          취소
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "저장 중..." : "저장"}
        </Button>
      </div>
    </form>
  );
}
