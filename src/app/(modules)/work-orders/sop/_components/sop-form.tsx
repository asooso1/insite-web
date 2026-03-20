"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import {
  useCreateSop,
  useUpdateSop,
} from "@/lib/hooks/use-sops";
import {
  SopState,
  SopStateLabel,
  type SopDTO,
  type SopVO,
} from "@/lib/types/sop";
import { useAuthStore } from "@/lib/stores/auth-store";
import { handleApiError } from "@/lib/api/error-handler";

// ============================================================================
// 폼 스키마
// ============================================================================

const sopSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  explain: z.string().optional(),
  facilityCategoryId: z.number().min(1, "설비분류를 선택해주세요"),
  sopState: z.nativeEnum(SopState),
  useSopCommonImg: z.boolean(),
  sopJobOrders: z.array(
    z.object({
      jobContentFirstOrder: z.number().min(0),
      jobContentSecondOrder: z.number().min(0),
      jobContents: z.string().min(1, "작업 내용을 입력해주세요"),
    })
  ),
});

type SopFormData = z.infer<typeof sopSchema>;

// ============================================================================
// Props
// ============================================================================

interface SopFormProps {
  mode: "create" | "edit";
  initialData?: SopDTO;
  sopId?: number;
}

// ============================================================================
// 메인 폼 컴포넌트
// ============================================================================

export function SopForm({
  mode,
  initialData,
  sopId,
}: SopFormProps) {
  const router = useRouter();
  const { user } = useAuthStore();

  const createSop = useCreateSop();
  const updateSop = useUpdateSop();

  const [localKeywords, setLocalKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");

  const form = useForm<SopFormData>({
    resolver: zodResolver(sopSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      explain: initialData?.explain ?? "",
      facilityCategoryId: initialData?.facilityCategoryId ?? 0,
      sopState: initialData?.sopState ?? SopState.USE,
      useSopCommonImg: initialData?.useSopCommonImg ?? false,
      sopJobOrders: initialData?.sopJobOrders ?? [
        {
          jobContentFirstOrder: 1,
          jobContentSecondOrder: 1,
          jobContents: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sopJobOrders",
  });

  // 초기 키워드 파싱
  useEffect(() => {
    if (initialData?.sopKeyWord) {
      const keywords = initialData.sopKeyWord
        .split("#")
        .filter((k) => k.trim());
      setLocalKeywords(keywords);
    }
  }, [initialData]);

  // 키워드 추가
  const handleAddKeyword = () => {
    if (keywordInput.trim() && localKeywords.length < 5) {
      setLocalKeywords([...localKeywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  // 키워드 삭제
  const handleRemoveKeyword = (index: number) => {
    setLocalKeywords(localKeywords.filter((_, i) => i !== index));
  };

  // 폼 제출
  const onSubmit = async (data: SopFormData) => {
    try {
      const sopKeyWord = localKeywords.join("#");
      const buildingId = Number(user?.currentBuildingId ?? 0);

      const sopData: SopVO = {
        ...data,
        sopKeyWord,
        buildingId,
      };

      if (mode === "create") {
        await createSop.mutateAsync(sopData);
        router.push("/work-orders/sop");
      } else if (sopId) {
        await updateSop.mutateAsync({ id: sopId, data: sopData });
        router.push(`/work-orders/sop/${sopId}`);
      }
    } catch (error) {
      handleApiError(error as Error);
    }
  };

  const isLoading = createSop.isPending || updateSop.isPending;
  const sopState = form.watch("sopState");

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          뒤로가기
        </Button>
        <h1 className="text-2xl font-bold">
          {mode === "create" ? "새 SOP 등록" : "SOP 수정"}
        </h1>
        <div />
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* 기본 정보 섹션 */}
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 제목 */}
            <div>
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                placeholder="SOP 제목을 입력해주세요"
                {...form.register("title")}
              />
              {form.formState.errors.title && (
                <p className="mt-1 text-sm text-red-500">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            {/* 설명 */}
            <div>
              <Label htmlFor="explain">설명</Label>
              <Textarea
                id="explain"
                placeholder="SOP 설명을 입력해주세요"
                rows={4}
                {...form.register("explain")}
              />
            </div>

            {/* 설비분류 */}
            <div>
              <Label htmlFor="facilityCategoryId">설비분류</Label>
              <Input
                id="facilityCategoryId"
                type="number"
                placeholder="설비분류 ID"
                {...form.register("facilityCategoryId", {
                  valueAsNumber: true,
                })}
              />
              {form.formState.errors.facilityCategoryId && (
                <p className="mt-1 text-sm text-red-500">
                  {form.formState.errors.facilityCategoryId.message}
                </p>
              )}
            </div>

            {/* 상태 */}
            <div>
              <Label htmlFor="sopState">상태</Label>
              <Select
                value={sopState}
                onValueChange={(value) =>
                  form.setValue("sopState", value as SopState)
                }
              >
                <SelectTrigger id="sopState">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SopState.USE}>
                    {SopStateLabel[SopState.USE]}
                  </SelectItem>
                  <SelectItem value={SopState.END}>
                    {SopStateLabel[SopState.END]}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 키워드 섹션 */}
        <Card>
          <CardHeader>
            <CardTitle>키워드</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 키워드 입력 */}
            <div className="flex gap-2">
              <Input
                placeholder="키워드 입력 (최대 5개)"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddKeyword();
                  }
                }}
                disabled={localKeywords.length >= 5}
              />
              <Button
                type="button"
                onClick={handleAddKeyword}
                disabled={localKeywords.length >= 5}
                size="sm"
              >
                <Plus className="mr-2 h-4 w-4" />
                추가
              </Button>
            </div>

            {/* 키워드 배지 */}
            {localKeywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {localKeywords.map((keyword, idx) => (
                  <Badge key={idx} variant="secondary" className="gap-2">
                    {keyword}
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(idx)}
                      className="hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 작업순서 섹션 */}
        <Card>
          <CardHeader>
            <CardTitle>작업순서</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="space-y-3 p-4 border rounded-lg bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">
                    작업순서 #{index + 1}
                  </span>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor={`first-order-${index}`}
                      className="text-xs"
                    >
                      1차 순서번호
                    </Label>
                    <Input
                      id={`first-order-${index}`}
                      type="number"
                      min="0"
                      {...form.register(
                        `sopJobOrders.${index}.jobContentFirstOrder`,
                        { valueAsNumber: true }
                      )}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor={`second-order-${index}`}
                      className="text-xs"
                    >
                      2차 순서번호
                    </Label>
                    <Input
                      id={`second-order-${index}`}
                      type="number"
                      min="0"
                      {...form.register(
                        `sopJobOrders.${index}.jobContentSecondOrder`,
                        { valueAsNumber: true }
                      )}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor={`content-${index}`} className="text-xs">
                    작업 내용
                  </Label>
                  <Textarea
                    id={`content-${index}`}
                    placeholder="작업 내용을 입력해주세요"
                    rows={3}
                    {...form.register(
                      `sopJobOrders.${index}.jobContents`
                    )}
                  />
                  {form.formState.errors.sopJobOrders?.[index]?.jobContents && (
                    <p className="mt-1 text-sm text-red-500">
                      {form.formState.errors.sopJobOrders[index]?.jobContents?.message}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* 작업순서 추가 버튼 */}
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  jobContentFirstOrder: fields.length + 1,
                  jobContentSecondOrder: 1,
                  jobContents: "",
                })
              }
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              작업순서 추가
            </Button>
          </CardContent>
        </Card>

        {/* 제출 버튼 */}
        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            취소
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {mode === "create" ? "등록" : "수정"}
          </Button>
        </div>
      </form>
    </div>
  );
}
