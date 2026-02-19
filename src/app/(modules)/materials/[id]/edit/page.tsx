"use client";

import { useParams, useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

import { EmptyState } from "@/components/data-display/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

import { useMaterialView } from "@/lib/hooks/use-materials";
import { MaterialForm } from "../../_components/material-form";

function FormSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  );
}

export default function EditMaterialPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { data, isLoading, isError } = useMaterialView(id);

  if (isLoading) {
    return <FormSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="p-6">
        <EmptyState
          icon={AlertCircle}
          title="자재를 찾을 수 없습니다"
          description="요청하신 자재가 존재하지 않거나 접근 권한이 없습니다."
          action={{
            label: "목록으로 돌아가기",
            onClick: () => router.push("/materials"),
          }}
        />
      </div>
    );
  }

  return <MaterialForm mode="edit" initialData={data} materialId={id} />;
}
