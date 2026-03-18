"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldWrapper } from "@/components/forms/form-field";
import { handleApiError } from "@/lib/api/error-handler";
import { useAddCleaningBim, useEditCleaningBim } from "@/lib/hooks/use-cleaning";
import type { CleanInfoDTO, CleanInfoVO } from "@/lib/types/cleaning";

// ============================================================================
// 스키마
// ============================================================================

const schema = z.object({
  companyName: z.string().min(1, "업체명을 입력해주세요"),
  contactName: z.string().min(1, "담당자명을 입력해주세요"),
  phone: z.string().min(1, "연락처를 입력해주세요"),
  contractStart: z.string().min(1, "계약 시작일을 입력해주세요"),
  contractEnd: z.string().min(1, "계약 종료일을 입력해주세요"),
  area: z.string().min(1, "담당 구역을 입력해주세요"),
});

type FormValues = z.infer<typeof schema>;

// ============================================================================
// Props
// ============================================================================

interface CleaningFormProps {
  defaultValues?: CleanInfoDTO;
  mode?: "create" | "edit";
}

// ============================================================================
// 컴포넌트
// ============================================================================

export function CleaningForm({ defaultValues, mode = "create" }: CleaningFormProps) {
  const router = useRouter();
  const { mutateAsync: addCleaning, isPending: isAdding } = useAddCleaningBim();
  const { mutateAsync: editCleaning, isPending: isEditing } = useEditCleaningBim();

  const isPending = isAdding || isEditing;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: defaultValues?.companyName ?? "",
      contactName: defaultValues?.contactName ?? "",
      phone: defaultValues?.phone ?? "",
      contractStart: defaultValues?.contractStart ?? "",
      contractEnd: defaultValues?.contractEnd ?? "",
      area: defaultValues?.area ?? "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const vo: CleanInfoVO = {
        ...(mode === "edit" && defaultValues ? { id: defaultValues.id } : {}),
        ...data,
      };

      if (mode === "edit") {
        await editCleaning(vo);
        toast.success("청소업체 정보가 수정되었습니다.");
      } else {
        await addCleaning(vo);
        toast.success("청소업체가 등록되었습니다.");
      }
      router.push("/service/cleaning");
    } catch (error) {
      handleApiError(error as Error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FieldWrapper
          label="업체명"
          required
          errorMessage={form.formState.errors.companyName?.message}
        >
          <Input
            {...form.register("companyName")}
            aria-invalid={!!form.formState.errors.companyName}
            placeholder="업체명을 입력하세요"
          />
        </FieldWrapper>
        <FieldWrapper
          label="담당자"
          required
          errorMessage={form.formState.errors.contactName?.message}
        >
          <Input
            {...form.register("contactName")}
            aria-invalid={!!form.formState.errors.contactName}
            placeholder="담당자명을 입력하세요"
          />
        </FieldWrapper>
        <FieldWrapper
          label="연락처"
          required
          errorMessage={form.formState.errors.phone?.message}
        >
          <Input
            {...form.register("phone")}
            aria-invalid={!!form.formState.errors.phone}
            placeholder="000-0000-0000"
          />
        </FieldWrapper>
        <FieldWrapper
          label="담당 구역"
          required
          errorMessage={form.formState.errors.area?.message}
        >
          <Input
            {...form.register("area")}
            aria-invalid={!!form.formState.errors.area}
            placeholder="담당 구역을 입력하세요"
          />
        </FieldWrapper>
        <FieldWrapper
          label="계약 시작일"
          required
          errorMessage={form.formState.errors.contractStart?.message}
        >
          <Input
            type="date"
            {...form.register("contractStart")}
            aria-invalid={!!form.formState.errors.contractStart}
          />
        </FieldWrapper>
        <FieldWrapper
          label="계약 종료일"
          required
          errorMessage={form.formState.errors.contractEnd?.message}
        >
          <Input
            type="date"
            {...form.register("contractEnd")}
            aria-invalid={!!form.formState.errors.contractEnd}
          />
        </FieldWrapper>
      </div>
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
        >
          취소
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "저장 중..." : mode === "edit" ? "수정" : "등록"}
        </Button>
      </div>
    </form>
  );
}
