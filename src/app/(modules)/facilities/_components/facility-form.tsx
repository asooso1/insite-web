"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, Building2, Wrench, Calendar } from "lucide-react";

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

import { useAddFacility, useUpdateFacility } from "@/lib/hooks/use-facilities";
import {
  FacilityState,
  FacilityStateLabel,
  type FacilityDTO,
  type FacilityVO,
} from "@/lib/types/facility";

// ============================================================================
// 폼 스키마
// ============================================================================

const facilitySchema = z.object({
  companyId: z.number().min(1, "회사를 선택해주세요"),
  buildingId: z.number().min(1, "빌딩을 선택해주세요"),
  buildingFloorId: z.number().min(1, "층을 선택해주세요"),
  buildingFloorZoneId: z.number().optional(),
  facilityMasterId: z.number().min(1, "시설 유형을 선택해주세요"),
  facilityNo: z.string().optional(),
  facilityName: z.string().min(1, "시설명을 입력해주세요"),
  use: z.string().min(1, "용도를 입력해주세요"),
  state: z.nativeEnum(FacilityState),
  buildingUserGroupId: z.number().min(1, "작업팀을 선택해주세요"),
  makingCompany: z.string().optional(),
  makeDate: z.string().optional(),
  sellCompany: z.string().optional(),
  sellCompanyPhone: z.string().optional(),
  capacity: z.string().optional(),
  electricityConsumption: z.string().optional(),
  cop: z.string().optional(),
  modelName: z.string().optional(),
  snNo: z.string().optional(),
  installDate: z.string().optional(),
  startRunDate: z.string().optional(),
  chargerId: z.number().optional(),
  purchaseUnitPrice: z.string().optional(),
  guaranteeExpireDate: z.string().optional(),
  persistPeriod: z.number().optional(),
});

type FacilityFormData = z.infer<typeof facilitySchema>;

// ============================================================================
// Props
// ============================================================================

interface FacilityFormProps {
  mode: "create" | "edit";
  initialData?: FacilityDTO;
  facilityId?: number;
}

// ============================================================================
// 메인 폼 컴포넌트
// ============================================================================

export function FacilityForm({
  mode,
  initialData,
  facilityId,
}: FacilityFormProps) {
  const router = useRouter();

  const addFacility = useAddFacility();
  const updateFacility = useUpdateFacility();

  const form = useForm<FacilityFormData>({
    resolver: zodResolver(facilitySchema),
    defaultValues: {
      companyId: 0,
      buildingId: 0,
      buildingFloorId: 0,
      buildingFloorZoneId: undefined,
      facilityMasterId: 0,
      facilityNo: "",
      facilityName: "",
      use: "",
      state: FacilityState.BEFORE_OPERATING,
      buildingUserGroupId: 0,
      makingCompany: "",
      makeDate: "",
      sellCompany: "",
      sellCompanyPhone: "",
      capacity: "",
      electricityConsumption: "",
      cop: "",
      modelName: "",
      snNo: "",
      installDate: "",
      startRunDate: "",
      chargerId: undefined,
      purchaseUnitPrice: "",
      guaranteeExpireDate: "",
      persistPeriod: undefined,
    },
  });

  // 수정 모드일 때 초기값 설정
  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset({
        companyId: 1, // TODO: 실제 회사 ID 사용
        buildingId: 1, // TODO: 실제 빌딩 ID 사용
        buildingFloorId: initialData.buildingFloorId || 0,
        buildingFloorZoneId: initialData.buildingFloorZoneId || undefined,
        facilityMasterId: initialData.facilityMasterId || 0,
        facilityNo: initialData.facilityNo || "",
        facilityName: initialData.name || "",
        use: initialData.use || "",
        state: initialData.state,
        buildingUserGroupId: initialData.buildingUserGroupId || 0,
        makingCompany: "",
        makeDate: initialData.makeDate || "",
        sellCompany: initialData.sellCompany || "",
        sellCompanyPhone: initialData.sellCompanyPhone || "",
        cop: initialData.cop || "",
        snNo: initialData.snNo || "",
        installDate: initialData.installDate || "",
        startRunDate: initialData.startRunDate || "",
        chargerId: initialData.chargerId || undefined,
        purchaseUnitPrice: initialData.purchaseUnitPrice || "",
        guaranteeExpireDate: initialData.guaranteeExpireDate || "",
        persistPeriod: initialData.persistPeriod || undefined,
      });
    }
  }, [mode, initialData, form]);

  const onSubmit = (data: FacilityFormData) => {
    const payload: FacilityVO = {
      id: facilityId,
      companyId: data.companyId,
      buildingId: data.buildingId,
      buildingFloorId: data.buildingFloorId,
      buildingFloorZoneId: data.buildingFloorZoneId,
      facilityMasterId: data.facilityMasterId,
      facilityNo: data.facilityNo || "",
      facilityName: data.facilityName,
      use: data.use,
      state: data.state,
      buildingUserGroupId: data.buildingUserGroupId,
      makingCompany: data.makingCompany,
      makeDate: data.makeDate,
      sellCompany: data.sellCompany,
      sellCompanyPhone: data.sellCompanyPhone,
      capacity: data.capacity,
      electricityConsumption: data.electricityConsumption,
      cop: data.cop,
      modelName: data.modelName,
      snNo: data.snNo,
      installDate: data.installDate,
      startRunDate: data.startRunDate,
      chargerId: data.chargerId,
      purchaseUnitPrice: data.purchaseUnitPrice,
      guaranteeExpireDate: data.guaranteeExpireDate,
      persistPeriod: data.persistPeriod,
    };

    if (mode === "create") {
      addFacility.mutate(payload, {
        onSuccess: (result) => {
          router.push(`/facilities/${result.id}`);
        },
      });
    } else {
      updateFacility.mutate(payload, {
        onSuccess: () => {
          router.push(`/facilities/${facilityId}`);
        },
      });
    }
  };

  const isPending = addFacility.isPending || updateFacility.isPending;

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
              {mode === "create" ? "새 시설 등록" : "시설 수정"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "create"
                ? "새로운 시설을 등록합니다."
                : "시설 정보를 수정합니다."}
            </p>
          </div>
        </div>
        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={isPending}
        >
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
                  <Wrench className="h-4 w-4" />
                  기본 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="facilityName">시설명 *</Label>
                    <Input
                      id="facilityName"
                      placeholder="시설명을 입력하세요"
                      {...form.register("facilityName")}
                    />
                    {form.formState.errors.facilityName && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.facilityName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facilityNo">장비번호</Label>
                    <Input
                      id="facilityNo"
                      placeholder="장비번호"
                      {...form.register("facilityNo")}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="use">용도 *</Label>
                    <Input
                      id="use"
                      placeholder="용도를 입력하세요"
                      {...form.register("use")}
                    />
                    {form.formState.errors.use && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.use.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">상태 *</Label>
                    <Select
                      value={form.watch("state")}
                      onValueChange={(value) =>
                        form.setValue("state", value as FacilityState)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="상태 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(FacilityStateLabel).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="snNo">시리얼번호</Label>
                    <Input
                      id="snNo"
                      placeholder="시리얼번호"
                      {...form.register("snNo")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cop">COP</Label>
                    <Input
                      id="cop"
                      placeholder="COP"
                      {...form.register("cop")}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 위치 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  위치
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>빌딩 *</Label>
                    <Select
                      value={String(form.watch("buildingId") || "")}
                      onValueChange={(value) =>
                        form.setValue("buildingId", Number(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="빌딩 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* TODO: 빌딩 목록 API 연동 */}
                        <SelectItem value="1">본사 빌딩</SelectItem>
                        <SelectItem value="2">지사 빌딩</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.buildingId && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.buildingId.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>층 *</Label>
                    <Select
                      value={String(form.watch("buildingFloorId") || "")}
                      onValueChange={(value) =>
                        form.setValue("buildingFloorId", Number(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="층 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* TODO: 층 목록 API 연동 */}
                        <SelectItem value="1">1층</SelectItem>
                        <SelectItem value="2">2층</SelectItem>
                        <SelectItem value="3">3층</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.buildingFloorId && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.buildingFloorId.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 일정 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  일정
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="makeDate">제조일</Label>
                    <Input
                      id="makeDate"
                      type="date"
                      {...form.register("makeDate")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="installDate">설치일</Label>
                    <Input
                      id="installDate"
                      type="date"
                      {...form.register("installDate")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startRunDate">운전시작일</Label>
                    <Input
                      id="startRunDate"
                      type="date"
                      {...form.register("startRunDate")}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 우측 사이드바 */}
          <div className="space-y-6">
            {/* 분류 */}
            <Card>
              <CardHeader>
                <CardTitle>분류</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>시설 유형 *</Label>
                  <Select
                    value={String(form.watch("facilityMasterId") || "")}
                    onValueChange={(value) =>
                      form.setValue("facilityMasterId", Number(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="시설 유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* TODO: 시설 유형 목록 API 연동 */}
                      <SelectItem value="1">공조기</SelectItem>
                      <SelectItem value="2">보일러</SelectItem>
                      <SelectItem value="3">펌프</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.facilityMasterId && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.facilityMasterId.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 담당 */}
            <Card>
              <CardHeader>
                <CardTitle>담당</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>작업팀 *</Label>
                  <Select
                    value={String(form.watch("buildingUserGroupId") || "")}
                    onValueChange={(value) =>
                      form.setValue("buildingUserGroupId", Number(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="작업팀 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* TODO: 작업팀 목록 API 연동 */}
                      <SelectItem value="1">시설팀</SelectItem>
                      <SelectItem value="2">기계팀</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.buildingUserGroupId && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.buildingUserGroupId.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 납품 정보 */}
            <Card>
              <CardHeader>
                <CardTitle>납품 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sellCompany">납품업체</Label>
                  <Input
                    id="sellCompany"
                    placeholder="납품업체"
                    {...form.register("sellCompany")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sellCompanyPhone">연락처</Label>
                  <Input
                    id="sellCompanyPhone"
                    placeholder="연락처"
                    {...form.register("sellCompanyPhone")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guaranteeExpireDate">보증만료일</Label>
                  <Input
                    id="guaranteeExpireDate"
                    type="date"
                    {...form.register("guaranteeExpireDate")}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
