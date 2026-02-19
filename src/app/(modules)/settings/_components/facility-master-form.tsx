"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useAddFacilityMaster,
  useEditFacilityMaster,
  useFacilityCategoryTree,
} from "@/lib/hooks/use-settings";
import {
  FuelType,
  FuelTypeLabel,
  type FacilityMasterDTO,
  type FacilityMasterVO,
  type FacilityCategoryTreeDTO,
} from "@/lib/types/setting";

// ============================================================================
// 폼 스키마
// ============================================================================

const masterSchema = z.object({
  name: z.string().min(1, "제품명을 입력해주세요"),
  use: z.string().min(1, "용도를 입력해주세요"),
  makingCompany: z.string().optional(),
  makingCompanyPhone: z.string().optional(),
  modelName: z.string().optional(),
  electricityConsumption: z.string().optional(),
  capacity: z.string().optional(),
  fuelType: z.string().optional(),
  firstFacilityCategoryId: z.number().min(1, "대분류를 선택해주세요"),
  secondFacilityCategoryId: z.number().min(1, "중분류를 선택해주세요"),
  thirdFacilityCategoryId: z.number().min(1, "소분류를 선택해주세요"),
});

type MasterFormData = z.infer<typeof masterSchema>;

// ============================================================================
// Props
// ============================================================================

interface FacilityMasterFormProps {
  mode: "create" | "edit";
  initialData?: FacilityMasterDTO;
  masterId?: number;
}

// ============================================================================
// 메인 폼 컴포넌트
// ============================================================================

export function FacilityMasterForm({
  mode,
  initialData,
  masterId,
}: FacilityMasterFormProps) {
  const router = useRouter();
  const addMaster = useAddFacilityMaster();
  const editMaster = useEditFacilityMaster();
  const { data: categoryTree } = useFacilityCategoryTree();

  const form = useForm<MasterFormData>({
    resolver: zodResolver(masterSchema),
    defaultValues: {
      name: "",
      use: "",
      makingCompany: "",
      makingCompanyPhone: "",
      modelName: "",
      electricityConsumption: "",
      capacity: "",
      fuelType: "",
      firstFacilityCategoryId: 0,
      secondFacilityCategoryId: 0,
      thirdFacilityCategoryId: 0,
    },
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset({
        name: initialData.name || "",
        use: initialData.use || "",
        makingCompany: initialData.makingCompany || "",
        makingCompanyPhone: initialData.makingCompanyPhone || "",
        modelName: initialData.modelName || "",
        electricityConsumption: initialData.electricityConsumption || "",
        capacity: initialData.capacity || "",
        fuelType: initialData.fuelType || "",
        firstFacilityCategoryId: initialData.firstFacilityCategoryId || 0,
        secondFacilityCategoryId: initialData.secondFacilityCategoryId || 0,
        thirdFacilityCategoryId: initialData.thirdFacilityCategoryId || 0,
      });
    }
  }, [mode, initialData, form]);

  const selectedFirst = form.watch("firstFacilityCategoryId");
  const selectedSecond = form.watch("secondFacilityCategoryId");

  // 대분류 목록
  const firstCategories: FacilityCategoryTreeDTO[] = categoryTree ?? [];

  // 중분류 목록 (선택된 대분류의 하위)
  const secondCategories =
    firstCategories.find((c) => c.id === selectedFirst)?.items ?? [];

  // 소분류 목록 (선택된 중분류의 하위)
  const thirdCategories =
    secondCategories.find((c) => c.id === selectedSecond)?.items ?? [];

  const onSubmit = (data: MasterFormData) => {
    const payload: FacilityMasterVO = {
      id: masterId,
      name: data.name,
      use: data.use,
      makingCompany: data.makingCompany,
      makingCompanyPhone: data.makingCompanyPhone,
      modelName: data.modelName,
      electricityConsumption: data.electricityConsumption,
      capacity: data.capacity,
      fuelType: (data.fuelType as FuelType) || undefined,
      firstFacilityCategoryId: data.firstFacilityCategoryId,
      secondFacilityCategoryId: data.secondFacilityCategoryId,
      thirdFacilityCategoryId: data.thirdFacilityCategoryId,
    };

    if (mode === "create") {
      addMaster.mutate(payload, {
        onSuccess: (result) => {
          router.push(`/settings/facility-masters/${result.id}`);
        },
      });
    } else {
      editMaster.mutate(payload, {
        onSuccess: () => {
          router.push(`/settings/facility-masters/${masterId}`);
        },
      });
    }
  };

  const isPending = addMaster.isPending || editMaster.isPending;

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
              {mode === "create" ? "새 표준 설비 등록" : "표준 설비 수정"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "create"
                ? "새로운 표준 설비를 등록합니다."
                : "표준 설비 정보를 수정합니다."}
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
                  <Wrench className="h-4 w-4" />
                  기본 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">제품명 *</Label>
                    <Input
                      id="name"
                      placeholder="제품명"
                      {...form.register("name")}
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="use">용도 *</Label>
                    <Input
                      id="use"
                      placeholder="용도"
                      {...form.register("use")}
                    />
                    {form.formState.errors.use && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.use.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="makingCompany">제조업체</Label>
                    <Input
                      id="makingCompany"
                      placeholder="제조업체"
                      {...form.register("makingCompany")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="makingCompanyPhone">제조업체 전화</Label>
                    <Input
                      id="makingCompanyPhone"
                      placeholder="전화번호"
                      {...form.register("makingCompanyPhone")}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="modelName">모델</Label>
                    <Input
                      id="modelName"
                      placeholder="모델명"
                      {...form.register("modelName")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="electricityConsumption">정격전력</Label>
                    <Input
                      id="electricityConsumption"
                      placeholder="kW"
                      {...form.register("electricityConsumption")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">용량</Label>
                    <Input
                      id="capacity"
                      placeholder="용량"
                      {...form.register("capacity")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>연료 유형</Label>
                  <Select
                    value={form.watch("fuelType") || ""}
                    onValueChange={(value) => form.setValue("fuelType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="선택 안함" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(FuelTypeLabel).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 우측 - 설비 분류 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>설비 분류 *</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>대분류</Label>
                  <Select
                    value={String(selectedFirst || "")}
                    onValueChange={(value) => {
                      form.setValue("firstFacilityCategoryId", Number(value));
                      form.setValue("secondFacilityCategoryId", 0);
                      form.setValue("thirdFacilityCategoryId", 0);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="대분류 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {firstCategories.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.firstFacilityCategoryId && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.firstFacilityCategoryId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>중분류</Label>
                  <Select
                    value={String(selectedSecond || "")}
                    onValueChange={(value) => {
                      form.setValue("secondFacilityCategoryId", Number(value));
                      form.setValue("thirdFacilityCategoryId", 0);
                    }}
                    disabled={!selectedFirst}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="중분류 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {secondCategories.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.secondFacilityCategoryId && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.secondFacilityCategoryId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>소분류</Label>
                  <Select
                    value={String(form.watch("thirdFacilityCategoryId") || "")}
                    onValueChange={(value) =>
                      form.setValue("thirdFacilityCategoryId", Number(value))
                    }
                    disabled={!selectedSecond}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="소분류 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {thirdCategories.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.thirdFacilityCategoryId && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.thirdFacilityCategoryId.message}
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
