"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

import {
  useCreateComplain,
  useBuildingFloors,
  useBuildingFloorZones,
} from "@/lib/hooks/use-complains";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { VocVO } from "@/lib/types/complain";

// ============================================================================
// 폼 스키마
// ============================================================================

const complainSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  vocUserName: z.string().min(1, "민원인 이름을 입력해주세요"),
  vocUserPhone: z.string().min(1, "연락처를 입력해주세요"),
  vocDate: z.string().min(1, "민원 발생 일시를 선택해주세요"),
  buildingFloorId: z.number().min(1, "층을 선택해주세요"),
  buildingFloorZoneId: z.number().min(1, "구역을 선택해주세요"),
  requestContents: z.string().min(1, "요청 내용을 입력해주세요"),
});

type ComplainFormData = z.infer<typeof complainSchema>;

// ============================================================================
// 제목 프리셋
// ============================================================================

const TITLE_PRESETS = [
  "더워요",
  "추워요",
  "청소해주세요",
  "전원 확인",
  "냄새 심해요",
];

// ============================================================================
// Props
// ============================================================================

interface ComplainFormProps {
  buildingId: number;
}

// ============================================================================
// 메인 폼 컴포넌트
// ============================================================================

export function ComplainForm({ buildingId }: ComplainFormProps) {
  const router = useRouter();
  const createComplain = useCreateComplain();

  const form = useForm<ComplainFormData>({
    resolver: zodResolver(complainSchema),
    defaultValues: {
      title: "",
      vocUserName: "",
      vocUserPhone: "",
      vocDate: "",
      buildingFloorId: 0,
      buildingFloorZoneId: 0,
      requestContents: "",
    },
  });

  // 층 목록 조회
  const selectedFloorId = form.watch("buildingFloorId");
  const { data: floors, isLoading: floorsLoading } =
    useBuildingFloors(buildingId);

  // 구역 목록 조회 (층 선택 후)
  const { data: zones, isLoading: zonesLoading } =
    useBuildingFloorZones(selectedFloorId);

  // 층 변경 시 구역 초기화
  const handleFloorChange = (floorId: string) => {
    const id = Number(floorId);
    form.setValue("buildingFloorId", id);
    form.setValue("buildingFloorZoneId", 0);
  };

  // 제목 프리셋 선택
  const handlePresetTitle = (preset: string) => {
    form.setValue("title", preset);
  };

  // 폼 제출
  const onSubmit = async (data: ComplainFormData) => {
    const payload: VocVO = {
      buildingId,
      buildingFloorId: data.buildingFloorId,
      buildingFloorZoneId: data.buildingFloorZoneId,
      vocUserName: data.vocUserName,
      vocUserPhone: data.vocUserPhone,
      vocDate: data.vocDate,
      title: data.title,
      requestContents: data.requestContents,
    };

    createComplain.mutate(payload, {
      onSuccess: () => {
        router.push("/work-orders/complain");
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>민원 등록</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 제목 섹션 */}
            <div className="space-y-3">
              <Label>제목 (프리셋)</Label>
              <div className="flex flex-wrap gap-2">
                {TITLE_PRESETS.map((preset) => (
                  <Button
                    key={preset}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handlePresetTitle(preset)}
                    className="h-8"
                  >
                    {preset}
                  </Button>
                ))}
              </div>
            </div>

            {/* 제목 직접 입력 */}
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                placeholder="제목을 입력해주세요"
                {...form.register("title")}
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            {/* 민원인 정보 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vocUserName">민원인 이름</Label>
                <Input
                  id="vocUserName"
                  placeholder="이름을 입력해주세요"
                  {...form.register("vocUserName")}
                />
                {form.formState.errors.vocUserName && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.vocUserName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="vocUserPhone">연락처</Label>
                <Input
                  id="vocUserPhone"
                  placeholder="연락처를 입력해주세요"
                  {...form.register("vocUserPhone")}
                />
                {form.formState.errors.vocUserPhone && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.vocUserPhone.message}
                  </p>
                )}
              </div>
            </div>

            {/* 민원 발생 일시 */}
            <div className="space-y-2">
              <Label htmlFor="vocDate">민원 발생 일시</Label>
              <Input
                id="vocDate"
                type="datetime-local"
                {...form.register("vocDate")}
              />
              {form.formState.errors.vocDate && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.vocDate.message}
                </p>
              )}
            </div>

            {/* 위치 선택 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="floor">층</Label>
                <Select
                  value={String(form.watch("buildingFloorId") || "")}
                  onValueChange={handleFloorChange}
                >
                  <SelectTrigger id="floor" disabled={floorsLoading}>
                    <SelectValue placeholder="층을 선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {floors?.map((floor) => (
                      <SelectItem key={floor.id} value={String(floor.id)}>
                        {floor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.buildingFloorId && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.buildingFloorId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="zone">구역</Label>
                <Select
                  value={String(form.watch("buildingFloorZoneId") || "")}
                  onValueChange={(value) =>
                    form.setValue("buildingFloorZoneId", Number(value))
                  }
                  disabled={!selectedFloorId || zonesLoading}
                >
                  <SelectTrigger id="zone">
                    <SelectValue placeholder="구역을 선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {zones?.map((zone) => (
                      <SelectItem key={zone.id} value={String(zone.id)}>
                        {zone.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.buildingFloorZoneId && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.buildingFloorZoneId.message}
                  </p>
                )}
              </div>
            </div>

            {/* 요청 내용 */}
            <div className="space-y-2">
              <Label htmlFor="requestContents">요청 내용</Label>
              <Textarea
                id="requestContents"
                placeholder="요청 내용을 입력해주세요"
                rows={6}
                {...form.register("requestContents")}
              />
              {form.formState.errors.requestContents && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.requestContents.message}
                </p>
              )}
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
              <Button
                type="submit"
                disabled={createComplain.isPending}
              >
                {createComplain.isPending ? "등록 중..." : "등록"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
