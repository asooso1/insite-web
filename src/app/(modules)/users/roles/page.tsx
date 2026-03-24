"use client";

import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Eye, AlertCircle, Inbox } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/data-display/data-table";
import { EmptyState } from "@/components/data-display/empty-state";
import { PageHeader } from "@/components/common/page-header";

import { useRoleList } from "@/lib/hooks/use-roles";
import type { RoleDTO } from "@/lib/types/role";
import type { ColumnDef, Row } from "@tanstack/react-table";

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
        size: 80,
      },
      {
        accessorKey: "code",
        header: "역할코드",
        cell: ({ row }) => (
          <button
            onClick={() =>
              router.push(`/users/roles/${row.original.id}`)
            }
            className="text-left font-medium text-primary hover:underline"
          >
            {row.original.code}
          </button>
        ),
        size: 150,
      },
      {
        accessorKey: "name",
        header: "역할명",
        cell: ({ row }) => <span>{row.original.name}</span>,
        size: 200,
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
        cell: ({ row }) => <RowActions row={row} />,
        size: 50,
      },
    ],
    [router]
  );
}

// ============================================================================
// 행 액션
// ============================================================================

function RowActions({ row }: { row: Row<RoleDTO> }) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="상세 보기">
          <Eye aria-hidden="true" className="h-4 w-4" />
          <span className="sr-only">메뉴 열기</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => router.push(`/users/roles/${row.original.id}`)}
        >
          <Eye aria-hidden="true" className="mr-2 h-4 w-4" />
          상세 보기
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================================================
// 메인 페이지 컴포넌트
// ============================================================================

export default function RoleListPage() {
  const router = useRouter();

  // 데이터 조회
  const { data, isLoading, isError, refetch } = useRoleList();

  // 컬럼
  const columns = useColumns();

  // 에러 처리
  if (isError) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="데이터를 불러올 수 없습니다"
        description="잠시 후 다시 시도해주세요."
        action={{ label: "다시 시도", onClick: () => refetch() }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* 헤더 */}
      <PageHeader
        title="역할 목록"
        description="시스템 역할을 관리합니다."
      />

      {/* 테이블 */}
      <DataTable
        columns={columns}
        data={data ?? []}
        loading={isLoading}
        pagination={false}
      />

      {/* 데이터 없음 */}
      {!isLoading && (!data || data.length === 0) && (
        <EmptyState
          icon={Inbox}
          title="데이터가 없습니다."
          description="역할 정보를 확인해주세요."
        />
      )}
    </div>
  );
}
