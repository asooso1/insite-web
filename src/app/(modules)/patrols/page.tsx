"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, MoreHorizontal, Eye, Edit, AlertCircle, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/data-display/data-table";
import { EmptyState } from "@/components/data-display/empty-state";

import { usePatrolList, usePatrolTeamList } from "@/lib/hooks/use-patrols";
import {
  PatrolPlanStateLabel,
  PatrolPlanStateStyle,
  PatrolPlanTypeLabel,
  PatrolTeamStateLabel,
  PatrolTeamStateStyle,
  type PatrolPlanDTO,
  type PatrolTeamDTO,
  type SearchPatrolPlanVO,
  type SearchPatrolTeamVO,
} from "@/lib/types/patrol";
import type { ColumnDef, Row } from "@tanstack/react-table";

// ============================================================================
// 탭 정의
// ============================================================================

const TABS = [
  { value: "plans", label: "순찰 계획" },
  { value: "teams", label: "순찰 팀" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

// ============================================================================
// 계획 컬럼 정의
// ============================================================================

function usePlanColumns(): ColumnDef<PatrolPlanDTO>[] {
  const router = useRouter();
  return useMemo(
    () => [
      {
        accessorKey: "id",
        header: "No",
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.id}</span>,
        size: 70,
      },
      {
        accessorKey: "state",
        header: "상태",
        cell: ({ row }) => {
          const state = row.original.state;
          const label = PatrolPlanStateLabel[state] ?? state;
          const style = PatrolPlanStateStyle[state] ?? "";
          return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}>
              {label}
            </span>
          );
        },
        size: 110,
      },
      {
        accessorKey: "name",
        header: "계획명",
        cell: ({ row }) => (
          <button
            onClick={() => router.push(`/patrols/${row.original.id}`)}
            className="text-left font-medium text-primary hover:underline"
          >
            {row.original.name}
          </button>
        ),
        size: 200,
      },
      {
        accessorKey: "patrolTeamName",
        header: "팀명",
        cell: ({ row }) => <span>{row.original.patrolTeamName || "-"}</span>,
        size: 120,
      },
      {
        accessorKey: "planType",
        header: "유형",
        cell: ({ row }) => (
          <span>{PatrolPlanTypeLabel[row.original.planType] ?? row.original.planTypeName}</span>
        ),
        size: 80,
      },
      {
        accessorKey: "startDate",
        header: "시작일",
        cell: ({ row }) => <span>{row.original.startDate ?? "-"}</span>,
        size: 110,
      },
      {
        accessorKey: "endDate",
        header: "종료일",
        cell: ({ row }) => <span>{row.original.endDate ?? "-"}</span>,
        size: 110,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => <PlanRowActions row={row} />,
        size: 50,
      },
    ],
    [router]
  );
}

function PlanRowActions({ row }: { row: Row<PatrolPlanDTO> }) {
  const router = useRouter();
  const plan = row.original;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">메뉴 열기</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(`/patrols/${plan.id}`)}>
          <Eye className="mr-2 h-4 w-4" />
          상세 보기
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/patrols/${plan.id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          수정
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================================================
// 팀 컬럼 정의
// ============================================================================

function useTeamColumns(): ColumnDef<PatrolTeamDTO>[] {
  const router = useRouter();
  return useMemo(
    () => [
      {
        accessorKey: "id",
        header: "No",
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.id}</span>,
        size: 70,
      },
      {
        accessorKey: "state",
        header: "상태",
        cell: ({ row }) => {
          const state = row.original.state;
          const label = PatrolTeamStateLabel[state] ?? state;
          const style = PatrolTeamStateStyle[state] ?? "";
          return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}>
              {label}
            </span>
          );
        },
        size: 80,
      },
      {
        accessorKey: "name",
        header: "팀명",
        cell: ({ row }) => (
          <button
            onClick={() => router.push(`/patrols/teams/${row.original.id}`)}
            className="text-left font-medium text-primary hover:underline"
          >
            {row.original.name}
          </button>
        ),
        size: 160,
      },
      {
        accessorKey: "carNo",
        header: "차량번호",
        cell: ({ row }) => <span>{row.original.carNo || "-"}</span>,
        size: 110,
      },
      {
        accessorKey: "patrolTeamAccounts",
        header: "팀원 수",
        cell: ({ row }) => <span>{row.original.patrolTeamAccounts.length}명</span>,
        size: 80,
      },
      {
        accessorKey: "patrolTeamBuildings",
        header: "담당 건물",
        cell: ({ row }) => <span>{row.original.patrolTeamBuildings.length}개</span>,
        size: 90,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => <TeamRowActions row={row} />,
        size: 50,
      },
    ],
    [router]
  );
}

function TeamRowActions({ row }: { row: Row<PatrolTeamDTO> }) {
  const router = useRouter();
  const team = row.original;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">메뉴 열기</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(`/patrols/teams/${team.id}`)}>
          <Eye className="mr-2 h-4 w-4" />
          상세 보기
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/patrols/teams/${team.id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          수정
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================================================
// 메인 페이지
// ============================================================================

export default function PatrolListPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabValue>("plans");
  const [page, setPage] = useState(0);
  const [size] = useState(20);

  const planParams: SearchPatrolPlanVO = useMemo(() => ({ page, size }), [page, size]);
  const teamParams: SearchPatrolTeamVO = useMemo(() => ({ page, size }), [page, size]);

  const {
    data: planData,
    isLoading: planLoading,
    isError: planError,
    refetch: refetchPlans,
  } = usePatrolList(planParams);

  const {
    data: teamData,
    isLoading: teamLoading,
    isError: teamError,
    refetch: refetchTeams,
  } = usePatrolTeamList(teamParams);

  const planColumns = usePlanColumns();
  const teamColumns = useTeamColumns();

  const handleTabChange = useCallback((tab: TabValue) => {
    setActiveTab(tab);
    setPage(0);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const isPlans = activeTab === "plans";
  const isLoading = isPlans ? planLoading : teamLoading;
  const isError = isPlans ? planError : teamError;
  const totalPages = isPlans ? (planData?.totalPages ?? 0) : (teamData?.totalPages ?? 0);
  const totalElements = isPlans ? (planData?.totalElements ?? 0) : (teamData?.totalElements ?? 0);

  if (isError) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="데이터를 불러올 수 없습니다"
        description="잠시 후 다시 시도해주세요."
        action={{ label: "다시 시도", onClick: () => (isPlans ? refetchPlans() : refetchTeams()) }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">순찰 관리</h1>
          <p className="text-muted-foreground">순찰 계획 및 팀을 관리합니다.</p>
        </div>
        <Button
          onClick={() =>
            router.push(isPlans ? "/patrols/new" : "/patrols/teams/new")
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          {isPlans ? "새 순찰 계획" : "새 순찰 팀"}
        </Button>
      </div>

      {/* 탭 */}
      <div className="flex gap-2 border-b">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.value
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 테이블 */}
      {isPlans ? (
        <>
          <DataTable
            columns={planColumns}
            data={planData?.content ?? []}
            loading={planLoading}
            pagination={false}
          />
          {!planLoading && (planData?.content ?? []).length === 0 && (
            <EmptyState
              icon={Shield}
              title="순찰 계획이 없습니다"
              description="새 순찰 계획을 등록해보세요."
              action={{ label: "새 순찰 계획", onClick: () => router.push("/patrols/new") }}
            />
          )}
        </>
      ) : (
        <>
          <DataTable
            columns={teamColumns}
            data={teamData?.content ?? []}
            loading={teamLoading}
            pagination={false}
          />
          {!teamLoading && (teamData?.content ?? []).length === 0 && (
            <EmptyState
              icon={Shield}
              title="순찰 팀이 없습니다"
              description="새 순찰 팀을 등록해보세요."
              action={{ label: "새 순찰 팀", onClick: () => router.push("/patrols/teams/new") }}
            />
          )}
        </>
      )}

      {/* 페이지네이션 */}
      {totalPages > 0 && (
        <div className="flex items-center justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            총 {totalElements}건 중 {page * size + 1}-
            {Math.min((page + 1) * size, totalElements)}건
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handlePageChange(0)} disabled={page === 0}>
              처음
            </Button>
            <Button variant="outline" size="sm" onClick={() => handlePageChange(page - 1)} disabled={page === 0}>
              이전
            </Button>
            <span className="px-2 text-sm">{page + 1} / {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages - 1}>
              다음
            </Button>
            <Button variant="outline" size="sm" onClick={() => handlePageChange(totalPages - 1)} disabled={page >= totalPages - 1}>
              마지막
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
