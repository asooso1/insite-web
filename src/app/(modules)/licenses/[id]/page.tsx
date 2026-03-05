"use client";

import { useParams, useRouter } from "next/navigation";
import { AlertCircle, Edit, ArrowLeft, ToggleLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/data-display/empty-state";
import { InfoPanel } from "@/components/data-display/info-panel";

import { useLicenseView, useEditLicenseState } from "@/lib/hooks/use-licenses";
import { LicenseStateLabel, LicenseStateStyle } from "@/lib/types/license";

export default function LicenseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params["id"]);

  const { data: license, isLoading, isError } = useLicenseView(id);
  const editState = useEditLicenseState();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-muted-foreground">불러오는 중...</div>
      </div>
    );
  }

  if (isError || !license) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="자격증 정보를 불러올 수 없습니다"
        description="잠시 후 다시 시도해주세요."
        action={{ label: "목록으로", onClick: () => router.push("/licenses") }}
      />
    );
  }

  const state = license.state as keyof typeof LicenseStateLabel;
  const stateLabel = LicenseStateLabel[state] ?? license.state;
  const stateStyle = LicenseStateStyle[state] ?? "";

  const handleToggleState = () => {
    if (confirm(`자격증 상태를 변경하시겠습니까?`)) {
      editState.mutate(license.id);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/licenses")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{license.name}</h1>
          <p className="text-muted-foreground">{license.publisher}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleToggleState} disabled={editState.isPending}>
            <ToggleLeft className="mr-2 h-4 w-4" />
            상태 변경
          </Button>
          <Button onClick={() => router.push(`/licenses/${id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            수정
          </Button>
        </div>
      </div>

      {/* 기본 정보 */}
      <InfoPanel
        title="자격증 기본 정보"
        columns={2}
        items={[
          { label: "자격증명", value: license.name },
          { label: "발행처", value: license.publisher || "-" },
          {
            label: "상태",
            value: (
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${stateStyle}`}
              >
                {stateLabel}
              </span>
            ),
          },
          { label: "분류 1", value: license.licenseDepth1 || "-" },
          { label: "분류 2", value: license.licenseDepth2 || "-" },
          { label: "분류 3", value: license.licenseDepth3 || "-" },
        ]}
      />
    </div>
  );
}
