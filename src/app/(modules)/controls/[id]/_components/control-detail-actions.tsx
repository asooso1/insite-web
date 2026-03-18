"use client";

import { useRouter } from "next/navigation";
import { Edit, Send, X, Trash2 } from "lucide-react";

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
import { toast } from "sonner";

import {
  useSendControlRequest,
  useCancelControlRequest,
  useDeleteControl,
} from "@/lib/hooks/use-controls";
import { handleApiError } from "@/lib/api/error-handler";
import { ControlState, type ControlDTO } from "@/lib/types/control";
import { useState } from "react";

interface ControlDetailActionsProps {
  control: ControlDTO;
}

export function ControlDetailActions({ control }: ControlDetailActionsProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { mutate: sendRequest, isPending: isSending } =
    useSendControlRequest();
  const { mutate: cancelRequest, isPending: isCancelling } =
    useCancelControlRequest();
  const { mutate: deleteControl, isPending: isDeleting } = useDeleteControl();

  const handleSendRequest = () => {
    sendRequest(
      { id: control.id },
      {
        onSuccess: () => {
          toast.success("제어 요청이 전송되었습니다.");
        },
        onError: (error) => {
          handleApiError(error as Error);
        },
      }
    );
  };

  const handleCancelRequest = () => {
    cancelRequest(
      { id: control.id },
      {
        onSuccess: () => {
          toast.success("제어 요청이 취소되었습니다.");
        },
        onError: (error) => {
          handleApiError(error as Error);
        },
      }
    );
  };

  const handleDeleteControl = () => {
    deleteControl(control.id, {
      onSuccess: () => {
        toast.success("제어가 삭제되었습니다.");
        router.push("/controls");
      },
      onError: (error) => {
        handleApiError(error as Error);
      },
    });
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {control.state === ControlState.WRITE && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/controls/${control.id}/edit`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              수정
            </Button>
            <Button
              size="sm"
              onClick={handleSendRequest}
              disabled={isSending}
            >
              <Send className="mr-2 h-4 w-4" />
              {isSending ? "전송 중..." : "요청 전송"}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              삭제
            </Button>
          </>
        )}

        {control.state === ControlState.REQUEST && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancelRequest}
            disabled={isCancelling}
          >
            <X className="mr-2 h-4 w-4" />
            {isCancelling ? "취소 중..." : "요청 취소"}
          </Button>
        )}
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>제어 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 정말 삭제하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteControl}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "삭제 중..." : "삭제"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
