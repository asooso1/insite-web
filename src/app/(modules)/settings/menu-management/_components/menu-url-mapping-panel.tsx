"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { mapMenuUrl } from "@/lib/utils/menu-url-mapper";
import {
  useMenuMappings,
  useSaveMenuMapping,
  useDeleteMenuMapping,
} from "@/lib/hooks/use-menu";
import type { MenuWithStatus } from "@/lib/types/menu";

interface MenuUrlMappingPanelProps {
  selectedMenu: MenuWithStatus | null;
}

/**
 * 메뉴 URL 매핑 패널
 * 선택된 메뉴의 URL 매핑을 관리합니다.
 */
export function MenuUrlMappingPanel({
  selectedMenu,
}: MenuUrlMappingPanelProps) {
  const mappingsQuery = useMenuMappings();
  const saveMutation = useSaveMenuMapping();
  const deleteMutation = useDeleteMenuMapping();

  const [inputUrl, setInputUrl] = useState("");
  const [autoMappedUrl, setAutoMappedUrl] = useState("");

  // 선택된 메뉴의 수동 매핑 찾기
  const existingMapping = mappingsQuery.data?.mappings.find(
    (m) => m.menuId === selectedMenu?.id
  );

  // 선택된 메뉴 변경 시 초기화
  useEffect(() => {
    if (!selectedMenu) {
      setInputUrl("");
      setAutoMappedUrl("");
      return;
    }

    // 자동 매핑 URL 계산
    const mapped = mapMenuUrl(selectedMenu.url);
    setAutoMappedUrl(mapped);

    // 수동 매핑이 있으면 사용, 없으면 빈 상태
    setInputUrl(existingMapping?.insiteWebUrl || "");
  }, [selectedMenu, existingMapping]);

  if (!selectedMenu) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          메뉴를 선택하세요.
        </CardContent>
      </Card>
    );
  }

  const handleSave = async () => {
    // URL 검증: "/"로 시작해야 함
    if (!inputUrl.startsWith("/")) {
      toast.error('URL은 "/"로 시작해야 합니다.');
      return;
    }

    saveMutation.mutate(
      {
        menuId: selectedMenu.id,
        menuName: selectedMenu.name,
        cspWasUrl: selectedMenu.url,
        insiteWebUrl: inputUrl,
      },
      {
        onSuccess: () => {
          toast.success("URL 매핑이 저장되었습니다.");
        },
        onError: () => {
          toast.error("저장에 실패했습니다.");
        },
      }
    );
  };

  const handleDelete = () => {
    deleteMutation.mutate(selectedMenu.id, {
      onSuccess: () => {
        toast.success("URL 매핑이 초기화되었습니다.");
        setInputUrl("");
      },
      onError: () => {
        toast.error("초기화에 실패했습니다.");
      },
    });
  };

  const isSaveDisabled =
    saveMutation.isPending ||
    inputUrl === existingMapping?.insiteWebUrl ||
    !inputUrl;
  const isDeleteDisabled =
    deleteMutation.isPending || !existingMapping;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">URL 매핑</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 메뉴명 */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">메뉴명</Label>
          <div className="text-base font-semibold">{selectedMenu.name}</div>
        </div>

        {/* csp-was URL */}
        <div className="space-y-2">
          <Label htmlFor="csp-was-url" className="text-sm">
            csp-was URL
          </Label>
          <Input
            id="csp-was-url"
            value={selectedMenu.url}
            readOnly
            className="bg-muted text-muted-foreground"
            aria-label="csp-was URL (읽기 전용)"
          />
        </div>

        {/* 자동 매핑 URL */}
        {autoMappedUrl && autoMappedUrl !== selectedMenu.url && (
          <div className="space-y-2">
            <Label htmlFor="auto-mapped-url" className="text-sm">
              자동 매핑 URL
            </Label>
            <Input
              id="auto-mapped-url"
              value={autoMappedUrl}
              readOnly
              className="bg-muted text-muted-foreground"
              aria-label="자동 매핑 URL (읽기 전용)"
            />
          </div>
        )}

        {/* insite-web URL */}
        <div className="space-y-2">
          <Label htmlFor="insite-web-url" className="text-sm font-medium">
            insite-web URL
          </Label>
          <Input
            id="insite-web-url"
            placeholder="/work-orders"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            aria-label="insite-web URL"
            aria-describedby="url-format-hint"
          />
          <p
            id="url-format-hint"
            className="text-xs text-muted-foreground"
          >
            "/"로 시작하는 경로를 입력하세요. (예: /work-orders, /facilities)
          </p>
        </div>

        {/* 버튼 */}
        <div className="flex gap-2 justify-end pt-2">
          {existingMapping && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={isDeleteDisabled}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  초기화
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>URL 매핑 초기화</AlertDialogTitle>
                  <AlertDialogDescription>
                    이 메뉴의 URL 매핑을 초기화하시겠습니까?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    초기화
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <Button
            onClick={handleSave}
            disabled={isSaveDisabled}
            size="sm"
          >
            {saveMutation.isPending ? "저장 중..." : "저장"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
