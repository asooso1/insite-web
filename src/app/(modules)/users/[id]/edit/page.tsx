"use client";

import { useParams, useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

import { EmptyState } from "@/components/data-display/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

import { useUserView } from "@/lib/hooks/use-users";
import { UserForm } from "../../_components/user-form";

// ============================================================================
// 로딩 스켈레톤
// ============================================================================

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
        <div className="space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 메인 페이지 컴포넌트
// ============================================================================

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { data, isLoading, isError } = useUserView(id);

  if (isLoading) {
    return <FormSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="p-6">
        <EmptyState
          icon={AlertCircle}
          title="사용자를 찾을 수 없습니다"
          description="요청하신 사용자가 존재하지 않거나 접근 권한이 없습니다."
          action={{
            label: "목록으로 돌아가기",
            onClick: () => router.push("/users"),
          }}
        />
      </div>
    );
  }

  return <UserForm mode="edit" initialData={data} userId={id} />;
}
