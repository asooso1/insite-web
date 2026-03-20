"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldWrapper } from "@/components/forms/form-field";

import { useAddFaq, useFaqMenus } from "@/lib/hooks/use-faqs";
import { handleApiError } from "@/lib/api/error-handler";
import type { FaqVO } from "@/lib/types/faq";

// ============================================================================
// 검증 스키마
// ============================================================================

const faqSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  content: z.string().min(1, "내용을 입력해주세요"),
  menuId: z.string().min(1, "카테고리를 선택해주세요"),
});

type FaqFormValues = z.infer<typeof faqSchema>;

// ============================================================================
// 폼 컴포넌트
// ============================================================================

export function FaqForm() {
  const router = useRouter();
  const { data: menus } = useFaqMenus();
  const { mutate: addFaq, isPending } = useAddFaq();

  const form = useForm<FaqFormValues>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      title: "",
      content: "",
      menuId: "",
    },
  });

  async function onSubmit(values: FaqFormValues): Promise<void> {
    try {
      const formData = new FormData();
      formData.append("faqVo.title", values.title);
      formData.append("faqVo.content", values.content);
      formData.append("faqVo.menuId", values.menuId);

      addFaq(formData, {
        onSuccess: () => {
          toast.success("FAQ가 등록되었습니다.");
          router.push("/support/faq");
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
                placeholder="FAQ 제목을 입력하세요"
                aria-invalid={!!form.formState.errors.title}
                {...form.register("title")}
              />
            </FieldWrapper>
          </div>

          {/* 카테고리 */}
          <div>
            <FieldWrapper
              label="카테고리"
              required
              errorMessage={form.formState.errors.menuId?.message}
            >
              <Select
                value={form.watch("menuId") ?? ""}
                onValueChange={(value) => form.setValue("menuId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="카테고리를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {menus?.map((menu) => (
                    <SelectItem key={menu.id} value={String(menu.id)}>
                      {menu.menuName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                placeholder="FAQ 내용을 입력하세요"
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
