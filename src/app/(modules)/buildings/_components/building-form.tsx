"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, Building2, MapPin, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";
import { useAddBuilding, useEditBuilding } from "@/lib/hooks/use-buildings";
import {
  BuildingState,
  BuildingStateLabel,
  type BuildingFullDTO,
  type BuildingSaveVO,
} from "@/lib/types/building";

// ============================================================================
// 폼 스키마
// ============================================================================

const buildingSchema = z.object({
  companyId: z.number().min(1, "고객사 ID를 입력해주세요"),
  name: z.string().min(1, "건물명을 입력해주세요"),
  state: z.string().min(1, "상태를 선택해주세요"),
  officePhone: z.string().optional(),
  useType2Id: z.number().min(1, "건물 용도를 입력해주세요"),
  baseAreaId: z.number().min(1, "거점을 입력해주세요"),
  wideAreaId: z.number().min(1, "광역을 입력해주세요"),
  latitude: z.string().min(1, "위도를 입력해주세요"),
  longitude: z.string().min(1, "경도를 입력해주세요"),
  zipCode: z.string().min(1, "우편번호를 입력해주세요"),
  address: z.string().min(1, "지번주소를 입력해주세요"),
  addressRoad: z.string().optional(),
  addressDetail: z.string().min(1, "상세주소를 입력해주세요"),
  contractTermStart: z.string().optional(),
  contractTermEnd: z.string().optional(),
  serviceNcp: z.boolean().optional(),
  serviceFms: z.boolean().optional(),
  serviceRms: z.boolean().optional(),
  serviceEms: z.boolean().optional(),
  serviceBim: z.boolean().optional(),
  servicePatrol: z.boolean().optional(),
  note: z.string().optional(),
});

type BuildingFormData = z.infer<typeof buildingSchema>;

// ============================================================================
// Props
// ============================================================================

interface BuildingFormProps {
  mode: "create" | "edit";
  initialData?: BuildingFullDTO;
  buildingId?: number;
}

// ============================================================================
// 메인 폼 컴포넌트
// ============================================================================

export function BuildingForm({ mode, initialData, buildingId }: BuildingFormProps) {
  const router = useRouter();
  const addBuilding = useAddBuilding();
  const editBuilding = useEditBuilding();

  const form = useForm<BuildingFormData>({
    resolver: zodResolver(buildingSchema),
    defaultValues: {
      companyId: 0,
      name: "",
      state: BuildingState.BEFORE_CONSTRUCT,
      officePhone: "",
      useType2Id: 0,
      baseAreaId: 0,
      wideAreaId: 0,
      latitude: "",
      longitude: "",
      zipCode: "",
      address: "",
      addressRoad: "",
      addressDetail: "",
      contractTermStart: "",
      contractTermEnd: "",
      serviceNcp: false,
      serviceFms: false,
      serviceRms: false,
      serviceEms: false,
      serviceBim: false,
      servicePatrol: false,
      note: "",
    },
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset({
        companyId: initialData.companyId ?? 0,
        name: initialData.name ?? "",
        state: initialData.state ?? BuildingState.BEFORE_CONSTRUCT,
        officePhone: initialData.officePhone ?? "",
        useType2Id: initialData.useType2Id ?? 0,
        baseAreaId: initialData.baseAreaId ?? 0,
        wideAreaId: initialData.wideAreaId ?? 0,
        latitude: initialData.latitude ?? "",
        longitude: initialData.longitude ?? "",
        zipCode: initialData.zipCode ?? "",
        address: initialData.address ?? "",
        addressRoad: initialData.addressRoad ?? "",
        addressDetail: initialData.addressDetail ?? "",
        contractTermStart: initialData.contractTermStart ?? "",
        contractTermEnd: initialData.contractTermEnd ?? "",
        serviceNcp: initialData.serviceNcp ?? false,
        serviceFms: initialData.serviceFms ?? false,
        serviceRms: initialData.serviceRms ?? false,
        serviceEms: initialData.serviceEms ?? false,
        serviceBim: initialData.serviceBim ?? false,
        servicePatrol: initialData.servicePatrol ?? false,
        note: initialData.note ?? "",
      });
    }
  }, [mode, initialData, form]);

  const onSubmit = (data: BuildingFormData) => {
    const payload: BuildingSaveVO = {
      companyId: data.companyId,
      name: data.name,
      state: data.state as BuildingState,
      officePhone: data.officePhone,
      useType2Id: data.useType2Id,
      baseAreaId: data.baseAreaId,
      wideAreaId: data.wideAreaId,
      latitude: data.latitude,
      longitude: data.longitude,
      zipCode: data.zipCode,
      address: data.address,
      addressRoad: data.addressRoad,
      addressDetail: data.addressDetail,
      contractTermStart: data.contractTermStart || undefined,
      contractTermEnd: data.contractTermEnd || undefined,
      serviceNcp: data.serviceNcp,
      serviceFms: data.serviceFms,
      serviceRms: data.serviceRms,
      serviceEms: data.serviceEms,
      serviceBim: data.serviceBim,
      servicePatrol: data.servicePatrol,
      note: data.note,
    };

    if (mode === "create") {
      addBuilding.mutate(payload, {
        onSuccess: (result) => {
          toast.success("건물이 등록되었습니다.");
          router.push(`/buildings/${result.id}`);
        },
        onError: () => {
          toast.error("건물 등록에 실패했습니다.");
        },
      });
    } else {
      editBuilding.mutate(
        { ...payload, id: buildingId },
        {
          onSuccess: () => {
            toast.success("건물 정보가 수정되었습니다.");
            router.push(`/buildings/${buildingId}`);
          },
          onError: () => {
            toast.error("건물 수정에 실패했습니다.");
          },
        }
      );
    }
  };

  const isPending = addBuilding.isPending || editBuilding.isPending;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="뒤로가기">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {mode === "create" ? "새 건물 등록" : "건물 수정"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "create"
                ? "새로운 건물을 등록합니다."
                : "건물 정보를 수정합니다."}
            </p>
          </div>
        </div>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
          <Save className="mr-2 h-4 w-4" />
          {isPending ? "저장 중..." : "저장"}
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
                  <Building2 className="h-4 w-4" />
                  기본 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">건물명 *</Label>
                    <Input
                      id="name"
                      placeholder="건물명을 입력하세요"
                      {...form.register("name")}
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">상태 *</Label>
                    <Select
                      value={form.watch("state") ?? ""}
                      onValueChange={(value) => form.setValue("state", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="상태 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(BuildingStateLabel).map(([key, label]) => (
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
                    <Label htmlFor="companyId">고객사 ID *</Label>
                    <Input
                      id="companyId"
                      type="number"
                      placeholder="고객사 ID"
                      {...form.register("companyId", { valueAsNumber: true })}
                    />
                    {form.formState.errors.companyId && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.companyId.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="officePhone">대표 전화</Label>
                    <Input
                      id="officePhone"
                      placeholder="02-0000-0000"
                      {...form.register("officePhone")}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="useType2Id">건물 용도 ID *</Label>
                    <Input
                      id="useType2Id"
                      type="number"
                      placeholder="용도 ID"
                      {...form.register("useType2Id", { valueAsNumber: true })}
                    />
                    {form.formState.errors.useType2Id && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.useType2Id.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wideAreaId">광역 ID *</Label>
                    <Input
                      id="wideAreaId"
                      type="number"
                      placeholder="광역 ID"
                      {...form.register("wideAreaId", { valueAsNumber: true })}
                    />
                    {form.formState.errors.wideAreaId && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.wideAreaId.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="baseAreaId">거점 ID *</Label>
                    <Input
                      id="baseAreaId"
                      type="number"
                      placeholder="거점 ID"
                      {...form.register("baseAreaId", { valueAsNumber: true })}
                    />
                    {form.formState.errors.baseAreaId && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.baseAreaId.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 주소 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  위치
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">우편번호 *</Label>
                    <Input
                      id="zipCode"
                      placeholder="우편번호"
                      {...form.register("zipCode")}
                    />
                    {form.formState.errors.zipCode && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.zipCode.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">지번주소 *</Label>
                  <Input
                    id="address"
                    placeholder="지번주소"
                    {...form.register("address")}
                  />
                  {form.formState.errors.address && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.address.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressRoad">도로명주소</Label>
                  <Input
                    id="addressRoad"
                    placeholder="도로명주소"
                    {...form.register("addressRoad")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressDetail">상세주소 *</Label>
                  <Input
                    id="addressDetail"
                    placeholder="상세주소"
                    {...form.register("addressDetail")}
                  />
                  {form.formState.errors.addressDetail && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.addressDetail.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">위도 *</Label>
                    <Input
                      id="latitude"
                      placeholder="37.5665"
                      {...form.register("latitude")}
                    />
                    {form.formState.errors.latitude && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.latitude.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">경도 *</Label>
                    <Input
                      id="longitude"
                      placeholder="126.9780"
                      {...form.register("longitude")}
                    />
                    {form.formState.errors.longitude && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.longitude.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 우측 사이드바 */}
          <div className="space-y-6">
            {/* 계약 기간 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  계약 기간
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contractTermStart">계약 시작일</Label>
                  <Input
                    id="contractTermStart"
                    type="date"
                    {...form.register("contractTermStart")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contractTermEnd">계약 종료일</Label>
                  <Input
                    id="contractTermEnd"
                    type="date"
                    {...form.register("contractTermEnd")}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 서비스 */}
            <Card>
              <CardHeader>
                <CardTitle>서비스</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(
                  [
                    { key: "serviceNcp", label: "NCP" },
                    { key: "serviceFms", label: "FMS" },
                    { key: "serviceRms", label: "RMS" },
                    { key: "serviceEms", label: "EMS" },
                    { key: "serviceBim", label: "BIM" },
                    { key: "servicePatrol", label: "순찰" },
                  ] as const
                ).map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-2">
                    <Checkbox
                      id={key}
                      checked={form.watch(key) ?? false}
                      onCheckedChange={(checked) =>
                        form.setValue(key, checked === true)
                      }
                    />
                    <Label htmlFor={key} className="font-normal cursor-pointer">
                      {label}
                    </Label>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 비고 */}
            <Card>
              <CardHeader>
                <CardTitle>비고</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="비고를 입력하세요"
                  rows={4}
                  {...form.register("note")}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
