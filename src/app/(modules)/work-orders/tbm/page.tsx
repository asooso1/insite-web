"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Inbox, AlertCircle, CalendarClock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-display/data-table";
import { StatusBadge } from "@/components/data-display/status-badge";
import { EmptyState } from "@/components/data-display/empty-state";
import { PageHeader } from "@/components/common/page-header";

import { useTbmList } from "@/lib/hooks/use-tbms";
import {
  TbmType,
  TbmTypeLabel,
  TbmState,
  TbmStateLabel,
  TbmStateStyle,
  type TbmDTO,
  type SearchTbmVO,
} from "@/lib/types/tbm";
import type { ColumnDef } from "@tanstack/react-table";

// ============================================================================
// 컬럼 정의
// ============================================================================

function useColumns(): ColumnDef<TbmDTO>[] {
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
        accessorKey: "tbmState",
        header: "상태",
        cell: ({ row }) => {
          const state = row.original.tbmState;
          return (
            <StatusBadge
              status={TbmStateStyle[state]}
              label={TbmStateLabel[state]}
            />
          );
        },
        size: 100,
      },
      {
        accessorKey: "name",
        header: "TBM명",
        cell: ({ row }) => (
          <button
            onClick={() => router.push(`/work-orders/tbm/${row.original.id}`)}
            className="text-left font-medium text-primary hover:underline"
          >
            {row.original.name}
          </button>
        ),
        size: 250,
      },
      {
        accessorKey: "tbmType",
        header: "구분",
        cell: ({ row }) => (
          <span>{TbmTypeLabel[row.original.tbmType]}</span>
        ),
        size: 80,
      },
      {
        accessorKey: "buildingDTO.name",
        header: "빌딩",
        cell: ({ row }) => (
          <span>{row.original.buildingDTO?.name ?? "-"}</span>
        ),
        size: 150,
      },
      {
        accessorKey: "userGroupDTO.name",
        header: "담당팀",
        cell: ({ row }) => (
          <span>{row.original.userGroupDTO?.name ?? "-"}</span>
        ),
        size: 120,
      },
      {
        accessorKey: "cycle",
        header: "주기",
        cell: ({ row }) => (
          <span>{row.original.cycle ? `${row.original.cycle}일` : "-"}</span>
        ),
        size: 80,
      },
      {
        accessorKey: "lastExecuteTime",
        header: "최근실행일",
        cell: ({ row }) => (
          <span className="text-sm">
            {row.original.lastExecuteTime?.split("T")[0] ?? "-"}
          </span>
        ),
        size: 120,
      },
      {
        accessorKey: "nextExecuteTime",
        header: "다음실행일",
        cell: ({ row }) => (
          <span className="text-sm">
            {row.original.nextExecuteTime?.split("T")[0] ?? "-"}
          </span>
        ),
        size: 120,
      },
      {
        accessorKey: "lastModifierName",
        header: "최종수정자",
        cell: ({ row }) => (
          <span>{row.original.lastModifierName ?? "-"}</span>
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

export default function TbmListPage() {
  const router = useRouter();

  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [tbmType, setTbmType] = useState<string>("");
  const [tbmState, setTbmState] = useState<string>("");
  const [keyword, setKeyword] = useState("");

  const searchParams: SearchTbmVO & { page: number; size: number } = useMemo(
    () => ({
      page,
      size,
      tbmType: (tbmType as TbmType) || undefined,
      tbmState: (tbmState as TbmState) || undefined,
      searchKeyword: keyword || undefined,
    }),
    [page, size, tbmType, tbmState, keyword]
  );

  const { data, isLoading, isError, refetch } = useTbmList(searchParams);
  const columns = useColumns();

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

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
      <PageHeader
        title="TBM 목록"
        description="작업전미팅을 관리합니다."
        icon={CalendarClock}
        actions={
          <Button onClick={() => router.push("/work-orders/tbm/new")}>
            <Plus className="mr-2 h-4 w-4" />
            TBM 등록
          </Button>
        }
      />

      {/* 필터 */}
      <div className="flex items-center gap-3">
        <Select
          value={tbmType || "ALL"}
          onValueChange={(v) => { setTbmType(v === "ALL" ? "" : v); setPage(0); }}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="구분" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">전체 구분</SelectItem>
            <SelectItem value={TbmType.REGULAR}>{TbmTypeLabel.REGULAR}</SelectItem>
            <SelectItem value={TbmType.SPECIAL}>{TbmTypeLabel.SPECIAL}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={tbmState || "ALL"}
          onValueChange={(v) => { setTbmState(v === "ALL" ? "" : v); setPage(0); }}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="상태" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">전체 상태</SelectItem>
            <SelectItem value={TbmState.PLAN}>{TbmStateLabel.PLAN}</SelectItem>
            <SelectItem value={TbmState.PROGRESS}>{TbmStateLabel.PROGRESS}</SelectItem>
            <SelectItem value={TbmState.COMPLETE}>{TbmStateLabel.COMPLETE}</SelectItem>
            <SelectItem value={TbmState.HOLD}>{TbmStateLabel.HOLD}</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="TBM명 검색..."
          value={keyword}
          onChange={(e) => { setKeyword(e.target.value); setPage(0); }}
          className="w-64"
        />
      </div>

      {/* 테이블 */}
      <DataTable
        columns={columns}
        data={data?.content ?? []}
        loading={isLoading}
      />

      {!isLoading && (!data?.content || data.content.length === 0) && (
        <EmptyState
          icon={Inbox}
          title="TBM이 없습니다"
          description="새 TBM을 등록해보세요."
          action={{ label: "TBM 등록", onClick: () => router.push("/work-orders/tbm/new") }}
        />
      )}

      {data && data.totalPages > 0 && (
        <div className="flex items-center justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            총 {data.totalElements}건 중 {page * size + 1}-
            {Math.min((page + 1) * size, data.totalElements)}건
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handlePageChange(0)} disabled={page === 0}>처음</Button>
            <Button variant="outline" size="sm" onClick={() => handlePageChange(page - 1)} disabled={page === 0}>이전</Button>
            <span className="px-2 text-sm">{page + 1} / {data.totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => handlePageChange(page + 1)} disabled={page >= data.totalPages - 1}>다음</Button>
            <Button variant="outline" size="sm" onClick={() => handlePageChange(data.totalPages - 1)} disabled={page >= data.totalPages - 1}>마지막</Button>
          </div>
        </div>
      )}
    </div>
  );
}
