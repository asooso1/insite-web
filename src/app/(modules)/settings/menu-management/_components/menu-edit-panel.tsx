"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useSaveMenuOverride, useDeleteMenuOverride } from "@/lib/hooks/use-menu";
import { handleApiError } from "@/lib/api/error-handler";
import type { MenuWithStatus, MenuOverride } from "@/lib/types/menu";

interface MenuEditPanelProps {
  selectedMenu: MenuWithStatus | null;
  allMenus: MenuWithStatus[];
}

const ROLES = [
  { value: "ROLE_SYSTEM_ADMIN", label: "시스템 관리자" },
  { value: "ROLE_LABS_SYSTEM_ADMIN", label: "Labs 관리자" },
  { value: "ROLE_MANAGER", label: "매니저" },
  { value: "ROLE_USER", label: "일반 사용자" },
];

// depth-1 메뉴 필터링
function getDepth1Menus(menus: MenuWithStatus[]): MenuWithStatus[] {
  return menus.filter((m) => m.depth === 1);
}

export function MenuEditPanel({ selectedMenu, allMenus }: MenuEditPanelProps) {
  const saveMutation = useSaveMenuOverride();
  const deleteMutation = useDeleteMenuOverride();

  const [formData, setFormData] = useState<Omit<MenuOverride, "updatedAt">>({
    menuId: 0,
    name: undefined,
    parentId: undefined,
    sortNo: undefined,
    isUse: undefined,
    isShow: undefined,
    roles: undefined,
  });

  const isLoading = saveMutation.isPending || deleteMutation.isPending;

  // selectedMenu 변경 시 폼 초기화
  useEffect(() => {
    if (selectedMenu) {
      setFormData({
        menuId: selectedMenu.id,
        name: selectedMenu.name === selectedMenu.name ? undefined : selectedMenu.name,
        parentId: selectedMenu.parentId,
        sortNo: selectedMenu.sortNo,
        isUse: selectedMenu.use,
        isShow: selectedMenu.show,
        roles: undefined,
      });
    }
  }, [selectedMenu]);

  if (!selectedMenu) {
    return (
      <Card>
        <CardContent className="p-4 flex items-center justify-center h-40 text-muted-foreground">
          메뉴를 선택하세요
        </CardContent>
      </Card>
    );
  }

  const depth1Menus = getDepth1Menus(allMenus);

  const handleSave = async (): Promise<void> => {
    try {
      // 기본값 제거 (undefined 또는 원본과 동일한 값)
      const override: Omit<MenuOverride, "updatedAt"> = {
        menuId: formData.menuId,
      };

      // 변경된 필드만 포함
      if (formData.name !== undefined && formData.name !== selectedMenu.name) {
        override.name = formData.name;
      }
      if (
        formData.parentId !== undefined &&
        formData.parentId !== selectedMenu.parentId
      ) {
        override.parentId = formData.parentId;
      }
      if (formData.sortNo !== undefined && formData.sortNo !== selectedMenu.sortNo) {
        override.sortNo = formData.sortNo;
      }
      if (formData.isUse !== undefined && formData.isUse !== selectedMenu.use) {
        override.isUse = formData.isUse;
      }
      if (formData.isShow !== undefined && formData.isShow !== selectedMenu.show) {
        override.isShow = formData.isShow;
      }
      if (formData.roles !== undefined && formData.roles.length > 0) {
        override.roles = formData.roles;
      }

      await saveMutation.mutateAsync(override);
      toast.success("변경사항이 저장되었습니다.");
    } catch (error) {
      handleApiError(error as Error);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (
      !window.confirm(
        "이 메뉴의 오버라이드를 삭제하시겠습니까? 원본 설정이 복원됩니다."
      )
    ) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(selectedMenu.id);
      toast.success("오버라이드가 삭제되었습니다.");
    } catch (error) {
      handleApiError(error as Error);
    }
  };

  const handleRoleToggle = (role: string): void => {
    setFormData((prev) => {
      const currentRoles = prev.roles ?? [];
      const newRoles = currentRoles.includes(role)
        ? currentRoles.filter((r) => r !== role)
        : [...currentRoles, role];
      return {
        ...prev,
        roles: newRoles.length > 0 ? newRoles : undefined,
      };
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">메뉴 편집</CardTitle>
          {selectedMenu.hasOverride && (
            <Badge variant="secondary" className="text-xs">
              수정됨
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 메뉴명 */}
        <div className="space-y-2">
          <Label htmlFor="menu-name" className="text-sm font-medium">
            메뉴명
          </Label>
          <Input
            id="menu-name"
            value={formData.name ?? selectedMenu.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value || undefined })
            }
            placeholder={selectedMenu.name}
            disabled={isLoading}
          />
        </div>

        {/* 상위 메뉴 */}
        <div className="space-y-2">
          <Label htmlFor="parent-menu" className="text-sm font-medium">
            상위 메뉴
          </Label>
          <Select
            value={String(formData.parentId ?? selectedMenu.parentId ?? "")}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                parentId: value ? Number(value) : undefined,
              })
            }
            disabled={isLoading}
          >
            <SelectTrigger id="parent-menu">
              <SelectValue placeholder="선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">없음 (최상위)</SelectItem>
              {depth1Menus.map((menu) => (
                <SelectItem key={menu.id} value={String(menu.id)}>
                  {menu.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 순서 */}
        <div className="space-y-2">
          <Label htmlFor="sort-no" className="text-sm font-medium">
            순서
          </Label>
          <Input
            id="sort-no"
            type="number"
            min="0"
            value={formData.sortNo ?? selectedMenu.sortNo ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                sortNo: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            disabled={isLoading}
          />
        </div>

        {/* 사용 여부 */}
        <div className="flex items-center justify-between">
          <Label htmlFor="is-use" className="text-sm font-medium">
            사용 여부
          </Label>
          <Switch
            id="is-use"
            checked={formData.isUse ?? selectedMenu.use}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isUse: checked })
            }
            disabled={isLoading}
          />
        </div>

        {/* 표시 여부 */}
        <div className="flex items-center justify-between">
          <Label htmlFor="is-show" className="text-sm font-medium">
            표시 여부
          </Label>
          <Switch
            id="is-show"
            checked={formData.isShow ?? selectedMenu.show}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isShow: checked })
            }
            disabled={isLoading}
          />
        </div>

        {/* 권한 */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">접근 가능 역할</Label>
          <div className="space-y-2">
            {ROLES.map((role) => (
              <div key={role.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`role-${role.value}`}
                  checked={(formData.roles ?? []).includes(role.value)}
                  onCheckedChange={() => handleRoleToggle(role.value)}
                  disabled={isLoading}
                />
                <label
                  htmlFor={`role-${role.value}`}
                  className="text-sm font-medium cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {role.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-2 pt-4">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1"
          >
            저장
          </Button>
          {selectedMenu.hasOverride && (
            <Button
              onClick={handleDelete}
              variant="destructive"
              disabled={isLoading}
              className="flex-1"
            >
              초기화
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
