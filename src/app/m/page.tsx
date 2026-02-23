import * as React from "react";
import { MobileShell } from "@/components/layout/mobile-shell";
import {
  ClipboardList,
  Building,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * 모바일 홈 화면
 * - KPI 요약 카드
 * - 빠른 메뉴
 * - 최근 작업 목록
 */
export default function MobilePage(): React.JSX.Element {
  return (
    <MobileShell>
      <div className="flex flex-col gap-4">
        {/* KPI 요약 */}
        <section aria-labelledby="kpi-heading">
          <h2 id="kpi-heading" className="mb-2 text-sm font-semibold text-muted-foreground">
            오늘의 현황
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <KpiCard
              label="미처리 작업"
              value="12"
              icon={<Clock className="h-4 w-4 text-orange-500" />}
              className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/30"
            />
            <KpiCard
              label="완료 작업"
              value="34"
              icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}
              className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30"
            />
            <KpiCard
              label="긴급 작업"
              value="3"
              icon={<AlertTriangle className="h-4 w-4 text-destructive" />}
              className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
            />
            <KpiCard
              label="등록 시설"
              value="128"
              icon={<Building className="h-4 w-4 text-blue-500" />}
              className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30"
            />
          </div>
        </section>

        {/* 빠른 메뉴 */}
        <section aria-labelledby="quick-menu-heading">
          <h2 id="quick-menu-heading" className="mb-2 text-sm font-semibold text-muted-foreground">
            빠른 메뉴
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <QuickMenuCard
              href="/m/work-orders"
              icon={<ClipboardList className="h-6 w-6 text-primary" />}
              label="작업 조회"
            />
            <QuickMenuCard
              href="/m/facilities"
              icon={<Building className="h-6 w-6 text-primary" />}
              label="시설 조회"
            />
          </div>
        </section>

        {/* 최근 작업 */}
        <section aria-labelledby="recent-work-heading">
          <div className="mb-2 flex items-center justify-between">
            <h2 id="recent-work-heading" className="text-sm font-semibold text-muted-foreground">
              최근 작업
            </h2>
            <Link
              href="/m/work-orders"
              className="flex items-center text-xs text-primary"
            >
              전체보기
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <Card>
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                {RECENT_WORKS.map((work) => (
                  <li key={work.id}>
                    <Link
                      href={`/m/work-orders/${work.id}`}
                      className="flex items-center justify-between px-4 py-3 active:bg-accent"
                    >
                      <div className="flex-1 truncate">
                        <p className="truncate text-sm font-medium">{work.title}</p>
                        <p className="text-xs text-muted-foreground">{work.location}</p>
                      </div>
                      <div className="ml-2 flex items-center gap-2">
                        <StatusBadge status={work.status} />
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </MobileShell>
  );
}

// --- 서브 컴포넌트 ---

function KpiCard({
  label,
  value,
  icon,
  className,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  className?: string;
}): React.JSX.Element {
  return (
    <div className={cn("rounded-lg border p-3", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        {icon}
      </div>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

function QuickMenuCard({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}): React.JSX.Element {
  return (
    <Link href={href}>
      <Card className="active:bg-accent">
        <CardContent className="flex flex-col items-center justify-center gap-2 p-4">
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </CardContent>
      </Card>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }): React.JSX.Element {
  const styles: Record<string, string> = {
    진행중: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    완료: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    긴급: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    대기: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  };
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[10px] font-medium",
        styles[status] ?? styles["대기"]
      )}
    >
      {status}
    </span>
  );
}

// 임시 데이터 (실제로는 API 조회)
const RECENT_WORKS = [
  { id: "1", title: "에어컨 필터 교체", location: "B동 3층", status: "진행중" },
  { id: "2", title: "조명 교체 작업", location: "A동 1층 로비", status: "대기" },
  { id: "3", title: "소화기 점검", location: "C동 전층", status: "긴급" },
  { id: "4", title: "엘리베이터 정기 점검", location: "B동", status: "완료" },
];
