"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useCreateTbm, useUpdateTbm } from "@/lib/hooks/use-tbms";
import {
  TbmType,
  TbmTypeLabel,
  TbmState,
  TbmStateLabel,
  type TbmDTO,
} from "@/lib/types/tbm";
import { useAuthStore } from "@/lib/stores/auth-store";

// ============================================================================
// 유효성 스키마
// ============================================================================

const tbmSchema = z.object({
  name: z.string().min(1, "TBM명을 입력해주세요"),
  tbmType: z.nativeEnum(TbmType),
  tbmState: z.nativeEnum(TbmState),
  buildingUserGroupId: z.number().min(1, "담당팀 ID를 입력해주세요"),
  cycle: z.number().optional(),
});

type TbmFormValues = z.infer<typeof tbmSchema>;

// ============================================================================
// Props
// ============================================================================

interface TbmFormProps {
  mode: "create" | "edit";
  initialData?: TbmDTO;
}

// ============================================================================
// 컴포넌트
// ============================================================================

export function TbmForm({ mode, initialData }: TbmFormProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const buildingId = Number(user?.currentBuildingId ?? 0);

  const createTbm = useCreateTbm();
  const updateTbm = useUpdateTbm();

  const form = useForm<TbmFormValues>({
    resolver: zodResolver(tbmSchema),
    defaultValues: {
      name: "",
      tbmType: TbmType.REGULAR,
      tbmState: TbmState.PLAN,
      buildingUserGroupId: undefined,
      cycle: undefined,
    },
  });

  // 수정 모드 초기값 설정
  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset({
        name: initialData.name,
        tbmType: initialData.tbmType,
        tbmState: initialData.tbmState,
        buildingUserGroupId: initialData.buildingUserGroupId,
        cycle: initialData.cycle ?? undefined,
      });
    }
  }, [mode, initialData, form]);

  const onSubmit = (values: TbmFormValues) => {
    const payload = { ...values, buildingId };

    if (mode === "create") {
      createTbm.mutate(payload, {
        onSuccess: () => router.push("/work-orders/tbm"),
      });
    } else if (mode === "edit" && initialData) {
      updateTbm.mutate(
        { id: initialData.id, data: payload },
        { onSuccess: () => router.push(`/work-orders/tbm/${initialData.id}`) }
      );
    }
  };

  const isPending = createTbm.isPending || updateTbm.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        {/* TBM명 */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>TBM명 *</FormLabel>
              <FormControl>
                <Input placeholder="TBM명을 입력하세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          {/* 구분 */}
          <FormField
            control={form.control}
            name="tbmType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>구분 *</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="구분 선택" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={TbmType.REGULAR}>{TbmTypeLabel.REGULAR}</SelectItem>
                    <SelectItem value={TbmType.SPECIAL}>{TbmTypeLabel.SPECIAL}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 상태 */}
          <FormField
            control={form.control}
            name="tbmState"
            render={({ field }) => (
              <FormItem>
                <FormLabel>상태 *</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="상태 선택" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={TbmState.PLAN}>{TbmStateLabel.PLAN}</SelectItem>
                    <SelectItem value={TbmState.PROGRESS}>{TbmStateLabel.PROGRESS}</SelectItem>
                    <SelectItem value={TbmState.COMPLETE}>{TbmStateLabel.COMPLETE}</SelectItem>
                    <SelectItem value={TbmState.HOLD}>{TbmStateLabel.HOLD}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* 담당팀 ID */}
          <FormField
            control={form.control}
            name="buildingUserGroupId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>담당팀 ID *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="담당팀 ID"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 주기 (정기일 때만) */}
          {form.watch("tbmType") === TbmType.REGULAR && (
            <FormField
              control={form.control}
              name="cycle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>주기 (일)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="예: 7"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* 빌딩 표시 (읽기 전용) */}
        <div>
          <Label>빌딩</Label>
          <Input value={user?.currentBuildingName ?? ""} disabled className="mt-1.5" />
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "create" ? "등록" : "수정"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            취소
          </Button>
        </div>
      </form>
    </Form>
  );
}
