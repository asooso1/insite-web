"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAddMaterial, useEditMaterial } from "@/lib/hooks/use-materials";
import {
  MaterialType,
  MaterialTypeLabel,
  MaterialState,
  MaterialStateLabel,
  type MaterialDTO,
  type MaterialVO,
} from "@/lib/types/material";

// ============================================================================
// 폼 스키마
// ============================================================================

const materialSchema = z.object({
  name: z.string().min(1, "자재명을 입력해주세요"),
  privateCode: z.string().optional(),
  type: z.string().min(1, "유형을 선택해주세요"),
  state: z.string().min(1, "상태를 선택해주세요"),
  standard: z.string().optional(),
  unit: z.string().optional(),
  suitableStock: z.number().optional(),
  connectWorkOrder: z.boolean(),
  description: z.string().optional(),
  buildingFloorZoneId: z.number().min(1, "위치를 선택해주세요"),
  userGroupId: z.number().min(1, "관리팀을 선택해주세요"),
});

type MaterialFormData = z.infer<typeof materialSchema>;

// ============================================================================
// Props
// ============================================================================

interface MaterialFormProps {
  mode: "create" | "edit";
  initialData?: MaterialDTO;
  materialId?: number;
}

// ============================================================================
// 메인 폼 컴포넌트
// ============================================================================

export function MaterialForm({ mode, initialData, materialId }: MaterialFormProps) {
  const router = useRouter();

  const addMaterial = useAddMaterial();
  const editMaterial = useEditMaterial();

  const form = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      name: "",
      privateCode: "",
      type: MaterialType.SUPPLIES,
      state: MaterialState.PREPARE,
      standard: "",
      unit: "",
      suitableStock: 0,
      connectWorkOrder: false,
      description: "",
      buildingFloorZoneId: 0,
      userGroupId: 0,
    },
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset({
        name: initialData.name || "",
        privateCode: initialData.privateCode || "",
        type: initialData.type || MaterialType.SUPPLIES,
        state: initialData.state || MaterialState.PREPARE,
        standard: initialData.standard || "",
        unit: initialData.unit || "",
        suitableStock: initialData.suitableStock || 0,
        connectWorkOrder: initialData.connectWorkOrder || false,
        description: initialData.description || "",
        buildingFloorZoneId: initialData.buildingFloorZoneId || 0,
        userGroupId: initialData.userGroupId || 0,
      });
    }
  }, [mode, initialData, form]);

  const onSubmit = (data: MaterialFormData) => {
    const payload: MaterialVO = {
      id: materialId,
      name: data.name,
      privateCode: data.privateCode,
      type: data.type as MaterialType,
      state: data.state as MaterialState,
      standard: data.standard,
      unit: data.unit,
      suitableStock: data.suitableStock,
      connectWorkOrder: data.connectWorkOrder,
      description: data.description,
      buildingFloorZoneId: data.buildingFloorZoneId,
      userGroupId: data.userGroupId,
    };

    if (mode === "create") {
      addMaterial.mutate(payload, {
        onSuccess: (result) => {
          router.push(`/materials/${result.id}`);
        },
      });
    } else {
      editMaterial.mutate(payload, {
        onSuccess: () => {
          router.push(`/materials/${materialId}`);
        },
      });
    }
  };

  const isPending = addMaterial.isPending || editMaterial.isPending;

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
              {mode === "create" ? "새 자재 등록" : "자재 수정"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "create"
                ? "새로운 자재를 등록합니다."
                : "자재 정보를 수정합니다."}
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
            {/* 기본 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  기본 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">자재명 *</Label>
                    <Input
                      id="name"
                      placeholder="자재명을 입력하세요"
                      {...form.register("name")}
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="privateCode">관리코드</Label>
                    <Input
                      id="privateCode"
                      placeholder="내부 관리코드"
                      {...form.register("privateCode")}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>유형 *</Label>
                    <Select
                      value={form.watch("type")}
                      onValueChange={(value) => form.setValue("type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="유형 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(MaterialTypeLabel).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>상태 *</Label>
                    <Select
                      value={form.watch("state")}
                      onValueChange={(value) => form.setValue("state", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="상태 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(MaterialStateLabel).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="standard">규격</Label>
                    <Input
                      id="standard"
                      placeholder="규격"
                      {...form.register("standard")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">단위</Label>
                    <Input
                      id="unit"
                      placeholder="개, EA, 박스..."
                      {...form.register("unit")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="suitableStock">적정재고</Label>
                    <Input
                      id="suitableStock"
                      type="number"
                      placeholder="0"
                      {...form.register("suitableStock", { valueAsNumber: true })}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="connectWorkOrder"
                    {...form.register("connectWorkOrder")}
                    className="h-4 w-4 rounded border"
                  />
                  <Label htmlFor="connectWorkOrder">작업지시 연동</Label>
                </div>
              </CardContent>
            </Card>

            {/* 설명 */}
            <Card>
              <CardHeader>
                <CardTitle>설명</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="자재에 대한 설명을 입력하세요"
                  rows={4}
                  {...form.register("description")}
                />
              </CardContent>
            </Card>
          </div>

          {/* 우측 사이드바 */}
          <div className="space-y-6">
            {/* 위치/관리 */}
            <Card>
              <CardHeader>
                <CardTitle>위치/관리</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>보관 위치 *</Label>
                  <Select
                    value={String(form.watch("buildingFloorZoneId") || "")}
                    onValueChange={(value) =>
                      form.setValue("buildingFloorZoneId", Number(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="위치 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* 수정 모드일 때 기존 위치 표시 */}
                      {initialData?.buildingFloorZones?.map((zone) => (
                        <SelectItem key={zone.id} value={String(zone.id)}>
                          {zone.name}
                        </SelectItem>
                      ))}
                      {!initialData?.buildingFloorZones?.length && (
                        <SelectItem value="1">기본 위치</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.buildingFloorZoneId && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.buildingFloorZoneId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>관리팀 *</Label>
                  <Select
                    value={String(form.watch("userGroupId") || "")}
                    onValueChange={(value) =>
                      form.setValue("userGroupId", Number(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="관리팀 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {initialData?.userGroups?.map((group) => (
                        <SelectItem key={group.id} value={String(group.id)}>
                          {group.name}
                        </SelectItem>
                      ))}
                      {!initialData?.userGroups?.length && (
                        <SelectItem value="1">기본 관리팀</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.userGroupId && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.userGroupId.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
