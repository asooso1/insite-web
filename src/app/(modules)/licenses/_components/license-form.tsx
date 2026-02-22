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

import { useAddLicense, useEditLicense, useLicenseCategoryList } from "@/lib/hooks/use-licenses";
import type { LicenseInfoDTO } from "@/lib/types/license";

// ============================================================================
// 폼 데이터 타입
// ============================================================================

interface LicenseFormValues {
  accountId: string;
  categoryId: string;
  licenseNo: string;
  passDate: string;
  publishDate: string;
  note: string;
}

interface LicenseFormProps {
  /** 수정 시 기존 데이터 */
  defaultData?: LicenseInfoDTO;
  mode: "new" | "edit";
}

// ============================================================================
// 컴포넌트
// ============================================================================

export function LicenseForm({ defaultData, mode }: LicenseFormProps) {
  const router = useRouter();
  const addLicense = useAddLicense();
  const editLicense = useEditLicense();
  const { data: categories = [] } = useLicenseCategoryList();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LicenseFormValues>({
    defaultValues: {
      accountId: "",
      categoryId: String(defaultData?.licenseDepth3Id ?? ""),
      licenseNo: "",
      passDate: "",
      publishDate: "",
      note: "",
    },
  });

  const categoryId = watch("categoryId");

  const onSubmit = useCallback(
    async (values: LicenseFormValues) => {
      const formData = new FormData();
      if (mode === "edit" && defaultData) {
        formData.append("license.id", String(defaultData.id));
      }
      if (values.accountId) formData.append("license.accountId", values.accountId);
      if (values.categoryId) formData.append("license.categoryId", values.categoryId);
      if (values.licenseNo) formData.append("license.licenseNo", values.licenseNo);
      if (values.passDate) formData.append("license.passDate", values.passDate);
      if (values.publishDate) formData.append("license.publishDate", values.publishDate);
      if (values.note) formData.append("license.note", values.note);

      if (mode === "new") {
        await addLicense.mutateAsync(formData);
      } else {
        await editLicense.mutateAsync(formData);
      }
      router.push("/licenses");
    },
    [mode, defaultData, addLicense, editLicense, router]
  );

  // 3단계 분류 중 depth=3 인 항목만 선택 대상
  const leafCategories = categories.filter((c) => c.depth === 3);
  const topCategories = categories.filter((c) => c.depth === 1);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* 분류 선택 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label>분류 1</Label>
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="분류 1 선택" />
            </SelectTrigger>
            <SelectContent>
              {topCategories.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>분류 3 (최종)</Label>
          <Select
            value={categoryId}
            onValueChange={(v) => setValue("categoryId", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="자격증 종류 선택" />
            </SelectTrigger>
            <SelectContent>
              {leafCategories.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 자격증 번호 */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="licenseNo">자격증 번호</Label>
        <Input
          id="licenseNo"
          {...register("licenseNo")}
          placeholder="자격증 번호를 입력하세요"
        />
        {errors.licenseNo && (
          <p className="text-sm text-destructive">{errors.licenseNo.message}</p>
        )}
      </div>

      {/* 취득일 / 발급일 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="passDate">취득일</Label>
          <Input
            id="passDate"
            type="date"
            {...register("passDate")}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="publishDate">발급일</Label>
          <Input
            id="publishDate"
            type="date"
            {...register("publishDate")}
          />
        </div>
      </div>

      {/* 비고 */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="note">비고</Label>
        <textarea
          id="note"
          {...register("note")}
          rows={3}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          placeholder="비고를 입력하세요"
        />
      </div>

      {/* 버튼 */}
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/licenses")}
        >
          취소
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "저장 중..." : mode === "new" ? "등록" : "수정"}
        </Button>
      </div>
    </form>
  );
}
