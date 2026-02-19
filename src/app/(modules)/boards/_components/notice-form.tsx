"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, Megaphone } from "lucide-react";

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

import { useAddNotice, useEditNotice } from "@/lib/hooks/use-boards";
import {
  NoticeType,
  NoticeTypeLabel,
  NoticeTargetGroup,
  NoticeTargetGroupLabel,
  type NoticeDTO,
  type NoticeVO,
} from "@/lib/types/board";

// ============================================================================
// 폼 스키마
// ============================================================================

const noticeSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요").max(255, "제목은 255자 이하여야 합니다"),
  contents: z.string().min(1, "내용을 입력해주세요"),
  noticeType: z.string().min(1, "유형을 선택해주세요"),
  allCompany: z.boolean(),
  companyId: z.number().optional(),
  buildingId: z.number().optional(),
  postTermStart: z.string().min(1, "게시 시작일을 입력해주세요"),
  postTermEnd: z.string().min(1, "게시 종료일을 입력해주세요"),
  isAlert: z.boolean(),
  isMajor: z.boolean(),
  commentEnabled: z.boolean(),
  targetGroups: z.array(z.string()),
});

type NoticeFormData = z.infer<typeof noticeSchema>;

// ============================================================================
// Props
// ============================================================================

interface NoticeFormProps {
  mode: "create" | "edit";
  initialData?: NoticeDTO;
  noticeId?: number;
}

// ============================================================================
// 메인 폼 컴포넌트
// ============================================================================

export function NoticeForm({ mode, initialData, noticeId }: NoticeFormProps) {
  const router = useRouter();

  const addNotice = useAddNotice();
  const editNotice = useEditNotice();

  const today = new Date().toISOString().split("T")[0] ?? "";
  const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0] ?? "";

  const form = useForm<NoticeFormData>({
    resolver: zodResolver(noticeSchema),
    defaultValues: {
      title: "",
      contents: "",
      noticeType: NoticeType.NORMAL,
      allCompany: true,
      companyId: undefined,
      buildingId: undefined,
      postTermStart: today,
      postTermEnd: nextMonth,
      isAlert: false,
      isMajor: false,
      commentEnabled: true,
      targetGroups: [],
    },
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset({
        title: initialData.title || "",
        contents: initialData.contents || "",
        noticeType: initialData.noticeType || NoticeType.NORMAL,
        allCompany: initialData.allCompany ?? true,
        companyId: initialData.noticeCompanyId || undefined,
        buildingId: initialData.noticeBuildingId || undefined,
        postTermStart: initialData.postTermStart?.split(" ")[0] ?? today,
        postTermEnd: initialData.postTermEnd?.split(" ")[0] ?? nextMonth,
        isAlert: initialData.alert ?? false,
        isMajor: initialData.isMajor ?? false,
        commentEnabled: initialData.commentEnabled ?? true,
        targetGroups: initialData.targetGroups || [],
      });
    }
  }, [mode, initialData, form, today, nextMonth]);

  const onSubmit = (data: NoticeFormData) => {
    const payload: NoticeVO = {
      id: noticeId,
      title: data.title,
      contents: data.contents,
      noticeType: data.noticeType as NoticeType,
      allCompany: data.allCompany,
      companyId: data.companyId,
      buildingId: data.buildingId,
      postTermStart: data.postTermStart,
      postTermEnd: data.postTermEnd,
      isAlert: data.isAlert,
      isMajor: data.isMajor,
      commentEnabled: data.commentEnabled,
      targetGroups: data.targetGroups,
    };

    if (mode === "create") {
      addNotice.mutate(payload, {
        onSuccess: (result) => {
          router.push(`/boards/notices/${result.id}`);
        },
      });
    } else {
      editNotice.mutate(payload, {
        onSuccess: () => {
          router.push(`/boards/notices/${noticeId}`);
        },
      });
    }
  };

  const isPending = addNotice.isPending || editNotice.isPending;

  const handleTargetGroupToggle = (group: string) => {
    const current = form.watch("targetGroups");
    if (current.includes(group)) {
      form.setValue(
        "targetGroups",
        current.filter((g) => g !== group)
      );
    } else {
      form.setValue("targetGroups", [...current, group]);
    }
  };

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
              {mode === "create" ? "새 공지사항" : "공지사항 수정"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "create"
                ? "새로운 공지사항을 등록합니다."
                : "공지사항을 수정합니다."}
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
                  <Megaphone className="h-4 w-4" />
                  기본 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>유형 *</Label>
                    <Select
                      value={form.watch("noticeType")}
                      onValueChange={(value) => form.setValue("noticeType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="유형 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(NoticeTypeLabel).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>대상 범위</Label>
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="allCompany"
                        checked={form.watch("allCompany")}
                        onChange={(e) => form.setValue("allCompany", e.target.checked)}
                        className="h-4 w-4 rounded border"
                      />
                      <Label htmlFor="allCompany">전체 고객사</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">제목 *</Label>
                  <Input
                    id="title"
                    placeholder="공지사항 제목을 입력하세요"
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
                    placeholder="공지사항 내용을 입력하세요"
                    rows={10}
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
            {/* 게시 설정 */}
            <Card>
              <CardHeader>
                <CardTitle>게시 설정</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="postTermStart">게시 시작일 *</Label>
                  <Input
                    id="postTermStart"
                    type="date"
                    {...form.register("postTermStart")}
                  />
                  {form.formState.errors.postTermStart && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.postTermStart.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postTermEnd">게시 종료일 *</Label>
                  <Input
                    id="postTermEnd"
                    type="date"
                    {...form.register("postTermEnd")}
                  />
                  {form.formState.errors.postTermEnd && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.postTermEnd.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isMajor"
                      checked={form.watch("isMajor")}
                      onChange={(e) => form.setValue("isMajor", e.target.checked)}
                      className="h-4 w-4 rounded border"
                    />
                    <Label htmlFor="isMajor">중요 공지 (상단 고정)</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isAlert"
                      checked={form.watch("isAlert")}
                      onChange={(e) => form.setValue("isAlert", e.target.checked)}
                      className="h-4 w-4 rounded border"
                    />
                    <Label htmlFor="isAlert">알림 발송</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="commentEnabled"
                      checked={form.watch("commentEnabled")}
                      onChange={(e) => form.setValue("commentEnabled", e.target.checked)}
                      className="h-4 w-4 rounded border"
                    />
                    <Label htmlFor="commentEnabled">댓글 허용</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 대상 그룹 */}
            <Card>
              <CardHeader>
                <CardTitle>대상 그룹</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(NoticeTargetGroupLabel).map(([key, label]) => (
                  <div key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`target-${key}`}
                      checked={form.watch("targetGroups").includes(key)}
                      onChange={() => handleTargetGroupToggle(key)}
                      className="h-4 w-4 rounded border"
                    />
                    <Label htmlFor={`target-${key}`}>{label}</Label>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
