"use client";

import { useState } from "react";
import { Sparkles, Plus, AlertCircle } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/common/page-header";
import { FilterBar, type FilterDef } from "@/components/common/filter-bar";
import { DataTable, type ColumnDef } from "@/components/data-display/data-table";
import { EmptyState } from "@/components/data-display/empty-state";
import { Button } from "@/components/ui/button";
import { useCleanInfoList } from "@/lib/hooks/use-cleaning";
import type { CleanInfoDTO } from "@/lib/types/cleaning";

// ============================================================================
// 컬럼 정의
// ============================================================================

const columns: ColumnDef<CleanInfoDTO>[] = [
  { accessorKey: "id", header: "No", size: 60 },
  { accessorKey: "companyName", header: "업체명", size: 180 },
  { accessorKey: "contactName", header: "담당자", size: 120 },
  { accessorKey: "phone", header: "연락처", size: 140 },
  { accessorKey: "contractStart", header: "계약 시작", size: 120 },
  { accessorKey: "contractEnd", header: "계약 종료", size: 120 },
  { accessorKey: "area", header: "구역", size: 120 },
  { accessorKey: "buildingName", header: "빌딩", size: 120 },
];

// ============================================================================
// 상수
// ============================================================================

const INITIAL_FILTERS = { keyword: "" };

const FILTER_DEFS: FilterDef[] = [
  { type: "search", key: "keyword", placeholder: "업체명 검색" },
];

// ============================================================================
// 컴포넌트
// ============================================================================

export default function CleaningPage() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [page, setPage] = useState(0);

  const { data, isLoading, isError, refetch } = useCleanInfoList({
    keyword: filters.keyword || undefined,
    page,
    size: 20,
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const handleFilterReset = () => {
    setFilters(INITIAL_FILTERS);
    setPage(0);
  };

  if (isError) return <EmptyState icon={AlertCircle} title="데이터를 불러올 수 없습니다" description="잠시 후 다시 시도해주세요." action={{ label: "다시 시도", onClick: () => void refetch() }} />;

  return (
    <div className="space-y-4">
      <PageHeader
        title="청소 관리"
        description="청소 업체 계약 및 현황을 관리합니다"
        icon={Sparkles}
        stats={[{ label: "전체", value: data?.totalElements ?? 0 }]}
        actions={
          <Button asChild size="sm">
            <Link href="/service/cleaning/new">
              <Plus className="mr-1 h-4 w-4" />
              새 업체 등록
            </Link>
          </Button>
        }
      />
      <FilterBar
        filters={FILTER_DEFS}
        values={filters}
        onChange={handleFilterChange}
        onReset={handleFilterReset}
      />
      <DataTable
        columns={columns}
        data={data?.content ?? []}
        loading={isLoading}
        pagination
        pageSize={20}
        onRowClick={(row) => {
          window.location.href = `/service/cleaning/${row.id}`;
        }}
      />
    </div>
  );
}
