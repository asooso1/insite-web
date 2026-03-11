"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Menu, RefreshCw, Link2, Link2Off, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { MenuTreeSection } from "./_components/menu-tree-section";
import { MenuUrlMappingPanel } from "./_components/menu-url-mapping-panel";
import { MenuCacheSection } from "./_components/menu-cache-section";

import { useMenuWithStatus } from "@/lib/hooks/use-menu";
import { getMenuTreeStats } from "@/lib/utils/menu-status-mapper";
import type { MenuWithStatus } from "@/lib/types/menu";

// ============================================================================
// 통계 카드
// ============================================================================

function MenuStatsCards({ menus }: { menus: MenuWithStatus[] }) {
  const stats = getMenuTreeStats(menus);

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Menu className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">전체</span>
          </div>
          <p className="mt-1 text-2xl font-bold">{stats.total}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Link2 className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-muted-foreground">연결됨</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-blue-600">{stats.connected}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-muted-foreground">미매핑</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-yellow-600">{stats.unmapped}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Link2Off className="h-4 w-4 text-red-600" />
            <span className="text-sm text-muted-foreground">미구현</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-red-600">{stats.notImplemented}</p>
        </CardContent>
      </Card>
    </div>
  );
}

function MenuStatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-8 w-12" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ============================================================================
// 메인 페이지
// ============================================================================

export default function MenuManagementPage() {
  const router = useRouter();
  const [selectedMenu, setSelectedMenu] = useState<MenuWithStatus | null>(null);

  const { menus, isLoading } = useMenuWithStatus();

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/settings")}
          aria-label="설정으로 돌아가기"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold">메뉴 관리</h1>
          <p className="text-sm text-muted-foreground">
            csp-was 메뉴 구조를 확인하고 insite-web 페이지와의 연결을 관리합니다.
          </p>
        </div>
        <div className="ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.refresh()}
            aria-label="새로고침"
          >
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            새로고침
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      {isLoading ? (
        <MenuStatsCardsSkeleton />
      ) : (
        <MenuStatsCards menus={menus} />
      )}

      {/* 메인 컨텐츠: 트리 + 편집 패널 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* 좌측: 메뉴 트리 */}
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <MenuTreeSection
              menus={menus}
              isLoading={isLoading}
              selectedMenuId={selectedMenu?.id ?? null}
              onSelect={setSelectedMenu}
            />
          </CardContent>
        </Card>

        {/* 우측: URL 매핑 편집 패널 */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardContent className="p-4">
              <MenuUrlMappingPanel selectedMenu={selectedMenu} />
            </CardContent>
          </Card>

          {/* 캐시 초기화 */}
          <MenuCacheSection />
        </div>
      </div>
    </div>
  );
}
