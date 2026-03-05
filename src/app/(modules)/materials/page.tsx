"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  AlertCircle,
  Inbox,
  Trash2,
  Package,
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
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  useMaterialList,
  useDeleteMaterial,
} from "@/lib/hooks/use-materials";
import {
  MaterialState,
  MaterialStateLabel,
  MaterialStateStyle,
  MaterialTypeLabel,
  type MaterialDTO,
  type MaterialType,
  type SearchMaterialVO,
} from "@/lib/types/material";
import type { ColumnDef, Row } from "@tanstack/react-table";

// ============================================================================
// 상태 필터 탭
// ============================================================================

const STATE_TABS = [
  { value: "", label: "전체" },
  { value: MaterialState.OPERATING, label: "운영" },
  { value: MaterialState.PREPARE, label: "준비" },
  { value: MaterialState.DISCARD, label: "폐기" },
] as const;

// ============================================================================
// 컬럼 정의
// ============================================================================

function useColumns(): ColumnDef<MaterialDTO>[] {
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
        accessorKey: "state",
        header: "상태",
        cell: ({ row }) => {
          const state = row.original.state;
          return (
            <StatusBadge
              status={MaterialStateStyle[state]}
              label={MaterialStateLabel[state] ?? state}
            />
          );
        },
        size: 80,
      },
      {
        accessorKey: "name",
        header: "자재명",
        cell: ({ row }) => (
          <button
            onClick={() => router.push(`/materials/${row.original.id}`)}
            className="text-left font-medium text-primary hover:underline"
          >
            {row.original.name}
          </button>
        ),
        size: 200,
      },
      {
        accessorKey: "type",
        header: "유형",
        cell: ({ row }) => (
          <span>
            {MaterialTypeLabel[row.original.type as MaterialType] ??
              row.original.typeName}
          </span>
        ),
        size: 90,
      },
      {
        accessorKey: "privateCode",
        header: "관리코드",
        cell: ({ row }) => <span>{row.original.privateCode || "-"}</span>,
        size: 110,
      },
      {
        accessorKey: "standard",
        header: "규격",
        cell: ({ row }) => <span>{row.original.standard || "-"}</span>,
        size: 100,
      },
      {
        accessorKey: "unit",
        header: "단위",
        cell: ({ row }) => <span>{row.original.unit || "-"}</span>,
        size: 70,
      },
      {
        accessorKey: "stockCnt",
        header: "재고",
        cell: ({ row }) => {
          const stock = row.original.stockCnt;
          const suitable = row.original.suitableStock;
          const isLow = suitable > 0 && stock < suitable;
          return (
            <span className={isLow ? "font-bold text-destructive" : ""}>
              {stock}
              {suitable > 0 && (
                <span className="text-muted-foreground"> / {suitable}</span>
              )}
            </span>
          );
        },
        size: 100,
      },
      {
        accessorKey: "buildingName",
        header: "빌딩",
        cell: ({ row }) => <span>{row.original.buildingName || "-"}</span>,
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
}

// ============================================================================
// 행 액션
// ============================================================================

function RowActions({ row }: { row: Row<MaterialDTO> }) {
  const router = useRouter();
  const deleteMaterial = useDeleteMaterial();
  const material = row.original;

  const handleDelete = useCallback(() => {
    if (confirm(`${material.name} 자재를 삭제하시겠습니까?`)) {
      deleteMaterial.mutate(material.id);
    }
  }, [material, deleteMaterial]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">메뉴 열기</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => router.push(`/materials/${material.id}`)}
        >
          <Eye className="mr-2 h-4 w-4" />
          상세 보기
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/materials/${material.id}/edit`)}
        >
          <Edit className="mr-2 h-4 w-4" />
          수정
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          삭제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================================================
// 메인 페이지 컴포넌트
// ============================================================================

export default function MaterialListPage() {
  const router = useRouter();

  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [state, setState] = useState<string>("");
  const [keyword, setKeyword] = useState("");

  const searchParams: SearchMaterialVO & { page: number; size: number } = useMemo(
    () => ({
      page,
      size,
      searchKeyword: keyword || undefined,
    }),
    [page, size, keyword]
  );

  const { data, isLoading, isError, refetch } = useMaterialList(searchParams);

  const columns = useColumns();

  const handleSearch = useCallback((value: string) => {
    setKeyword(value);
    setPage(0);
  }, []);

  const handleStateChange = useCallback((value: string) => {
    setState(value);
    setPage(0);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  // 상태 필터링 (클라이언트 사이드 - 백엔드가 state 파라미터 미지원 시)
  const filteredData = useMemo(() => {
    if (!state || !data?.content) return data?.content ?? [];
    return data.content.filter((item) => item.state === state);
  }, [data, state]);

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
        title="자재 목록"
        description="자재 재고를 관리합니다."
        icon={Package}
        actions={
          <Button onClick={() => router.push("/materials/new")}>
            <Plus className="mr-2 h-4 w-4" />
            새 자재
          </Button>
        }
      />

      {/* 상태 탭 */}
      <Tabs
        value={state || "ALL"}
        onValueChange={(v) => handleStateChange(v === "ALL" ? "" : v)}
      >
        <TabsList className="h-auto gap-1 bg-transparent p-0 border-b rounded-none w-full justify-start">
          {STATE_TABS.map((tab) => (
            <TabsTrigger
              key={tab.value || "ALL"}
              value={tab.value || "ALL"}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* 툴바 */}
      <div className="flex items-center justify-end gap-2">
        <Input
          placeholder="자재명 검색..."
          value={keyword}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-64"
        />
      </div>

      {/* 테이블 */}
      <DataTable
        columns={columns}
        data={filteredData}
        loading={isLoading}
        pagination={false}
      />

      {/* 데이터 없음 */}
      {!isLoading && filteredData.length === 0 && (
        <EmptyState
          icon={Package}
          title="자재가 없습니다"
          description="새 자재를 등록해보세요."
          action={{
            label: "새 자재 등록",
            onClick: () => router.push("/materials/new"),
          }}
        />
      )}

      {/* 서버 사이드 페이지네이션 */}
      {data && data.totalPages > 0 && (
        <div className="flex items-center justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            총 {data.totalElements}건 중 {page * size + 1}-
            {Math.min((page + 1) * size, data.totalElements)}건
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(0)}
              disabled={page === 0}
            >
              처음
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 0}
            >
              이전
            </Button>
            <span className="px-2 text-sm">
              {page + 1} / {data.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= data.totalPages - 1}
            >
              다음
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(data.totalPages - 1)}
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
