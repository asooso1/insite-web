"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldWrapper } from "@/components/forms/form-field";

import { usePrivacyPolicy, useEditPrivacyPolicy } from "@/lib/hooks/use-privacy";
import { handleApiError } from "@/lib/api/error-handler";

// ============================================================================
// 검증 스키마
// ============================================================================

const privacySchema = z.object({
  content: z.string().min(1, "내용을 입력해주세요"),
  effectiveDate: z.string().min(1, "적용일을 입력해주세요"),
});

type PrivacyFormValues = z.infer<typeof privacySchema>;

// ============================================================================
// 폼 컴포넌트
// ============================================================================

export function PrivacyForm() {
  const router = useRouter();
  const { data: policy } = usePrivacyPolicy();
  const { mutate: editPolicy, isPending } = useEditPrivacyPolicy();

  const form = useForm<PrivacyFormValues>({
    resolver: zodResolver(privacySchema),
    defaultValues: {
      content: "",
      effectiveDate: "",
    },
  });

  // 기존 정책 데이터 로드
  useEffect(() => {
    if (policy) {
      form.reset({
        content: policy.content,
        effectiveDate: policy.effectiveDate,
      });
    }
  }, [policy, form]);

  async function onSubmit(values: PrivacyFormValues): Promise<void> {
    try {
      editPolicy(
        {
          id: policy?.id,
          content: values.content,
          effectiveDate: values.effectiveDate,
        },
        {
          onSuccess: () => {
            toast.success("개인정보정책이 수정되었습니다.");
            router.push("/privacy");
          },
          onError: (error) => {
            handleApiError(error as Error);
          },
        }
      );
    } catch (error) {
      handleApiError(error as Error);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
      <div className="rounded-lg border bg-card p-6">
        <div className="space-y-4">
          {/* 적용일 */}
          <div>
            <FieldWrapper
              label="적용일"
              required
              errorMessage={form.formState.errors.effectiveDate?.message}
            >
              <Input
                type="date"
                aria-invalid={!!form.formState.errors.effectiveDate}
                {...form.register("effectiveDate")}
              />
            </FieldWrapper>
          </div>

          {/* 내용 */}
          <div>
            <FieldWrapper
              label="정책 내용"
              required
              errorMessage={form.formState.errors.content?.message}
            >
              <Textarea
                placeholder="개인정보정책 내용을 입력하세요"
                className="min-h-[400px] font-mono text-sm"
                aria-invalid={!!form.formState.errors.content}
                {...form.register("content")}
              />
            </FieldWrapper>
          </div>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
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
