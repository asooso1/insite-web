import { getAuthUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { LogoutButton } from "./logout-button";
import { DashboardWidgets } from "./_components/dashboard-widgets";

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

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-primary">Insite</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user.accountName} ({user.userId})
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-4 py-6">
        {/* 페이지 제목 + 사용자 요약 */}
        <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">대시보드</h2>
            <p className="text-sm text-muted-foreground">
              환영합니다, {user.accountName}님
              {user.currentBuildingName ? ` · ${user.currentBuildingName}` : ""}
            </p>
          </div>
          <dl className="flex gap-4 text-sm">
            <div className="flex flex-col">
              <dt className="text-xs text-muted-foreground">계정 유형</dt>
              <dd className="font-medium">{user.accountType}</dd>
            </div>
            {user.currentCompanyName && (
              <div className="flex flex-col">
                <dt className="text-xs text-muted-foreground">회사</dt>
                <dd className="font-medium">{user.currentCompanyName}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* 위젯 그리드 (클라이언트 컴포넌트) */}
        <DashboardWidgets user={user} />
      </main>
    </div>
  );
}
