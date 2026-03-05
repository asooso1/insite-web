"use client";

import { MapPin, Briefcase, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/page-header";
import { useRouter } from "next/navigation";

// ============================================================================
// 통계 카드
// ============================================================================

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "blue" | "green" | "orange" | "purple";
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  const bgColors = {
    blue: "bg-blue-50",
    green: "bg-green-50",
    orange: "bg-orange-50",
    purple: "bg-purple-50",
  };

  const iconColors = {
    blue: "text-blue-600",
    green: "text-green-600",
    orange: "text-orange-600",
    purple: "text-purple-600",
  };

  const borderColors = {
    blue: "border-blue-200",
    green: "border-green-200",
    orange: "border-orange-200",
    purple: "border-purple-200",
  };

  return (
    <div
      className={`rounded-lg border ${borderColors[color]} ${bgColors[color]} p-6 animate-in fade-in slide-in-from-bottom-2`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
        </div>
        <div className={`rounded-lg bg-white/50 p-2 ${iconColors[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 링크 카드
// ============================================================================

interface LinkCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

function LinkCard({ icon, title, description, href }: LinkCardProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(href)}
      className="rounded-lg border border-gray-200 bg-white p-6 text-left transition-all hover:border-primary hover:shadow-md active:scale-95"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-3 flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              {icon}
            </div>
            <h3 className="font-semibold text-foreground">{title}</h3>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />
      </div>
    </button>
  );
}

// ============================================================================
// 메인 페이지
// ============================================================================

export default function FieldworkDashboard() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="현장작업 대시보드"
        description="현장 프로젝트 및 작업 현황을 한눈에 파악하세요"
        icon={MapPin}
      />

      {/* 통계 영역 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Briefcase className="h-6 w-6" />}
          label="진행중 프로젝트"
          value={5}
          color="blue"
        />
        <StatCard
          icon={<Clock className="h-6 w-6" />}
          label="오늘 출근자"
          value={12}
          color="green"
        />
        <StatCard
          icon={<CheckCircle className="h-6 w-6" />}
          label="대기 작업"
          value={8}
          color="orange"
        />
        <StatCard
          icon={<MapPin className="h-6 w-6" />}
          label="완료 작업"
          value={42}
          color="purple"
        />
      </div>

      {/* 메뉴 카드 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <LinkCard
          icon={<Briefcase className="h-5 w-5" />}
          title="프로젝트 관리"
          description="현장 프로젝트를 등록하고 관리하세요"
          href="/fieldwork/projects"
        />
        <LinkCard
          icon={<CheckCircle className="h-5 w-5" />}
          title="작업지시"
          description="작업을 지시하고 진행 현황을 추적하세요"
          href="/fieldwork/work-orders"
        />
        <LinkCard
          icon={<Clock className="h-5 w-5" />}
          title="출퇴근 이력"
          description="작업자의 출퇴근 기록을 확인하세요"
          href="/fieldwork/attendance"
        />
      </div>
    </div>
  );
}
