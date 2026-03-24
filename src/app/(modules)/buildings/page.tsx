"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Building2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/data-display/data-table";
import { StatusBadge } from "@/components/data-display/status-badge";
import { EmptyState } from "@/components/data-display/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { FilterBar, type FilterDef } from "@/components/common/filter-bar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  useBuildingList,
  useDeleteBuilding,
  useDownloadBuildingExcel,
} from "@/lib/hooks/use-buildings";
import {
  BuildingStateLabel,
  BuildingStateStyle,
  type BuildingFullDTO,
  type SearchBuildingVO,
} from "@/lib/types/building";
import type { ColumnDef, Row } from "@tanstack/react-table";

// ============================================================================
// 필터 설정
// ============================================================================

const INITIAL_FILTERS = {
  buildingState: "",
  writeDateFrom: "",
  writeDateTo: "",
  buildingName: "",
};

const STATE_OPTIONS = [
  { value: "", label: "전체" },
  { value: "BEFORE_CONSTRUCT", label: "시공전" },
  { value: "ONGOING_CONSTRUCT", label: "시공중" },
  { value: "END_CONSTRUCT", label: "시공완료" },
  { value: "BEFORE_OPERATING", label: "운영전" },
  { value: "ONGOING_OPERATING", label: "운영중" },
  { value: "END_OPERATING", label: "운영종료" },
];

const FILTER_DEFS: FilterDef[] = [
  { type: "tabs", key: "buildingState", options: STATE_OPTIONS },
  { type: "date-range", fromKey: "writeDateFrom", toKey: "writeDateTo" },
  { type: "search", key: "buildingName", placeholder: "건물명 검색..." },
];

// ============================================================================
// 행 액션
// ============================================================================

function RowActions({ row }: { row: Row<BuildingFullDTO> }) {
  const router = useRouter();
  const deleteBuilding = useDeleteBuilding();
  const building = row.original;

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="더 보기">
            <MoreHorizontal aria-hidden="true" className="h-4 w-4" />
            <span className="sr-only">메뉴 열기</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.push(`/buildings/${building.id}`)}>
            <Eye aria-hidden="true" className="mr-2 h-4 w-4" />
            상세 보기
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/buildings/${building.id}/edit`)}>
            <Edit aria-hidden="true" className="mr-2 h-4 w-4" />
            수정
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
              <Trash2 aria-hidden="true" className="mr-2 h-4 w-4" />
              삭제
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>건물 삭제</AlertDialogTitle>
          <AlertDialogDescription>
            {building.name} 건물을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteBuilding.mutate(building.id)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ============================================================================
// 메인 페이지
// ============================================================================

export default function BuildingListPage() {
  const router = useRouter();
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [page, setPage] = useState(0);
  const SIZE = 20;

  const searchParams: SearchBuildingVO & { page: number; size: number } = useMemo(
    () => ({
      page,
      size: SIZE,
      buildingState: filters.buildingState
        ? (filters.buildingState as SearchBuildingVO["buildingState"])
        : undefined,
      writeDateFrom: filters.writeDateFrom || undefined,
      writeDateTo: filters.writeDateTo || undefined,
      buildingName: filters.buildingName || undefined,
    }),
    [page, filters]
  );

  const { data, isLoading, isError, refetch } = useBuildingList(searchParams);
  const downloadExcel = useDownloadBuildingExcel();

  const columns = useMemo<ColumnDef<BuildingFullDTO>[]>(
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
        accessorKey: "state",
        header: "상태",
        cell: ({ row }) => (
          <StatusBadge
            status={BuildingStateStyle[row.original.state]}
            label={BuildingStateLabel[row.original.state]}
          />
        ),
        size: 90,
      },
      {
        accessorKey: "name",
        header: "건물명",
        cell: ({ row }) => (
          <button
            onClick={() => router.push(`/buildings/${row.original.id}`)}
            className="text-left font-medium text-primary hover:underline"
          >
            {row.original.name}
          </button>
        ),
        size: 200,
      },
      {
        accessorKey: "companyName",
        header: "고객사",
        cell: ({ row }) => <span>{row.original.companyName || "-"}</span>,
        size: 150,
      },
      {
        accessorKey: "address",
        header: "주소",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.addressRoad || row.original.address || "-"}
          </span>
        ),
        size: 200,
      },
      {
        accessorKey: "officePhone",
        header: "연락처",
        cell: ({ row }) => <span>{row.original.officePhone || "-"}</span>,
        size: 130,
      },
      {
        accessorKey: "contractTermEnd",
        header: "계약 종료일",
        cell: ({ row }) => (
          <span className={row.original.serviceExpire ? "text-destructive font-medium" : ""}>
            {row.original.contractTermEnd || "-"}
          </span>
        ),
        size: 120,
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

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  }, []);

  const handleFilterReset = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setPage(0);
  }, []);

  if (isError) {
    return (
      <EmptyState
        title="데이터를 불러올 수 없습니다"
        description="잠시 후 다시 시도해주세요."
        action={{ label: "다시 시도", onClick: () => refetch() }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="건물 목록"
        description="고객사 건물을 관리합니다."
        icon={Building2}
        actions={
          <Button onClick={() => router.push("/buildings/new")}>
            <Plus aria-hidden="true" className="mr-2 h-4 w-4" />
            등록
          </Button>
        }
      />

      <FilterBar
        filters={FILTER_DEFS}
        values={filters}
        onChange={handleFilterChange}
        onReset={handleFilterReset}
        rightSlot={
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadExcel.mutate(searchParams)}
            disabled={downloadExcel.isPending}
          >
            <Download aria-hidden="true" className="mr-2 h-4 w-4" />
            엑셀 다운로드
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={data?.content ?? []}
        loading={isLoading}
        pagination={false}
      />

      {data && data.totalPages > 0 && (
        <div className="flex items-center justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            총 {data.totalElements}건 중 {page * SIZE + 1}-
            {Math.min((page + 1) * SIZE, data.totalElements)}건
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage(0)} disabled={page === 0}>
              처음
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 0}>
              이전
            </Button>
            <span className="px-2 text-sm">{page + 1} / {data.totalPages}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page >= data.totalPages - 1}
            >
              다음
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(data.totalPages - 1)}
              disabled={page >= data.totalPages - 1}
            >
              마지막
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
