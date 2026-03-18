"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
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
import { handleApiError } from "@/lib/api/error-handler";
import { useDeleteCleaningBim } from "@/lib/hooks/use-cleaning";

interface Props {
  id: number;
}

export function CleaningDetailActions({ id }: Props) {
  const router = useRouter();
  const { mutateAsync: deleteCleaning, isPending } = useDeleteCleaningBim();

  const handleDelete = async () => {
    try {
      await deleteCleaning(id);
      toast.success("청소업체가 삭제되었습니다.");
      router.push("/service/cleaning");
    } catch (error) {
      handleApiError(error as Error);
    }
  };

  return (
    <div className="flex gap-2">
      <Button asChild variant="outline" size="sm">
        <Link href={`/service/cleaning/${id}/edit`}>
          <Pencil className="mr-1 h-4 w-4" />
          수정
        </Link>
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm" disabled={isPending}>
            <Trash2 className="mr-1 h-4 w-4" />
            삭제
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>청소업체 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 청소업체를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
