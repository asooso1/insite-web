"use client";

import { useParams, useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/data-display/empty-state";

import { useFacilityMasterView } from "@/lib/hooks/use-settings";
import { FacilityMasterForm } from "../../../_components/facility-master-form";

export default function FacilityMasterEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { data: master, isLoading, isError } = useFacilityMasterView(id);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError || !master) {
    return (
      <div className="p-6">
        <EmptyState
          icon={AlertCircle}
          title="표준 설비를 찾을 수 없습니다"
          description="요청하신 표준 설비가 존재하지 않습니다."
          action={{
            label: "설정으로 돌아가기",
            onClick: () => router.push("/settings"),
          }}
        />
      </div>
    );
  }

  return <FacilityMasterForm mode="edit" initialData={master} masterId={id} />;
}
