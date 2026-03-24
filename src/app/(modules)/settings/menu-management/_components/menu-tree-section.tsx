"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/data-display/empty-state";
import { MenuTreeNode } from "./menu-tree-node";
import type { MenuWithStatus } from "@/lib/types/menu";

interface MenuTreeSectionProps {
  menus: MenuWithStatus[];
  isLoading: boolean;
  selectedMenuId: number | null;
  onSelect: (menu: MenuWithStatus) => void;
}

/**
 * 메뉴 트리 섹션
 * 검색, 확장/축소, 트리 렌더링을 담당합니다.
 */
export function MenuTreeSection({
  menus,
  isLoading,
  selectedMenuId,
  onSelect,
}: MenuTreeSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandAll, setExpandAll] = useState(true);

  // 검색어에 매칭되는 메뉴가 있는지 확인
  const hasMatchingMenus = useMemo(() => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    const checkMatch = (menu: MenuWithStatus): boolean => {
      if (menu.name.toLowerCase().includes(query)) return true;
      return (menu.children as MenuWithStatus[]).some(checkMatch);
    };

    return menus.some(checkMatch);
  }, [menus, searchQuery]);

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (!menus.length) {
    return (
      <EmptyState
        title="메뉴 데이터가 없습니다"
        description="메뉴 구조를 먼저 설정하세요."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 검색 및 전체 확장/축소 */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="메뉴 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            aria-label="메뉴 검색"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setExpandAll(!expandAll)}
          title={expandAll ? "전체 축소" : "전체 확장"}
          aria-label={expandAll ? "전체 축소" : "전체 확장"}
        >
          {expandAll ? (
            <ChevronUp aria-hidden="true" className="h-4 w-4" />
          ) : (
            <ChevronDown aria-hidden="true" className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* 메뉴 트리 */}
      {hasMatchingMenus ? (
        <div className="border rounded-lg p-4 space-y-2" role="tree">
          {menus.map((menu) => (
            <MenuTreeNode
              key={menu.id}
              menu={menu}
              depth={1}
              selectedMenuId={selectedMenuId}
              onSelect={onSelect}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="검색 결과가 없습니다"
          description="다른 검색어로 시도해보세요."
        />
      )}
    </div>
  );
}
