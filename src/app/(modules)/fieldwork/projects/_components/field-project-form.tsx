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
  useCreateFieldProject,
  useUpdateFieldProject,
} from "@/lib/hooks/use-field-projects";
import {
  FieldProjectStatus,
  FieldProjectStatusLabel,
  type FieldProjectDTO,
  type FieldProjectCreateVO,
} from "@/lib/types/field-project";
import { useAuthStore } from "@/lib/stores/auth-store";

// ============================================================================
// 검증 스키마
// ============================================================================

const fieldProjectSchema = z.object({
  projectName: z.string().min(1, "프로젝트명은 필수입니다"),
  status: z.enum([
    FieldProjectStatus.PLANNING,
    FieldProjectStatus.ACTIVE,
    FieldProjectStatus.INACTIVE,
    FieldProjectStatus.COMPLETED,
    FieldProjectStatus.CANCELLED,
  ]),
  startDate: z.string().min(1, "시작일은 필수입니다"),
  endDate: z.string().min(1, "종료일은 필수입니다"),
  description: z.string().optional(),
  address: z.string().optional(),
  addressDetail: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  geofenceRadius: z.number().optional(),
});

type FieldProjectFormData = z.infer<typeof fieldProjectSchema>;

// ============================================================================
// 컴포넌트
// ============================================================================

interface FieldProjectFormProps {
  mode: "create" | "edit";
  data?: FieldProjectDTO;
}

export function FieldProjectForm({ mode, data }: FieldProjectFormProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const createMutation = useCreateFieldProject();
  const updateMutation = useUpdateFieldProject();

  const buildingId = Number(user?.currentBuildingId ?? 0);
  const buildingName = user?.currentBuildingName ?? "";

  const form = useForm<FieldProjectFormData>({
    resolver: zodResolver(fieldProjectSchema),
    defaultValues: {
      projectName: data?.projectName ?? "",
      status: data?.status ?? FieldProjectStatus.PLANNING,
      startDate: data?.startDate.split("T")[0] ?? "",
      endDate: data?.endDate.split("T")[0] ?? "",
      description: data?.description ?? "",
      address: data?.address ?? "",
      addressDetail: data?.addressDetail ?? "",
      latitude: data?.latitude ?? undefined,
      longitude: data?.longitude ?? undefined,
      geofenceRadius: data?.geofenceRadius ?? undefined,
    },
  });

  const onSubmit = async (formData: FieldProjectFormData) => {
    try {
      const payload: FieldProjectCreateVO = {
        ...formData,
        buildingId,
      };

      if (mode === "create") {
        await createMutation.mutateAsync(payload);
        router.push("/fieldwork/projects");
      } else if (data) {
        await updateMutation.mutateAsync({ id: data.id, data: payload });
        router.push(`/fieldwork/projects/${data.id}`);
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
            name="projectName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>프로젝트명 *</FormLabel>
                <FormControl>
                  <Input placeholder="프로젝트명 입력" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <FormLabel className="text-sm font-medium">빌딩</FormLabel>
              <Input
                value={buildingName}
                disabled
                className="mt-1"
              />
            </div>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>상태 *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(FieldProjectStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {FieldProjectStatusLabel[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>시작일 *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>종료일 *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>설명</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="프로젝트 설명 입력"
                    className="min-h-24"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 위치 정보 */}
        <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="font-semibold text-foreground">위치 정보</h3>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>주소</FormLabel>
                <FormControl>
                  <Input placeholder="주소 입력" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="addressDetail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>상세주소</FormLabel>
                <FormControl>
                  <Input placeholder="상세주소 입력" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>위도</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.000001" placeholder="위도" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>경도</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.000001" placeholder="경도" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="geofenceRadius"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Geofence 반경 (m)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="반경 (미터)" {...field} />
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
