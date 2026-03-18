"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  useAddServiceCharge,
  useEditServiceCharge,
} from "@/lib/hooks/use-invoices";
import {
  type ServiceChargeDTO,
  type ServiceChargeVO,
} from "@/lib/types/invoice";
import { handleApiError } from "@/lib/api/error-handler";

// ============================================================================
// 폼 스키마
// ============================================================================

const invoiceSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  amount: z.number().min(0, "금액을 입력해주세요"),
  month: z.string().min(1, "청구월을 입력해주세요"),
  note: z.string().optional(),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

// ============================================================================
// Props
// ============================================================================

interface InvoiceFormProps {
  mode: "new" | "edit";
  initialData?: ServiceChargeDTO;
  invoiceId?: number;
}

// ============================================================================
// 메인 폼 컴포넌트
// ============================================================================

export function InvoiceForm({
  mode,
  initialData,
  invoiceId,
}: InvoiceFormProps) {
  const router = useRouter();

  const addInvoice = useAddServiceCharge();
  const editInvoice = useEditServiceCharge();

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      title: "",
      amount: 0,
      month: "",
      note: "",
    },
  });

  // 수정 모드일 때 초기값 설정
  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset({
        title: initialData.title || "",
        amount: initialData.amount || 0,
        month: initialData.month || "",
        note: initialData.note || "",
      });
    }
  }, [mode, initialData, form]);

  const onSubmit = (data: InvoiceFormData) => {
    const payload: ServiceChargeVO = {
      title: data.title,
      amount: data.amount,
      month: data.month,
      note: data.note || "",
    };

    if (mode === "new") {
      addInvoice.mutate(payload, {
        onSuccess: () => {
          toast.success("청구서가 등록되었습니다.");
          router.push("/invoices");
        },
        onError: (error) => {
          handleApiError(error as Error);
        },
      });
    } else if (mode === "edit" && invoiceId) {
      editInvoice.mutate(
        { ...payload, id: invoiceId },
        {
          onSuccess: () => {
            toast.success("청구서가 수정되었습니다.");
            router.push(`/invoices/${invoiceId}`);
          },
          onError: (error) => {
            handleApiError(error as Error);
          },
        }
      );
    }
  };

  const isPending = addInvoice.isPending || editInvoice.isPending;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>청구서 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="title" className="text-sm font-medium">
                제목 <span className="text-red-600">*</span>
              </Label>
              <Input
                id="title"
                placeholder="제목을 입력하세요"
                {...form.register("title")}
                aria-invalid={!!form.formState.errors.title}
              />
              {form.formState.errors.title && (
                <p className="mt-1 text-xs text-red-600">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="amount" className="text-sm font-medium">
                금액 <span className="text-red-600">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="금액을 입력하세요"
                {...form.register("amount", { valueAsNumber: true })}
                aria-invalid={!!form.formState.errors.amount}
              />
              {form.formState.errors.amount && (
                <p className="mt-1 text-xs text-red-600">
                  {form.formState.errors.amount.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="month" className="text-sm font-medium">
                청구월 <span className="text-red-600">*</span>
              </Label>
              <Input
                id="month"
                type="month"
                {...form.register("month")}
                aria-invalid={!!form.formState.errors.month}
              />
              {form.formState.errors.month && (
                <p className="mt-1 text-xs text-red-600">
                  {form.formState.errors.month.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="note" className="text-sm font-medium">
              비고
            </Label>
            <Textarea
              id="note"
              placeholder="비고를 입력하세요"
              {...form.register("note")}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          취소
        </Button>
        <Button type="submit" disabled={isPending}>
          <Save className="mr-2 h-4 w-4" />
          {isPending ? "저장 중..." : "저장"}
        </Button>
      </div>
    </form>
  );
}
