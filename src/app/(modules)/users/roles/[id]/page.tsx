"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/data-display/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { InfoPanel } from "@/components/data-display/info-panel";
import { toast } from "sonner";

import { useRoleList, useRoleMenuAuths, useUpdateRoleAuth } from "@/lib/hooks/use-roles";
import { handleApiError } from "@/lib/api/error-handler";

// ============================================================================
// 메인 페이지 컴포넌트
// ============================================================================

export default function RoleDetailPage() {
  const params = useParams();
  const roleId = Number(params.id);

  // 로컬 상태
  const [editMode, setEditMode] = useState(false);
  const [selectedMenuIds, setSelectedMenuIds] = useState<number[]>([]);

  // 데이터 조회
  const { data: roles, isLoading: rolesLoading } = useRoleList();
  const { data: menuAuths, isLoading: authsLoading } = useRoleMenuAuths(roleId);
  const { mutate: updateAuth, isPending } = useUpdateRoleAuth();

  // 현재 역할 찾기
  const currentRole = roles?.find((r) => r.id === roleId);

  // 초기화: 권한 목록에서 선택된 메뉴 ID 추출
  if (editMode && selectedMenuIds.length === 0 && menuAuths?.length) {
    setSelectedMenuIds(menuAuths.filter((m) => m.hasAuth).map((m) => m.menuId));
  }

  const handleMenuToggle = (menuId: number, checked: boolean) => {
    setSelectedMenuIds((prev) =>
      checked ? [...prev, menuId] : prev.filter((id) => id !== menuId)
    );
  };

  const handleSaveAuth = () => {
    updateAuth(
      { roleId, menuIds: selectedMenuIds },
      {
        onSuccess: () => {
          toast.success("권한이 수정되었습니다.");
          setEditMode(false);
        },
        onError: (error) => {
          handleApiError(error as Error);
        },
      }
    );
  };

  const handleCancel = () => {
    setEditMode(false);
    setSelectedMenuIds([]);
  };

  // 로딩 상태
  if (rolesLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  // 데이터 없음
  if (!currentRole) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="역할을 찾을 수 없습니다"
        description="존재하지 않는 역할입니다."
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* 헤더 */}
      <PageHeader
        title={currentRole.name}
        description={currentRole.description || ""}
      />

      {/* 탭 */}
      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">기본정보</TabsTrigger>
          <TabsTrigger value="menu-auth">메뉴권한</TabsTrigger>
        </TabsList>

        {/* 기본정보 탭 */}
        <TabsContent value="info" className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-6">
            <InfoPanel
              items={[
                { label: "역할ID", value: currentRole.id },
                { label: "역할코드", value: currentRole.code },
                { label: "역할명", value: currentRole.name },
                {
                  label: "설명",
                  value: currentRole.description || "-",
                },
              ]}
            />
          </div>
        </TabsContent>

        {/* 메뉴권한 탭 */}
        <TabsContent value="menu-auth" className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-6">
            {authsLoading ? (
              <div className="text-muted-foreground">로딩 중...</div>
            ) : !editMode ? (
              <div className="space-y-4">
                {/* 읽기 모드 */}
                <div className="space-y-2">
                  {menuAuths?.map((auth) => (
                    <div key={auth.menuId} className="flex items-center gap-2">
                      <Checkbox
                        id={`menu-${auth.menuId}`}
                        checked={auth.hasAuth}
                        disabled
                      />
                      <Label
                        htmlFor={`menu-${auth.menuId}`}
                        className="cursor-default font-normal"
                      >
                        {auth.menuName}
                      </Label>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => setEditMode(true)}
                  className="mt-4"
                >
                  권한 편집
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* 편집 모드 */}
                <div className="space-y-2">
                  {menuAuths?.map((auth) => (
                    <div key={auth.menuId} className="flex items-center gap-2">
                      <Checkbox
                        id={`menu-edit-${auth.menuId}`}
                        checked={selectedMenuIds.includes(auth.menuId)}
                        onCheckedChange={(checked) =>
                          handleMenuToggle(auth.menuId, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`menu-edit-${auth.menuId}`}
                        className="cursor-pointer font-normal"
                      >
                        {auth.menuName}
                      </Label>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-2 border-t pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isPending}
                  >
                    취소
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSaveAuth}
                    disabled={isPending}
                  >
                    {isPending ? "저장 중..." : "저장"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
