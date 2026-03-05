"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useCreateFieldWorkOrder,
  useUpdateFieldWorkOrder,
} from "@/lib/hooks/use-field-work-orders";
import {
  FieldWorkOrderPriority,
  FieldWorkOrderPriorityLabel,
  type FieldWorkOrderDetailDTO,
  type FieldWorkOrderCreateVO,
} from "@/lib/types/field-work-order";

// ============================================================================
// 검증 스키마
// ============================================================================

const fieldWorkOrderSchema = z.object({
  projectId: z.number().min(1, "프로젝트는 필수입니다"),
  title: z.string().min(1, "제목은 필수입니다"),
  description: z.string().optional(),
  priority: z.enum([
    FieldWorkOrderPriority.URGENT,
    FieldWorkOrderPriority.HIGH,
    FieldWorkOrderPriority.MEDIUM,
    FieldWorkOrderPriority.LOW,
  ]),
  startDateTime: z.string().optional(),
  endDateTime: z.string().optional(),
  poiId: z.number().optional(),
});

type FieldWorkOrderFormData = z.infer<typeof fieldWorkOrderSchema>;

// ============================================================================
// 컴포넌트
// ============================================================================

interface FieldWorkOrderFormProps {
  mode: "create" | "edit";
  data?: FieldWorkOrderDetailDTO;
  projects?: Array<{ id: number; projectName: string }>;
}

export function FieldWorkOrderForm({
  mode,
  data,
  projects = [],
}: FieldWorkOrderFormProps) {
  const router = useRouter();
  const createMutation = useCreateFieldWorkOrder();
  const updateMutation = useUpdateFieldWorkOrder();

  const form = useForm<FieldWorkOrderFormData>({
    resolver: zodResolver(fieldWorkOrderSchema),
    defaultValues: {
      projectId: data?.projectId ?? 0,
      title: data?.title ?? "",
      description: data?.description ?? "",
      priority: data?.priority ?? FieldWorkOrderPriority.MEDIUM,
      startDateTime: data?.startDateTime ?? "",
      endDateTime: data?.endDateTime ?? "",
      poiId: data?.poiId ?? undefined,
    },
  });

  const onSubmit = async (formData: FieldWorkOrderFormData) => {
    try {
      const payload: FieldWorkOrderCreateVO = formData;

      if (mode === "create") {
        await createMutation.mutateAsync(payload);
        router.push("/fieldwork/work-orders");
      } else if (data) {
        await updateMutation.mutateAsync({ id: data.id, data: payload });
        router.push(`/fieldwork/work-orders/${data.id}`);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* 기본 정보 */}
        <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="font-semibold text-foreground">기본 정보</h3>

          <FormField
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>프로젝트 *</FormLabel>
                <Select
                  value={String(field.value)}
                  onValueChange={(val) => field.onChange(Number(val))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="프로젝트 선택" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={String(project.id)}>
                        {project.projectName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>제목 *</FormLabel>
                <FormControl>
                  <Input placeholder="작업 제목 입력" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>설명</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="작업 설명 입력"
                    className="min-h-24"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>우선순위 *</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(FieldWorkOrderPriority).map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {FieldWorkOrderPriorityLabel[priority]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 일정 정보 */}
        <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="font-semibold text-foreground">일정 정보</h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="startDateTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>시작 예정일시</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDateTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>종료 예정일시</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="poiId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>위치 ID</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="위치 ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 액션 버튼 */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            취소
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "저장 중..." : "저장"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
