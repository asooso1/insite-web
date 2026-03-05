import { getAuthUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import { DashboardWidgets } from "./_components/dashboard-widgets";
import { PageHeader } from "@/components/common/page-header";

/**
 * 대시보드 페이지
 *
 * 사용자 요약 정보와 주요 위젯 그리드를 표시합니다.
 */
export default async function DashboardPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  const description = [
    `환영합니다, ${user.accountName}님`,
    user.currentBuildingName,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="space-y-6">
      <PageHeader
        title="대시보드"
        description={description}
        icon={LayoutDashboard}
      />
      <DashboardWidgets user={user} />
    </div>
  );
}
