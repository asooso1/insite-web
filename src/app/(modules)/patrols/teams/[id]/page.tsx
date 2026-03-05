"use client";

import { useParams, useRouter } from "next/navigation";
import { AlertCircle, Edit, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/data-display/empty-state";
import { InfoPanel } from "@/components/data-display/info-panel";

import { usePatrolTeam } from "@/lib/hooks/use-patrols";
import { PatrolTeamStateLabel, PatrolTeamStateStyle } from "@/lib/types/patrol";

export default function PatrolTeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params["id"]);

  const { data: team, isLoading, isError } = usePatrolTeam(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-muted-foreground">불러오는 중...</div>
      </div>
    );
  }

  if (isError || !team) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="순찰 팀 정보를 불러올 수 없습니다"
        description="잠시 후 다시 시도해주세요."
        action={{ label: "목록으로", onClick: () => router.push("/patrols") }}
      />
    );
  }

  const stateLabel = PatrolTeamStateLabel[team.state] ?? team.stateName;
  const stateStyle = PatrolTeamStateStyle[team.state] ?? "";

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/patrols")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{team.name}</h1>
          <p className="text-muted-foreground">차량: {team.carNo || "-"}</p>
        </div>
        <Button onClick={() => router.push(`/patrols/teams/${id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          수정
        </Button>
      </div>

      {/* 기본 정보 */}
      <InfoPanel
        title="팀 기본 정보"
        columns={2}
        items={[
          { label: "팀명", value: team.name },
          { label: "차량번호", value: team.carNo || "-" },
          {
            label: "상태",
            value: (
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${stateStyle}`}>
                {stateLabel}
              </span>
            ),
          },
          { label: "작성일", value: team.writeDate || "-" },
        ]}
      />

      {/* 팀원 목록 */}
      {team.patrolTeamAccounts.length > 0 && (
        <div className="rounded-lg border bg-card p-4">
          <h2 className="mb-3 font-semibold">팀원 ({team.patrolTeamAccounts.length}명)</h2>
          <div className="divide-y">
            {team.patrolTeamAccounts.map((account) => (
              <div key={account.id} className="py-2">
                <span>{account.accountName}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 담당 건물 목록 */}
      {team.patrolTeamBuildings.length > 0 && (
        <div className="rounded-lg border bg-card p-4">
          <h2 className="mb-3 font-semibold">담당 건물 ({team.patrolTeamBuildings.length}개)</h2>
          <div className="divide-y">
            {team.patrolTeamBuildings.map((building) => (
              <div key={building.id} className="py-2">
                <span>{building.buildingName}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
