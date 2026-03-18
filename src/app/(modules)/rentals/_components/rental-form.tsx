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
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  useAddRental,
  useEditRental,
} from "@/lib/hooks/use-rentals";
import {
  type RentalDTO,
  type RentalVO,
} from "@/lib/types/rental";
import { handleApiError } from "@/lib/api/error-handler";

// ============================================================================
// 폼 스키마
// ============================================================================

const rentalSchema = z.object({
  companyName: z.string().min(1, "임차사명을 입력해주세요"),
  tenantName: z.string().min(1, "임차인을 입력해주세요"),
  floor: z.string().min(1, "층을 입력해주세요"),
  area: z.number().min(0, "면적을 입력해주세요"),
  contractStart: z.string().min(1, "계약시작일을 선택해주세요"),
  contractEnd: z.string().min(1, "계약종료일을 선택해주세요"),
  rentAmount: z.number().min(0, "임차료를 입력해주세요"),
});

type RentalFormData = z.infer<typeof rentalSchema>;

// ============================================================================
// Props
// ============================================================================

interface RentalFormProps {
  mode: "new" | "edit";
  initialData?: RentalDTO;
  rentalId?: number;
}

// ============================================================================
// 메인 폼 컴포넌트
// ============================================================================

export function RentalForm({
  mode,
  initialData,
  rentalId,
}: RentalFormProps) {
  const router = useRouter();

  const addRental = useAddRental();
  const editRental = useEditRental();

  const form = useForm<RentalFormData>({
    resolver: zodResolver(rentalSchema),
    defaultValues: {
      companyName: "",
      tenantName: "",
      floor: "",
      area: 0,
      contractStart: "",
      contractEnd: "",
      rentAmount: 0,
    },
  });

  // 수정 모드일 때 초기값 설정
  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset({
        companyName: initialData.companyName || "",
        tenantName: initialData.tenantName || "",
        floor: initialData.floor || "",
        area: initialData.area || 0,
        contractStart: initialData.contractStart || "",
        contractEnd: initialData.contractEnd || "",
        rentAmount: initialData.rentAmount || 0,
      });
    }
  }, [mode, initialData, form]);

  const onSubmit = (data: RentalFormData) => {
    const payload: RentalVO = {
      companyName: data.companyName,
      tenantName: data.tenantName,
      floor: data.floor,
      area: data.area,
      contractStart: data.contractStart,
      contractEnd: data.contractEnd,
      rentAmount: data.rentAmount,
    };

    if (mode === "new") {
      addRental.mutate(payload, {
        onSuccess: () => {
          toast.success("임차 정보가 등록되었습니다.");
          router.push("/rentals");
        },
        onError: (error) => {
          handleApiError(error as Error);
        },
      });
    } else if (mode === "edit" && rentalId) {
      editRental.mutate(
        { ...payload, id: rentalId },
        {
          onSuccess: () => {
            toast.success("임차 정보가 수정되었습니다.");
            router.push(`/rentals/${rentalId}`);
          },
          onError: (error) => {
            handleApiError(error as Error);
          },
        }
      );
    }
  };

  const isPending = addRental.isPending || editRental.isPending;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>임차 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="companyName" className="text-sm font-medium">
                임차사명 <span className="text-red-600">*</span>
              </Label>
              <Input
                id="companyName"
                placeholder="임차사명을 입력하세요"
                {...form.register("companyName")}
                aria-invalid={!!form.formState.errors.companyName}
              />
              {form.formState.errors.companyName && (
                <p className="mt-1 text-xs text-red-600">
                  {form.formState.errors.companyName.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="tenantName" className="text-sm font-medium">
                임차인 <span className="text-red-600">*</span>
              </Label>
              <Input
                id="tenantName"
                placeholder="임차인을 입력하세요"
                {...form.register("tenantName")}
                aria-invalid={!!form.formState.errors.tenantName}
              />
              {form.formState.errors.tenantName && (
                <p className="mt-1 text-xs text-red-600">
                  {form.formState.errors.tenantName.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="floor" className="text-sm font-medium">
                층 <span className="text-red-600">*</span>
              </Label>
              <Input
                id="floor"
                placeholder="층을 입력하세요"
                {...form.register("floor")}
                aria-invalid={!!form.formState.errors.floor}
              />
              {form.formState.errors.floor && (
                <p className="mt-1 text-xs text-red-600">
                  {form.formState.errors.floor.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="area" className="text-sm font-medium">
                면적 (㎡) <span className="text-red-600">*</span>
              </Label>
              <Input
                id="area"
                type="number"
                placeholder="면적을 입력하세요"
                {...form.register("area", { valueAsNumber: true })}
                aria-invalid={!!form.formState.errors.area}
              />
              {form.formState.errors.area && (
                <p className="mt-1 text-xs text-red-600">
                  {form.formState.errors.area.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="contractStart" className="text-sm font-medium">
                계약시작 <span className="text-red-600">*</span>
              </Label>
              <Input
                id="contractStart"
                type="date"
                {...form.register("contractStart")}
                aria-invalid={!!form.formState.errors.contractStart}
              />
              {form.formState.errors.contractStart && (
                <p className="mt-1 text-xs text-red-600">
                  {form.formState.errors.contractStart.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="contractEnd" className="text-sm font-medium">
                계약종료 <span className="text-red-600">*</span>
              </Label>
              <Input
                id="contractEnd"
                type="date"
                {...form.register("contractEnd")}
                aria-invalid={!!form.formState.errors.contractEnd}
              />
              {form.formState.errors.contractEnd && (
                <p className="mt-1 text-xs text-red-600">
                  {form.formState.errors.contractEnd.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="rentAmount" className="text-sm font-medium">
                임차료 <span className="text-red-600">*</span>
              </Label>
              <Input
                id="rentAmount"
                type="number"
                placeholder="임차료를 입력하세요"
                {...form.register("rentAmount", { valueAsNumber: true })}
                aria-invalid={!!form.formState.errors.rentAmount}
              />
              {form.formState.errors.rentAmount && (
                <p className="mt-1 text-xs text-red-600">
                  {form.formState.errors.rentAmount.message}
                </p>
              )}
            </div>
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
