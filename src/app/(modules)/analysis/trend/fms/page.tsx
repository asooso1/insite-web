"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Activity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/common/page-header";
import { DataTable } from "@/components/data-display/data-table";
import { EmptyState } from "@/components/data-display/empty-state";
import { useFmsTrendList } from "@/lib/hooks/use-analysis";
import type { TrendFMSListItemDTO } from "@/lib/types/analysis";
import type { ColumnDef } from "@tanstack/react-table";

// ============================================================================
// Columns
// ============================================================================

function useColumns(): ColumnDef<TrendFMSListItemDTO>[] {
  const router = useRouter();

  return useMemo(
    () => [
      {
        accessorKey: "controlPointName",
        header: "관제점명",
        cell: ({ row }) => (
          <button
            onClick={() =>
              router.push(
                `/analysis/trend/fms/${row.original.controlPointId}`
              )
            }
            className="text-left font-medium text-primary hover:underline"
          >
            {row.original.controlPointName}
          </button>
        ),
        size: 180,
      },
      {
        accessorKey: "controlPointMeasureTypeName",
        header: "측정유형",
        size: 120,
      },
      {
        accessorKey: "controlPointMeasureUnit",
        header: "단위",
        size: 80,
      },
      {
        accessorKey: "controlPointStateName",
        header: "상태",
        size: 100,
      },
      {
        accessorKey: "buildingName",
        header: "빌딩",
        size: 120,
      },
      {
        accessorKey: "buildingFloor",
        header: "층",
        size: 80,
      },
      {
        accessorKey: "facilityName",
        header: "설비명",
        size: 150,
      },
      {
        accessorKey: "facilityCategoryPath",
        header: "분류경로",
        size: 200,
      },
    ],
    [router]
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function FmsTrendListPage() {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const params = useMemo(
    () => ({
      searchKeyword: keyword || undefined,
      page,
      size,
    }),
    [keyword, page, size]
  );

  const { data, isLoading, isError } = useFmsTrendList(params);

  const columns = useColumns();

  if (isError) {
    return (
      <div className="space-y-8">
        <PageHeader title="FMS 트렌드" icon={Activity} />
        <EmptyState
          title="데이터를 불러올 수 없습니다"
          description="나중에 다시 시도해 주세요."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader title="FMS 트렌드" icon={Activity} />

      {/* 검색 필터 */}
      <Input
        placeholder="관제점명으로 검색..."
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
          setPage(0);
        }}
        className="max-w-sm"
      />

      {/* 테이블 */}
      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">
          불러오는 중...
        </div>
      ) : data && data.content.length > 0 ? (
        <div>
          <DataTable
            columns={columns}
            data={data.content}
          />
          {/* 페이지네이션 */}
          <div className="flex items-center justify-between mt-4 text-sm">
            <span className="text-muted-foreground">
              전체 {data.totalElements}건 중 {page * size + 1}-
              {Math.min((page + 1) * size, data.totalElements)}건
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                이전
              </button>
              <span className="px-3 py-1">{page + 1}</span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={(page + 1) * size >= data.totalElements}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                다음
              </button>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          title="데이터가 없습니다"
          description="조건에 맞는 관제점이 없습니다."
        />
      )}
    </div>
  );
}
