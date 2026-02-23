"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  AlertCircle,
  Inbox,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/data-display/data-table";
import { StatusBadge } from "@/components/data-display/status-badge";
import { EmptyState } from "@/components/data-display/empty-state";

import {
  useFacilityList,
  useDownloadFacilityExcel,
} from "@/lib/hooks/use-facilities";
import {
  FacilityState,
  FacilityStateLabel,
  FacilityStateStyle,
  type FacilityListDTO,
  type SearchFacilityVO,
} from "@/lib/types/facility";
import type { ColumnDef, Row } from "@tanstack/react-table";

// ============================================================================
// 상태 필터 탭
// ============================================================================

const STATE_TABS = [
  { value: "", label: "전체" },
  { value: FacilityState.ONGOING_OPERATING, label: "운영중" },
  { value: FacilityState.BEFORE_OPERATING, label: "운영전" },
  { value: FacilityState.NOW_CHECK, label: "점검중" },
  { value: FacilityState.END_OPERATING, label: "운영완료" },
  { value: FacilityState.DISCARD, label: "폐기" },
] as const;

// ============================================================================
// 컬럼 정의
// ============================================================================

function useColumns(): ColumnDef<FacilityListDTO>[] {
  const router = useRouter();

  return useMemo(
    () => [
      {
        accessorKey: "facilityDTO.id",
        header: "No",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.facilityDTO.id}
          </span>
        ),
        size: 80,
      },
      {
        accessorKey: "facilityDTO.state",
        header: "상태",
        cell: ({ row }) => {
          const state = row.original.facilityDTO.state;
          return (
            <StatusBadge
              status={FacilityStateStyle[state]}
              label={FacilityStateLabel[state]}
            />
          );
        },
        size: 100,
      },
      {
        accessorKey: "facilityDTO.name",
        header: "시설명",
        cell: ({ row }) => (
          <button
            onClick={() =>
              router.push(`/facilities/${row.original.facilityDTO.id}`)
            }
            className="text-left font-medium text-primary hover:underline"
          >
            {row.original.facilityDTO.name}
          </button>
        ),
        size: 200,
      },
      {
        accessorKey: "facilityDTO.facilityNo",
        header: "장비번호",
        cell: ({ row }) => (
          <span>{row.original.facilityDTO.facilityNo || "-"}</span>
        ),
        size: 120,
      },
      {
        accessorKey: "firstFacilityCategory.name",
        header: "분류",
        cell: ({ row }) => {
          const first = row.original.firstFacilityCategory?.name;
          const second = row.original.secondFacilityCategory?.name;
          const third = row.original.facilityCategoryDTO?.name;
          const parts = [first, second, third].filter(Boolean);
          return <span>{parts.join(" > ") || "-"}</span>;
        },
        size: 200,
      },
      {
        accessorKey: "buildingDTO.name",
        header: "빌딩",
        cell: ({ row }) => <span>{row.original.buildingDTO.name}</span>,
        size: 150,
      },
      {
        accessorKey: "buildingFloorDTO.name",
        header: "위치",
        cell: ({ row }) => {
          const floor = row.original.buildingFloorDTO?.name;
          const zone = row.original.buildingFloorZoneDTO?.name;
          return (
            <span>
              {floor}
              {zone && ` / ${zone}`}
            </span>
          );
        },
        size: 120,
      },
      {
        accessorKey: "facilityDTO.buildingUserGroupName",
        header: "작업팀",
        cell: ({ row }) => (
          <span>{row.original.facilityDTO.buildingUserGroupName || "-"}</span>
        ),
        size: 100,
      },
      {
        accessorKey: "facilityDTO.installDate",
        header: "설치일",
        cell: ({ row }) => (
          <span>{row.original.facilityDTO.installDate || "-"}</span>
        ),
        size: 100,
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

function RowActions({ row }: { row: Row<FacilityListDTO> }) {
  const router = useRouter();
  const facility = row.original.facilityDTO;

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
          onClick={() => router.push(`/facilities/${facility.id}`)}
        >
          <Eye className="mr-2 h-4 w-4" />
          상세 보기
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/facilities/${facility.id}/edit`)}
        >
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

export default function FacilityListPage() {
  const router = useRouter();

  // 로컬 상태
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [state, setState] = useState<string>("");
  const [keyword, setKeyword] = useState("");

  // 검색 파라미터
  const searchParams: SearchFacilityVO & { page: number; size: number } = useMemo(
    () => ({
      page,
      size,
      state: (state as FacilityState) || undefined,
      keyword: keyword || undefined,
    }),
    [page, size, state, keyword]
  );

  // 데이터 조회
  const { data, isLoading, isError, refetch } = useFacilityList(searchParams);

  // 엑셀 다운로드
  const downloadExcel = useDownloadFacilityExcel();

  // 컬럼
  const columns = useColumns();

  // 핸들러
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

  const handleDownloadExcel = useCallback(() => {
    downloadExcel.mutate(searchParams);
  }, [downloadExcel, searchParams]);

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">시설 목록</h1>
          <p className="text-muted-foreground">시설을 관리합니다.</p>
        </div>
        <Button onClick={() => router.push("/facilities/new")}>
          <Plus className="mr-2 h-4 w-4" />
          새 시설
        </Button>
      </div>

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
      <div className="flex items-center justify-between gap-4">
        <div />
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="시설명 검색..."
            value={keyword}
            onChange={(e) => handleSearch(e.target.value)}
            className="h-9 w-64 rounded-md border bg-background px-3 text-sm"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadExcel}
            disabled={downloadExcel.isPending}
          >
            <Download className="mr-2 h-4 w-4" />
            엑셀
          </Button>
        </div>
      </div>

      {/* 테이블 */}
      <DataTable
        columns={columns}
        data={data?.content ?? []}
        loading={isLoading}
        pagination={false}
      />

      {/* 데이터 없음 */}
      {!isLoading && (!data?.content || data.content.length === 0) && (
        <EmptyState
          icon={Inbox}
          title="시설이 없습니다"
          description="새 시설을 등록해보세요."
          action={{
            label: "새 시설 등록",
            onClick: () => router.push("/facilities/new"),
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
