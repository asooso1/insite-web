import { getAuthUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { LogoutButton } from "./logout-button";

/**
 * 대시보드 페이지
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
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">대시보드</h2>
          <p className="text-muted-foreground">환영합니다, {user.accountName}님</p>
        </div>

        {/* 사용자 정보 카드 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">사용자 정보</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">아이디</dt>
                <dd className="font-medium">{user.userId}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">이름</dt>
                <dd className="font-medium">{user.accountName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">계정 유형</dt>
                <dd className="font-medium">{user.accountType}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">역할</dt>
                <dd className="font-medium">{user.userRoles.join(", ")}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">소속 정보</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">회사</dt>
                <dd className="font-medium">{user.currentCompanyName || "-"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">빌딩</dt>
                <dd className="font-medium">{user.currentBuildingName || "-"}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">개발 상태</h3>
            <p className="text-sm text-muted-foreground">
              Phase 2A 진행 중입니다. 인증 시스템이 구현되었습니다.
            </p>
            <div className="mt-4">
              <div className="h-2 w-full rounded-full bg-muted">
                <div className="h-2 w-[85%] rounded-full bg-primary" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Phase 2A: 85% 완료</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
