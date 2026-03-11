"use client";

import { useState, useMemo } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MenuWithStatus } from "@/lib/types/menu";

interface MenuTreeNodeProps {
  menu: MenuWithStatus;
  depth: number;
  selectedMenuId: number | null;
  onSelect: (menu: MenuWithStatus) => void;
  searchQuery: string;
}

/**
 * 메뉴 트리 노드
 * 재귀적으로 자식 메뉴를 렌더링합니다.
 */
export function MenuTreeNode({
  menu,
  depth,
  selectedMenuId,
  onSelect,
  searchQuery,
}: MenuTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // 현재 노드 또는 자식 중에 검색어 매칭되는 항목 확인
  const isMatchOrHasMatch = useMemo(() => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    if (menu.name.toLowerCase().includes(query)) return true;

    // 자식 재귀 확인
    const hasMatchInChildren = (child: MenuWithStatus): boolean => {
      if (child.name.toLowerCase().includes(query)) return true;
      return (child.children as MenuWithStatus[]).some(hasMatchInChildren);
    };

    return (menu.children as MenuWithStatus[]).some(hasMatchInChildren);
  }, [menu, searchQuery]);

  if (!isMatchOrHasMatch) return null;

  // depth 1, 2는 배지 숨김
  const shouldShowBadge = depth >= 3;

  const statusConfig: Record<
    typeof menu.status,
    { variant: "default" | "outline" | "destructive"; label: string; className?: string }
  > = {
    connected: { variant: "default", label: "연결됨" },
    unmapped: {
      variant: "outline",
      label: "미매핑",
      className: "bg-yellow-100 text-yellow-800 border-yellow-300",
    },
    not_implemented: { variant: "destructive", label: "미구현" },
  };

  const statusInfo = statusConfig[menu.status];

  return (
    <>
      <div
        className={cn(
          "group flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors",
          "hover:bg-accent",
          selectedMenuId === menu.id && "bg-accent"
        )}
        style={{ marginLeft: `${depth * 20}px` }}
        onClick={() => onSelect(menu)}
        role="button"
        tabIndex={0}
        aria-selected={selectedMenuId === menu.id}
        aria-label={menu.name}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onSelect(menu);
          }
        }}
      >
        {/* 확장/축소 토글 */}
        {menu.children.length > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            aria-expanded={isExpanded}
            aria-controls={`children-${menu.id}`}
            className="p-0 shrink-0"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        )}

        {/* 자식 없으면 간격 추가 */}
        {menu.children.length === 0 && <div className="w-4 shrink-0" />}

        {/* 메뉴명 */}
        <span className="flex-1 text-sm font-medium truncate">{menu.name}</span>

        {/* 상태 배지 */}
        {shouldShowBadge && menu.children.length === 0 && (
          <Badge
            variant={statusInfo.variant}
            className={cn("text-xs", statusInfo.className)}
          >
            {statusInfo.label}
          </Badge>
        )}
      </div>

      {/* 자식 메뉴 */}
      {isExpanded && menu.children.length > 0 && (
        <div id={`children-${menu.id}`} role="group">
          {(menu.children as MenuWithStatus[]).map((child) => (
            <MenuTreeNode
              key={child.id}
              menu={child}
              depth={depth + 1}
              selectedMenuId={selectedMenuId}
              onSelect={onSelect}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </>
  );
}
