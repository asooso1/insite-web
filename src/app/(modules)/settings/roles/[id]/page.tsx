"use client";

import { useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Shield, ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/data-display/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useRoleMenuAuths, useUpdateRoleAuth } from "@/lib/hooks/use-roles";
import { handleApiError } from "@/lib/api/error-handler";
import type { RoleMenuAuthDTO } from "@/lib/types/role";

// ============================================================================
// 메뉴 권한 항목 컴포넌트
// ============================================================================

interface MenuAuthItemProps {
  menu: RoleMenuAuthDTO;
  checked: boolean;
  onToggle: (menuId: number, checked: boolean) => void;
}

function MenuAuthItem({ menu, checked, onToggle }: MenuAuthItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted">
      <Checkbox
        id={`menu-${menu.menuId}`}
        checked={checked}
        onCheckedChange={(value) => onToggle(menu.menuId, Boolean(value))}
      />
      <label
        htmlFor={`menu-${menu.menuId}`}
        className="flex-1 cursor-pointer text-sm"
      >
        {menu.menuName}
      </label>
    </div>
  );
}

// ============================================================================
// 메인 페이지 컴포넌트
// ============================================================================

export default function RoleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const roleId = Number(params.id);

  const { data: menuAuths, isLoading, isError } = useRoleMenuAuths(roleId);
  const updateRoleAuth = useUpdateRoleAuth();

  // 체크 상태 (menuId → boolean)
  const [checkedMap, setCheckedMap] = useState<Record<number, boolean>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // 초기 권한 데이터로 상태 초기화
  if (menuAuths && !isInitialized) {
    const initial: Record<number, boolean> = {};
    menuAuths.forEach((m: RoleMenuAuthDTO) => {
      initial[m.menuId] = m.hasAuth;
    });
    setCheckedMap(initial);
    setIsInitialized(true);
  }

  const handleToggle = useCallback((menuId: number, checked: boolean) => {
    setCheckedMap((prev) => ({ ...prev, [menuId]: checked }));
  }, []);

  const handleSelectAll = useCallback(() => {
    if (!menuAuths) return;
    const allChecked: Record<number, boolean> = {};
    menuAuths.forEach((m: RoleMenuAuthDTO) => {
      allChecked[m.menuId] = true;
    });
    setCheckedMap(allChecked);
  }, [menuAuths]);

  const handleDeselectAll = useCallback(() => {
    if (!menuAuths) return;
    const allUnchecked: Record<number, boolean> = {};
    menuAuths.forEach((m: RoleMenuAuthDTO) => {
      allUnchecked[m.menuId] = false;
    });
    setCheckedMap(allUnchecked);
  }, [menuAuths]);

  const handleSave = useCallback(async () => {
    const menuIds = Object.entries(checkedMap)
      .filter(([, v]) => v)
      .map(([k]) => Number(k));

    try {
      await updateRoleAuth.mutateAsync({ roleId, menuIds });
      toast.success("권한이 저장되었습니다.");
    } catch (error) {
      handleApiError(error as Error);
    }
  }, [checkedMap, roleId, updateRoleAuth]);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <Skeleton className="h-16 w-full" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // 에러 상태
  if (isError || !menuAuths) {
    return (
      <EmptyState
        icon={Shield}
        title="데이터를 불러올 수 없습니다"
        description="역할 권한 정보를 불러오지 못했습니다."
        action={{ label: "목록으로", onClick: () => router.push("/settings/roles") }}
      />
    );
  }

  const checkedCount = Object.values(checkedMap).filter(Boolean).length;
  const totalCount = menuAuths.length;

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="역할 권한 설정"
        description={`${totalCount}개 메뉴 중 ${checkedCount}개 권한 부여됨`}
        icon={Shield}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/settings/roles")}
            >
              <ArrowLeft aria-hidden="true" className="mr-1.5 h-4 w-4" />
              목록으로
            </Button>
            <Button
              size="sm"
              onClick={() => void handleSave()}
              disabled={updateRoleAuth.isPending}
            >
              <Save aria-hidden="true" className="mr-1.5 h-4 w-4" />
              {updateRoleAuth.isPending ? "저장 중..." : "저장"}
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <span>메뉴 접근 권한</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                전체 선택
              </Button>
              <Button variant="outline" size="sm" onClick={handleDeselectAll}>
                전체 해제
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {menuAuths.length === 0 ? (
            <EmptyState
              icon={Shield}
              title="설정 가능한 메뉴가 없습니다"
              description="빌딩에 등록된 메뉴가 없습니다."
            />
          ) : (
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
              {menuAuths.map((menu: RoleMenuAuthDTO) => (
                <MenuAuthItem
                  key={menu.menuId}
                  menu={menu}
                  checked={checkedMap[menu.menuId] ?? false}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
