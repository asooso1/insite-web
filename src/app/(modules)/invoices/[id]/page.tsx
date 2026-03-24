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

import { useServiceChargeView, useDeleteServiceCharge } from "@/lib/hooks/use-invoices";
import { handleApiError } from "@/lib/api/error-handler";

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: invoice, isLoading, isError, refetch } = useServiceChargeView(id);
  const deleteInvoice = useDeleteServiceCharge();

  const handleDelete = () => {
    deleteInvoice.mutate(id, {
      onSuccess: () => {
        toast.success("청구서가 삭제되었습니다.");
        router.push("/invoices");
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

  if (isError || !invoice) {
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
          <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="뒤로가기">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{invoice.title}</h1>
            <p className="text-muted-foreground">청구서 상세 정보</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => router.push(`/invoices/${id}/edit`)}
            size="sm"
          >
            <Edit aria-hidden="true" className="mr-2 h-4 w-4" />
            수정
          </Button>
          <Button
            onClick={() => setShowDeleteDialog(true)}
            variant="destructive"
            size="sm"
          >
            <Trash2 aria-hidden="true" className="mr-2 h-4 w-4" />
            삭제
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>청구서 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">제목</p>
              <p className="font-medium">{invoice.title}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">금액</p>
              <p className="font-medium">{(invoice.amount ?? 0).toLocaleString()}원</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">청구월</p>
              <p className="font-medium">{invoice.month}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">빌딩</p>
              <p className="font-medium">{invoice.buildingName}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">등록일</p>
              <p className="font-medium">{invoice.createdAt}</p>
            </div>
          </div>

          {invoice.note && (
            <div>
              <p className="text-sm text-muted-foreground">비고</p>
              <p className="whitespace-pre-wrap">{invoice.note}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>청구서 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 청구서를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteInvoice.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteInvoice.isPending ? "삭제 중..." : "삭제"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
