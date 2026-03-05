"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, MoreHorizontal, Eye, Edit, AlertCircle, Award } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/data-display/data-table";
import { EmptyState } from "@/components/data-display/empty-state";

import { useLicenseList } from "@/lib/hooks/use-licenses";
import {
  LicenseStateLabel,
  LicenseStateStyle,
  type LicenseInfoDTO,
  type SearchLicenseVO,
} from "@/lib/types/license";
import type { ColumnDef, Row } from "@tanstack/react-table";

// ============================================================================
// 컬럼 정의
// ============================================================================

function useColumns(): ColumnDef<LicenseInfoDTO>[] {
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
          const state = row.original.state as keyof typeof LicenseStateLabel;
          const label = LicenseStateLabel[state] ?? state;
          const style = LicenseStateStyle[state] ?? "";
          return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}>
              {label}
            </span>
          );
        },
        size: 90,
      },
      {
        accessorKey: "name",
        header: "자격증명",
        cell: ({ row }) => (
          <button
            onClick={() => router.push(`/licenses/${row.original.id}`)}
            className="text-left font-medium text-primary hover:underline"
          >
            {row.original.name}
          </button>
        ),
        size: 200,
      },
      {
        accessorKey: "publisher",
        header: "발행처",
        cell: ({ row }) => <span>{row.original.publisher || "-"}</span>,
        size: 150,
      },
      {
        accessorKey: "licenseDepth1",
        header: "분류 1",
        cell: ({ row }) => <span>{row.original.licenseDepth1 || "-"}</span>,
        size: 120,
      },
      {
        accessorKey: "licenseDepth2",
        header: "분류 2",
        cell: ({ row }) => <span>{row.original.licenseDepth2 || "-"}</span>,
        size: 120,
      },
      {
        accessorKey: "licenseDepth3",
        header: "분류 3",
        cell: ({ row }) => <span>{row.original.licenseDepth3 || "-"}</span>,
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

function RowActions({ row }: { row: Row<LicenseInfoDTO> }) {
  const router = useRouter();
  const license = row.original;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">메뉴 열기</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(`/licenses/${license.id}`)}>
          <Eye className="mr-2 h-4 w-4" />
          상세 보기
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/licenses/${license.id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          수정
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================================================
// 메인 페이지 컴포넌트
// ============================================================================

export default function LicenseListPage() {
  const router = useRouter();

  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [keyword, setKeyword] = useState("");

  const searchParams: SearchLicenseVO = useMemo(
    () => ({ page, size }),
    [page, size]
  );

  const { data, isLoading, isError, refetch } = useLicenseList(searchParams);

  const columns = useColumns();

  const handleSearch = useCallback((value: string) => {
    setKeyword(value);
    setPage(0);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  // 클라이언트 사이드 키워드 필터링
  const filteredData = useMemo(() => {
    if (!keyword || !data?.content) return data?.content ?? [];
    return data.content.filter((item) =>
      item.name.toLowerCase().includes(keyword.toLowerCase()) ||
      item.publisher.toLowerCase().includes(keyword.toLowerCase())
    );
  }, [data, keyword]);

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">자격증 목록</h1>
          <p className="text-muted-foreground">자격증 정보를 관리합니다.</p>
        </div>
        <Button onClick={() => router.push("/licenses/new")}>
          <Plus className="mr-2 h-4 w-4" />
          새 자격증
        </Button>
      </div>

      {/* 툴바 */}
      <div className="flex items-center justify-end gap-2">
        <input
          type="text"
          placeholder="자격증명 또는 발행처 검색..."
          value={keyword}
          onChange={(e) => handleSearch(e.target.value)}
          className="h-9 w-72 rounded-md border bg-background px-3 text-sm"
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
          icon={Award}
          title="자격증이 없습니다"
          description="새 자격증을 등록해보세요."
          action={{
            label: "새 자격증 등록",
            onClick: () => router.push("/licenses/new"),
          }}
        />
      )}

      {/* 페이지네이션 */}
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
