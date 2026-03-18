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

import { useAddQuestion } from "@/lib/hooks/use-qna";
import { handleApiError } from "@/lib/api/error-handler";

// ============================================================================
// 검증 스키마
// ============================================================================

const qnaSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  content: z.string().min(1, "내용을 입력해주세요"),
});

type QnaFormValues = z.infer<typeof qnaSchema>;

// ============================================================================
// 폼 컴포넌트
// ============================================================================

export function QnaForm() {
  const router = useRouter();
  const { mutate: addQuestion, isPending } = useAddQuestion();

  const form = useForm<QnaFormValues>({
    resolver: zodResolver(qnaSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  async function onSubmit(values: QnaFormValues): Promise<void> {
    try {
      const formData = new FormData();
      formData.append("qnaQuestionVo.title", values.title);
      formData.append("qnaQuestionVo.content", values.content);

      addQuestion(formData, {
        onSuccess: () => {
          toast.success("질문이 등록되었습니다.");
          router.push("/support/qna");
        },
        onError: (error) => {
          handleApiError(error as Error);
        },
      });
    } catch (error) {
      handleApiError(error as Error);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
      <div className="rounded-lg border bg-card p-6">
        <div className="space-y-4">
          {/* 제목 */}
          <div>
            <FieldWrapper
              label="제목"
              required
              errorMessage={form.formState.errors.title?.message}
            >
              <Input
                placeholder="질문 제목을 입력하세요"
                aria-invalid={!!form.formState.errors.title}
                {...form.register("title")}
              />
            </FieldWrapper>
          </div>

          {/* 내용 */}
          <div>
            <FieldWrapper
              label="내용"
              required
              errorMessage={form.formState.errors.content?.message}
            >
              <Textarea
                placeholder="질문 내용을 입력하세요"
                className="min-h-[300px]"
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
          {isPending ? "등록 중..." : "등록"}
        </Button>
      </div>
    </form>
  );
}
