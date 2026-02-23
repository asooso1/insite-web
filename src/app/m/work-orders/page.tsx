"use client";

import * as React from "react";
import { useState, useCallback } from "react";
import Link from "next/link";
import { ChevronRight, Plus, Search, AlertCircle, Inbox } from "lucide-react";

import { MobileShell } from "@/components/layout/mobile-shell";
import { StatusBadge } from "@/components/data-display/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkOrderList } from "@/lib/hooks/use-work-orders";
import {
  WorkOrderState,
  WorkOrderStateLabel,
  WorkOrderStateStyle,
  WorkOrderTypeLabel,
  type WorkOrderListDTO,
} from "@/lib/types/work-order";
import { cn } from "@/lib/utils";

// ============================================================================
// 상태 필터 탭
// ============================================================================

const STATE_TABS = [
  { value: "", label: "전체" },
  { value: WorkOrderState.WRITE, label: "작성" },
  { value: WorkOrderState.ISSUE, label: "발행" },
  { value: WorkOrderState.PROCESSING, label: "처리중" },
  { value: WorkOrderState.COMPLETE, label: "완료" },
  { value: WorkOrderState.CANCEL, label: "취소" },
] as const;

// ============================================================================
// 작업 카드 아이템
// ============================================================================

function WorkOrderCard({ item }: { item: WorkOrderListDTO }): React.JSX.Element {
  const { workOrderDTO, buildingDTO } = item;
  return (
    <Link
      href={`/m/work-orders/${workOrderDTO.id}`}
      className="flex items-center justify-between px-4 py-3 active:bg-accent"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <StatusBadge
            status={WorkOrderStateStyle[workOrderDTO.state]}
            label={WorkOrderStateLabel[workOrderDTO.state]}
          />
          <span className="text-xs text-muted-foreground truncate">
            {WorkOrderTypeLabel[workOrderDTO.type]}
          </span>
        </div>
        <p className="text-sm font-medium truncate">{workOrderDTO.name}</p>
        <p className="text-xs text-muted-foreground truncate">
          {buildingDTO.name}
          {workOrderDTO.buildingFloorName && ` · ${workOrderDTO.buildingFloorName}`}
        </p>
      </div>
      <ChevronRight className="ml-2 h-4 w-4 flex-shrink-0 text-muted-foreground" />
    </Link>
  );
}

// ============================================================================
// 로딩 스켈레톤
// ============================================================================

function ListSkeleton(): React.JSX.Element {
  return (
    <div className="divide-y divide-border rounded-lg border bg-card">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="px-4 py-3 space-y-2">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-14" />
            <Skeleton className="h-5 w-10" />
          </div>
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// 메인 페이지
// ============================================================================

export default function MobileWorkOrderListPage(): React.JSX.Element {
  const [activeState, setActiveState] = useState<string>("");
  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(0);

  const { data, isLoading, isError, refetch } = useWorkOrderList({
    page,
    size: 20,
    state: (activeState as WorkOrderState) || undefined,
    keyword: keyword || undefined,
  });

  const handleStateChange = useCallback((value: string) => {
    setActiveState(value);
    setPage(0);
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setKeyword(searchInput);
    setPage(0);
  }, [searchInput]);

  const items = data?.content ?? [];
  const hasMore = data ? page < data.totalPages - 1 : false;

  return (
    <MobileShell
      headerTitle="작업 목록"
      headerRightActions={
        <Link
          href="/work-orders/new"
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-accent"
          aria-label="새 작업 등록"
        >
          <Plus className="h-5 w-5" />
        </Link>
      }
    >
      <div className="flex flex-col gap-3">
        {/* 검색 */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="작업명 검색..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-9 w-full rounded-md border bg-background pl-9 pr-3 text-sm"
            />
          </div>
          <button
            type="submit"
            className="h-9 rounded-md border bg-background px-3 text-sm font-medium"
          >
            검색
          </button>
        </form>

        {/* 상태 탭 */}
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
          {STATE_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleStateChange(tab.value)}
              className={cn(
                "flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                activeState === tab.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 목록 */}
        {isLoading ? (
          <ListSkeleton />
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">데이터를 불러올 수 없습니다.</p>
            <button
              onClick={() => refetch()}
              className="text-sm text-primary underline"
            >
              다시 시도
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <Inbox className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">작업이 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-border rounded-lg border bg-card overflow-hidden">
              {items.map((item) => (
                <WorkOrderCard key={item.workOrderDTO.id} item={item} />
              ))}
            </div>

            {/* 페이지네이션 */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>총 {data?.totalElements ?? 0}건</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="disabled:opacity-40"
                >
                  이전
                </button>
                <span>{page + 1} / {data?.totalPages ?? 1}</span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasMore}
                  className="disabled:opacity-40"
                >
                  다음
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </MobileShell>
  );
}
