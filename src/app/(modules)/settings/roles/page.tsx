"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Shield, ChevronRight } from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { DataTable } from "@/components/data-display/data-table";
import { EmptyState } from "@/components/data-display/empty-state";

import { useRoleList } from "@/lib/hooks/use-roles";
import type { RoleDTO } from "@/lib/types/role";
import type { ColumnDef } from "@tanstack/react-table";

// ============================================================================
// 컬럼 정의
// ============================================================================

function useColumns(): ColumnDef<RoleDTO>[] {
  const router = useRouter();

  return useMemo(
    () => [
      {
        accessorKey: "id",
        header: "No",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.id}</span>
        ),
        size: 70,
      },
      {
        accessorKey: "code",
        header: "역할 코드",
        cell: ({ row }) => (
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
            {row.original.code}
          </code>
        ),
        size: 200,
      },
      {
        accessorKey: "name",
        header: "역할명",
        cell: ({ row }) => (
          <button
            onClick={() => router.push(`/settings/roles/${row.original.id}`)}
            className="text-left font-medium text-primary hover:underline"
          >
            {row.original.name}
          </button>
        ),
        size: 180,
      },
      {
        accessorKey: "description",
        header: "설명",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.description || "-"}
          </span>
        ),
        size: 300,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <button
            onClick={() => router.push(`/settings/roles/${row.original.id}`)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            aria-label={`${row.original.name} 권한 설정`}
          >
            권한 설정
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
        ),
        size: 100,
      },
    ],
    [router]
  );
}

// ============================================================================
// 메인 페이지 컴포넌트
// ============================================================================

export default function RoleListPage() {
  const { data, isLoading, isError, refetch } = useRoleList();
  const columns = useColumns();

  if (isError) {
    return (
      <EmptyState
        icon={Shield}
        title="데이터를 불러올 수 없습니다"
        description="잠시 후 다시 시도해주세요."
        action={{ label: "다시 시도", onClick: () => refetch() }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="역할 권한 관리"
        description="역할별 메뉴 접근 권한을 관리합니다."
        icon={Shield}
      />

      <DataTable
        columns={columns}
        data={data ?? []}
        loading={isLoading}
        pagination={false}
      />
    </div>
  );
}
