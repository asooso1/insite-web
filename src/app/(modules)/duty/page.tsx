"use client";

import { useState, useCallback, useMemo } from "react";
import { Plus, AlertCircle, Inbox } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/data-display/data-table";
import { StatusBadge } from "@/components/data-display/status-badge";
import { EmptyState } from "@/components/data-display/empty-state";
import { PageHeader } from "@/components/common/page-header";

import {
  useDutyList,
  useAccountDuties,
} from "@/lib/hooks/use-duty";
import type { ColumnDef } from "@tanstack/react-table";
import type { DutyTypeDTO, DutyAssignmentDTO } from "@/lib/types/duty";
import { DutyTypeForm } from "./_components/duty-type-form";

// ============================================================================
// 당직 유형 컬럼
// ============================================================================

const dutyTypeColumns: ColumnDef<DutyTypeDTO>[] = [
  {
    accessorKey: "id",
    header: "No",
    size: 60,
  },
  {
    accessorKey: "name",
    header: "당직명",
    size: 150,
  },
  {
    accessorKey: "color",
    header: "색상",
    cell: ({ row }) => (
      <div
        className="h-6 w-6 rounded border"
        style={{ backgroundColor: row.original.color }}
        title={row.original.color}
      />
    ),
    size: 100,
  },
  {
    accessorKey: "description",
    header: "설명",
    size: 200,
  },
];

// ============================================================================
// 당직 배정 컬럼
// ============================================================================

const dutyAssignmentColumns: ColumnDef<DutyAssignmentDTO>[] = [
  {
    accessorKey: "date",
    header: "날짜",
    cell: ({ row }) => (
      <span className="font-medium">
        {new Date(row.original.date).toLocaleDateString("ko-KR")}
      </span>
    ),
    size: 120,
  },
  {
    accessorKey: "accountName",
    header: "요원명",
    size: 120,
  },
  {
    accessorKey: "dutyTypeName",
    header: "당직유형",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div
          className="h-4 w-4 rounded"
          style={{ backgroundColor: row.original.dutyTypeColor }}
        />
        <span>{row.original.dutyTypeName}</span>
      </div>
    ),
    size: 150,
  },
];

// ============================================================================
// 메인 페이지 컴포넌트
// ============================================================================

export default function DutyPage() {
  const [activeTab, setActiveTab] = useState("types");
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(0);
  const [size] = useState(20);

  // 현재 년월
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  // 당직 유형 조회
  const {
    data: dutyTypeData,
    isLoading: dutyTypeLoading,
    isError: dutyTypeError,
    refetch: refetchDutyTypes,
  } = useDutyList({ page, size });

  // 당직 배정 조회
  const {
    data: dutyAssignmentData,
    isLoading: dutyAssignmentLoading,
    isError: dutyAssignmentError,
    refetch: refetchDutyAssignments,
  } = useAccountDuties(year, month, { page, size });

  const handleYearChange = useCallback((newYear: number) => {
    setYear(newYear);
    setPage(0);
  }, []);

  const handleMonthChange = useCallback((newMonth: number) => {
    setMonth(newMonth);
    setPage(0);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleFormSuccess = useCallback(() => {
    setShowForm(false);
    refetchDutyTypes();
  }, [refetchDutyTypes]);

  if (dutyTypeError && activeTab === "types") {
    return (
      <EmptyState
        icon={AlertCircle}
        title="데이터를 불러올 수 없습니다"
        description="잠시 후 다시 시도해주세요."
        action={{ label: "다시 시도", onClick: () => refetchDutyTypes() }}
      />
    );
  }

  if (dutyAssignmentError && activeTab === "assignments") {
    return (
      <EmptyState
        icon={AlertCircle}
        title="데이터를 불러올 수 없습니다"
        description="잠시 후 다시 시도해주세요."
        action={{ label: "다시 시도", onClick: () => refetchDutyAssignments() }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* 헤더 */}
      <PageHeader
        title="당직 관리"
        description="당직 유형 및 배정을 관리합니다."
        actions={
          activeTab === "types" && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              당직 유형 추가
            </Button>
          )
        }
      />

      {/* 당직 유형 폼 */}
      {showForm && (
        <DutyTypeForm
          onSuccess={handleFormSuccess}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* 탭 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="types">당직 유형 관리</TabsTrigger>
          <TabsTrigger value="assignments">당직 배정</TabsTrigger>
        </TabsList>

        {/* 당직 유형 탭 */}
        <TabsContent value="types" className="space-y-4">
          {!dutyTypeLoading && (!dutyTypeData?.content || dutyTypeData.content.length === 0) && (
            <EmptyState
              icon={Inbox}
              title="당직 유형이 없습니다"
              description="당직 유형을 추가해보세요."
            />
          )}

          {dutyTypeData && dutyTypeData.content.length > 0 && (
            <>
              <DataTable
                columns={dutyTypeColumns}
                data={dutyTypeData.content}
                loading={dutyTypeLoading}
                pagination={false}
              />

              {/* 페이지네이션 */}
              {dutyTypeData.totalPages > 0 && (
                <div className="flex items-center justify-between border-t pt-4">
                  <div className="text-sm text-muted-foreground">
                    총 {dutyTypeData.totalElements}건
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
                      {page + 1} / {dutyTypeData.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= dutyTypeData.totalPages - 1}
                    >
                      다음
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(dutyTypeData.totalPages - 1)}
                      disabled={page >= dutyTypeData.totalPages - 1}
                    >
                      마지막
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* 당직 배정 탭 */}
        <TabsContent value="assignments" className="space-y-4">
          {/* 년월 선택 */}
          <div className="flex gap-4">
            <div>
              <label className="text-sm font-medium">연도</label>
              <input
                type="number"
                value={year}
                onChange={(e) => handleYearChange(Number(e.target.value))}
                min="2000"
                max="2099"
                className="mt-1 h-9 w-24 rounded border border-input bg-background px-3 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">월</label>
              <input
                type="number"
                value={month}
                onChange={(e) => handleMonthChange(Number(e.target.value))}
                min="1"
                max="12"
                className="mt-1 h-9 w-20 rounded border border-input bg-background px-3 text-sm"
              />
            </div>
          </div>

          {!dutyAssignmentLoading && (!dutyAssignmentData?.content || dutyAssignmentData.content.length === 0) && (
            <EmptyState
              icon={Inbox}
              title="당직 배정이 없습니다"
              description={`${year}년 ${month}월의 당직 배정 데이터가 없습니다.`}
            />
          )}

          {dutyAssignmentData && dutyAssignmentData.content.length > 0 && (
            <>
              <DataTable
                columns={dutyAssignmentColumns}
                data={dutyAssignmentData.content}
                loading={dutyAssignmentLoading}
                pagination={false}
              />

              {/* 페이지네이션 */}
              {dutyAssignmentData.totalPages > 0 && (
                <div className="flex items-center justify-between border-t pt-4">
                  <div className="text-sm text-muted-foreground">
                    총 {dutyAssignmentData.totalElements}건
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
                      {page + 1} / {dutyAssignmentData.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= dutyAssignmentData.totalPages - 1}
                    >
                      다음
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handlePageChange(dutyAssignmentData.totalPages - 1)
                      }
                      disabled={page >= dutyAssignmentData.totalPages - 1}
                    >
                      마지막
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
