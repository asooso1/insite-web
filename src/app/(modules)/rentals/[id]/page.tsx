"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useRentalView, useDeleteRental } from "@/lib/hooks/use-rentals";
import { handleApiError } from "@/lib/api/error-handler";

export default function RentalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: rental, isLoading, isError, refetch } = useRentalView(id);
  const deleteRental = useDeleteRental();

  const handleDelete = () => {
    deleteRental.mutate(id, {
      onSuccess: () => {
        toast.success("임차 정보가 삭제되었습니다.");
        router.push("/rentals");
      },
      onError: (error) => {
        handleApiError(error as Error);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <Skeleton className="h-12 w-48" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !rental) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="text-center">
          <h2 className="text-lg font-semibold">데이터를 불러올 수 없습니다</h2>
          <Button onClick={() => refetch()} className="mt-4">
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{rental.companyName}</h1>
            <p className="text-muted-foreground">임차 정보 상세</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => router.push(`/rentals/${id}/edit`)}
            size="sm"
          >
            <Edit className="mr-2 h-4 w-4" />
            수정
          </Button>
          <Button
            onClick={() => setShowDeleteDialog(true)}
            variant="destructive"
            size="sm"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            삭제
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>임차 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">임차사명</p>
              <p className="font-medium">{rental.companyName}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">임차인</p>
              <p className="font-medium">{rental.tenantName}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">층</p>
              <p className="font-medium">{rental.floor}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">면적</p>
              <p className="font-medium">{rental.area}㎡</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">계약시작</p>
              <p className="font-medium">{rental.contractStart}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">계약종료</p>
              <p className="font-medium">{rental.contractEnd}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">임차료</p>
              <p className="font-medium">{(rental.rentAmount ?? 0).toLocaleString()}원</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">빌딩</p>
              <p className="font-medium">{rental.buildingName}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">등록일</p>
              <p className="font-medium">{rental.createdAt}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>임차 정보 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 임차 정보를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteRental.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteRental.isPending ? "삭제 중..." : "삭제"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
