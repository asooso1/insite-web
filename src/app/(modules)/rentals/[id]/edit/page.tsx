"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RentalForm } from "../../_components/rental-form";

import { useRentalView } from "@/lib/hooks/use-rentals";

export default function RentalEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { data: rental, isLoading, isError, refetch } = useRentalView(id);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-96 w-full" />
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
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="뒤로가기">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">임차 수정</h1>
          <p className="text-muted-foreground">임차 정보를 수정합니다.</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <RentalForm mode="edit" initialData={rental} rentalId={id} />
      </div>
    </div>
  );
}
