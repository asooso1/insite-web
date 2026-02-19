"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useAddReferenceData, useEditReferenceData } from "@/lib/hooks/use-boards";
import type { ReferenceDataDTO, ReferenceDataVO } from "@/lib/types/board";

// ============================================================================
// 폼 스키마
// ============================================================================

const dataSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요").max(255, "제목은 255자 이하여야 합니다"),
  contents: z.string().min(1, "내용을 입력해주세요"),
  allCompany: z.boolean(),
  companyId: z.number().optional(),
  buildingId: z.number().optional(),
});

type DataFormData = z.infer<typeof dataSchema>;

// ============================================================================
// Props
// ============================================================================

interface DataFormProps {
  mode: "create" | "edit";
  initialData?: ReferenceDataDTO;
  dataId?: number;
}

// ============================================================================
// 메인 폼 컴포넌트
// ============================================================================

export function DataForm({ mode, initialData, dataId }: DataFormProps) {
  const router = useRouter();

  const addData = useAddReferenceData();
  const editData = useEditReferenceData();

  const form = useForm<DataFormData>({
    resolver: zodResolver(dataSchema),
    defaultValues: {
      title: "",
      contents: "",
      allCompany: true,
      companyId: undefined,
      buildingId: undefined,
    },
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset({
        title: initialData.title || "",
        contents: initialData.contents || "",
        allCompany: initialData.allCompany ?? true,
        companyId: initialData.referenceDataCompanyId || undefined,
        buildingId: initialData.referenceDataBuildingId || undefined,
      });
    }
  }, [mode, initialData, form]);

  const onSubmit = (data: DataFormData) => {
    const payload: ReferenceDataVO = {
      id: dataId,
      title: data.title,
      contents: data.contents,
      allCompany: data.allCompany,
      companyId: data.companyId,
      buildingId: data.buildingId,
    };

    if (mode === "create") {
      addData.mutate(payload, {
        onSuccess: (result) => {
          router.push(`/boards/data/${result.id}`);
        },
      });
    } else {
      editData.mutate(payload, {
        onSuccess: () => {
          router.push(`/boards/data/${dataId}`);
        },
      });
    }
  };

  const isPending = addData.isPending || editData.isPending;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {mode === "create" ? "새 자료 등록" : "자료 수정"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "create"
                ? "새로운 자료를 등록합니다."
                : "자료를 수정합니다."}
            </p>
          </div>
        </div>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
          <Save className="mr-2 h-4 w-4" />
          저장
        </Button>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          {/* 좌측 메인 폼 */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  기본 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">제목 *</Label>
                  <Input
                    id="title"
                    placeholder="자료 제목을 입력하세요"
                    {...form.register("title")}
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contents">내용 *</Label>
                  <Textarea
                    id="contents"
                    placeholder="자료 내용을 입력하세요"
                    rows={12}
                    {...form.register("contents")}
                  />
                  {form.formState.errors.contents && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.contents.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 우측 사이드바 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>공개 설정</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="allCompany"
                    checked={form.watch("allCompany")}
                    onChange={(e) => form.setValue("allCompany", e.target.checked)}
                    className="h-4 w-4 rounded border"
                  />
                  <Label htmlFor="allCompany">전체 고객사 공개</Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
