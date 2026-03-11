"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { RotateCcw } from "lucide-react";
import { useEvictMenuCache } from "@/lib/hooks/use-menu";

/**
 * 메뉴 캐시 관리 섹션
 * csp-was 서버의 메뉴 캐시를 초기화합니다.
 */
export function MenuCacheSection() {
  const mutation = useEvictMenuCache();

  const handleEvict = () => {
    mutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("메뉴 캐시가 초기화되었습니다.");
      },
      onError: () => {
        toast.error("캐시 초기화에 실패했습니다.");
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">메뉴 캐시 관리</CardTitle>
        <CardDescription>
          csp-was 서버의 메뉴 캐시를 초기화합니다. 메뉴 구조 변경 후 실행하세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              disabled={mutation.isPending}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              캐시 초기화
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>메뉴 캐시 초기화</AlertDialogTitle>
              <AlertDialogDescription>
                메뉴 캐시를 초기화하시겠습니까? 모든 사용자의 메뉴가 다시 로드됩니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction onClick={handleEvict}>
                초기화
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
