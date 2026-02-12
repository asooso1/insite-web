"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Save,
  Send,
  Calendar,
  Building2,
  Users,
  FileText,
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
import { Switch } from "@/components/ui/switch";

import {
  useCreateWorkOrder,
  useUpdateWorkOrder,
  useIssueWorkOrder,
} from "@/lib/hooks/use-work-orders";
import {
  WorkOrderType,
  WorkOrderTypeLabel,
  type WorkOrderDTO,
  type WorkOrderVO,
} from "@/lib/types/work-order";

// ============================================================================
// 폼 스키마
// ============================================================================

const workOrderSchema = z.object({
  name: z.string().min(1, "작업명을 입력해주세요"),
  description: z.string().optional(),
  type: z.nativeEnum(WorkOrderType),
  autoConfirm: z.boolean(),
  planStartDate: z.string().min(1, "시작일을 선택해주세요"),
  planEndDate: z.string().min(1, "종료일을 선택해주세요"),
  deadline: z.number().min(0),
  buildingId: z.number().min(1, "빌딩을 선택해주세요"),
  buildingFloorId: z.number().optional(),
  buildingFloorZoneId: z.number().optional(),
  firstClassId: z.number().min(1, "작업 구분을 선택해주세요"),
  secondClassId: z.number().min(1, "작업 상세 구분을 선택해주세요"),
  buildingUserGroupId: z.number().min(1, "작업팀을 선택해주세요"),
  chargeAccountIds: z.array(z.number()).min(1, "담당자를 선택해주세요"),
  ccAccountIds: z.array(z.number()).optional(),
  approveAccountIds: z.array(z.number()).optional(),
  sendPush: z.boolean(),
  vocSendPush: z.boolean(),
  movieLinkUrl: z.string().optional(),
});

type WorkOrderFormData = z.infer<typeof workOrderSchema>;

// ============================================================================
// Props
// ============================================================================

interface WorkOrderFormProps {
  mode: "create" | "edit";
  initialData?: WorkOrderDTO;
  workOrderId?: number;
}

// ============================================================================
// 메인 폼 컴포넌트
// ============================================================================

export function WorkOrderForm({
  mode,
  initialData,
  workOrderId,
}: WorkOrderFormProps) {
  const router = useRouter();

  const createWorkOrder = useCreateWorkOrder();
  const updateWorkOrder = useUpdateWorkOrder();
  const issueWorkOrder = useIssueWorkOrder();

  const form = useForm<WorkOrderFormData>({
    resolver: zodResolver(workOrderSchema),
    defaultValues: {
      name: "",
      description: "",
      type: WorkOrderType.GENERAL,
      autoConfirm: false,
      planStartDate: "",
      planEndDate: "",
      deadline: 7,
      buildingId: 0,
      buildingFloorId: undefined,
      buildingFloorZoneId: undefined,
      firstClassId: 0,
      secondClassId: 0,
      buildingUserGroupId: 0,
      chargeAccountIds: [],
      ccAccountIds: [],
      approveAccountIds: [],
      sendPush: true,
      vocSendPush: false,
      movieLinkUrl: "",
    },
  });

  // 수정 모드일 때 초기값 설정
  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset({
        name: initialData.name,
        description: initialData.description,
        type: initialData.type,
        autoConfirm: initialData.autoConfirm,
        planStartDate: initialData.planStartDate?.split(" ")[0] || "",
        planEndDate: initialData.planEndDate?.split(" ")[0] || "",
        deadline: initialData.deadline,
        buildingId: initialData.buildingId,
        buildingFloorId: initialData.buildingFloorId || undefined,
        buildingFloorZoneId: initialData.buildingFloorZoneId || undefined,
        firstClassId: initialData.firstClassId,
        secondClassId: initialData.secondClassId,
        buildingUserGroupId: initialData.buildingUserGroupId,
        chargeAccountIds:
          initialData.workOrderChargeAccountDTOs?.map((a) => a.accountId) || [],
        ccAccountIds:
          initialData.workOrderCcAccountDTOs?.map((a) => a.accountId) || [],
        approveAccountIds:
          initialData.workOrderApproveAccountDTOs?.map((a) => a.accountId) || [],
        sendPush: initialData.sendPush,
        vocSendPush: initialData.vocSendPush,
        movieLinkUrl: initialData.movieLinkUrl || "",
      });
    }
  }, [mode, initialData, form]);

  const onSubmit = (data: WorkOrderFormData) => {
    const payload: WorkOrderVO = {
      ...data,
      id: workOrderId,
      description: data.description || "",
      chargeAccountIds: data.chargeAccountIds,
      ccAccountIds: data.ccAccountIds,
      approveAccountIds: data.approveAccountIds,
    };

    if (mode === "create") {
      createWorkOrder.mutate(payload, {
        onSuccess: (result) => {
          router.push(`/work-orders/${result.workOrderId}`);
        },
      });
    } else {
      updateWorkOrder.mutate(payload, {
        onSuccess: () => {
          router.push(`/work-orders/${workOrderId}`);
        },
      });
    }
  };

  const handleSaveAndIssue = () => {
    form.handleSubmit((data) => {
      const payload: WorkOrderVO = {
        ...data,
        id: workOrderId,
        description: data.description || "",
        chargeAccountIds: data.chargeAccountIds,
        ccAccountIds: data.ccAccountIds,
        approveAccountIds: data.approveAccountIds,
      };

      if (mode === "create") {
        createWorkOrder.mutate(payload, {
          onSuccess: (result) => {
            issueWorkOrder.mutate(result.workOrderId, {
              onSuccess: () => {
                router.push(`/work-orders/${result.workOrderId}`);
              },
            });
          },
        });
      } else if (workOrderId) {
        updateWorkOrder.mutate(payload, {
          onSuccess: () => {
            issueWorkOrder.mutate(workOrderId, {
              onSuccess: () => {
                router.push(`/work-orders/${workOrderId}`);
              },
            });
          },
        });
      }
    })();
  };

  const isPending =
    createWorkOrder.isPending ||
    updateWorkOrder.isPending ||
    issueWorkOrder.isPending;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {mode === "create" ? "새 작업 등록" : "작업 수정"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "create"
                ? "새로운 작업지시를 등록합니다."
                : "작업지시 정보를 수정합니다."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isPending}
          >
            <Save className="mr-2 h-4 w-4" />
            저장
          </Button>
          <Button onClick={handleSaveAndIssue} disabled={isPending}>
            <Send className="mr-2 h-4 w-4" />
            저장 후 발행
          </Button>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          {/* 좌측 메인 폼 */}
          <div className="md:col-span-2 space-y-6">
            {/* 기본 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  기본 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">작업명 *</Label>
                  <Input
                    id="name"
                    placeholder="작업명을 입력하세요"
                    {...form.register("name")}
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="type">작업 유형 *</Label>
                    <Select
                      value={form.watch("type")}
                      onValueChange={(value) =>
                        form.setValue("type", value as WorkOrderType)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="유형 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(WorkOrderTypeLabel).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline">작업기한 (일)</Label>
                    <Input
                      id="deadline"
                      type="number"
                      min={0}
                      {...form.register("deadline", { valueAsNumber: true })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">작업 내용</Label>
                  <Textarea
                    id="description"
                    placeholder="작업 내용을 입력하세요"
                    rows={6}
                    {...form.register("description")}
                  />
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
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="planStartDate">시작일 *</Label>
                    <Input
                      id="planStartDate"
                      type="date"
                      {...form.register("planStartDate")}
                    />
                    {form.formState.errors.planStartDate && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.planStartDate.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="planEndDate">종료일 *</Label>
                    <Input
                      id="planEndDate"
                      type="date"
                      {...form.register("planEndDate")}
                    />
                    {form.formState.errors.planEndDate && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.planEndDate.message}
                      </p>
                    )}
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

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>층</Label>
                    <Select
                      value={String(form.watch("buildingFloorId") || "")}
                      onValueChange={(value) =>
                        form.setValue("buildingFloorId", Number(value) || undefined)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="층 선택 (선택사항)" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* TODO: 층 목록 API 연동 */}
                        <SelectItem value="1">1층</SelectItem>
                        <SelectItem value="2">2층</SelectItem>
                        <SelectItem value="3">3층</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>구역</Label>
                    <Select
                      value={String(form.watch("buildingFloorZoneId") || "")}
                      onValueChange={(value) =>
                        form.setValue(
                          "buildingFloorZoneId",
                          Number(value) || undefined
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="구역 선택 (선택사항)" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* TODO: 구역 목록 API 연동 */}
                        <SelectItem value="1">A구역</SelectItem>
                        <SelectItem value="2">B구역</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 우측 사이드바 */}
          <div className="space-y-6">
            {/* 작업 구분 */}
            <Card>
              <CardHeader>
                <CardTitle>작업 구분</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>대분류 *</Label>
                  <Select
                    value={String(form.watch("firstClassId") || "")}
                    onValueChange={(value) =>
                      form.setValue("firstClassId", Number(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="대분류 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* TODO: 작업 분류 목록 API 연동 */}
                      <SelectItem value="1">일반</SelectItem>
                      <SelectItem value="2">시설</SelectItem>
                      <SelectItem value="3">청소</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.firstClassId && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.firstClassId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>소분류 *</Label>
                  <Select
                    value={String(form.watch("secondClassId") || "")}
                    onValueChange={(value) =>
                      form.setValue("secondClassId", Number(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="소분류 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* TODO: 작업 소분류 목록 API 연동 */}
                      <SelectItem value="1">점검</SelectItem>
                      <SelectItem value="2">수리</SelectItem>
                      <SelectItem value="3">교체</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.secondClassId && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.secondClassId.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 담당자 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  담당자
                </CardTitle>
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
                      <SelectItem value="2">청소팀</SelectItem>
                      <SelectItem value="3">보안팀</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.buildingUserGroupId && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.buildingUserGroupId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>담당자 *</Label>
                  <p className="text-sm text-muted-foreground">
                    {/* TODO: 담당자 선택 컴포넌트 */}
                    담당자 선택 기능 구현 예정
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>참조</Label>
                  <p className="text-sm text-muted-foreground">
                    {/* TODO: 참조자 선택 컴포넌트 */}
                    참조자 선택 기능 구현 예정
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>승인자</Label>
                  <p className="text-sm text-muted-foreground">
                    {/* TODO: 승인자 선택 컴포넌트 */}
                    승인자 선택 기능 구현 예정
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 알림 설정 */}
            <Card>
              <CardHeader>
                <CardTitle>알림 설정</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sendPush">푸시 알림</Label>
                  <Switch
                    id="sendPush"
                    checked={form.watch("sendPush")}
                    onCheckedChange={(checked) =>
                      form.setValue("sendPush", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="vocSendPush">VOC 알림</Label>
                  <Switch
                    id="vocSendPush"
                    checked={form.watch("vocSendPush")}
                    onCheckedChange={(checked) =>
                      form.setValue("vocSendPush", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="autoConfirm">자동 승인</Label>
                  <Switch
                    id="autoConfirm"
                    checked={form.watch("autoConfirm")}
                    onCheckedChange={(checked) =>
                      form.setValue("autoConfirm", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* 추가 옵션 */}
            <Card>
              <CardHeader>
                <CardTitle>추가 옵션</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="movieLinkUrl">동영상 링크</Label>
                  <Input
                    id="movieLinkUrl"
                    type="url"
                    placeholder="https://..."
                    {...form.register("movieLinkUrl")}
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
