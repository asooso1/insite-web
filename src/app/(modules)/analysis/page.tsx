"use client";

import { useRouter } from "next/navigation";
import {
  TrendingUp,
  BarChart2,
  Activity,
  Package,
  Users,
  ClipboardList,
} from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { cn } from "@/lib/utils";

interface AnalysisCard {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
}

const ANALYSIS_CARDS: AnalysisCard[] = [
  {
    title: "사용 현황",
    description: "월별 기능 사용 현황 및 참여율 분석",
    icon: TrendingUp,
    href: "/analysis/usage",
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "통계 분석",
    description: "빌딩별 기능 점수 및 직무별 분포",
    icon: BarChart2,
    href: "/analysis/statistics",
    color: "from-purple-500 to-purple-600",
  },
  {
    title: "FMS 트렌드",
    description: "관제점별 시간대별 데이터 추이",
    icon: Activity,
    href: "/analysis/trend/fms",
    color: "from-green-500 to-green-600",
  },
  {
    title: "자재 분석",
    description: "자재 입출고 및 사용 현황",
    icon: Package,
    href: "/analysis/fms-item",
    color: "from-amber-500 to-amber-600",
  },
  {
    title: "인력 분석",
    description: "투입 인력 및 처리율 분석",
    icon: Users,
    href: "/analysis/fms-labor",
    color: "from-rose-500 to-rose-600",
  },
  {
    title: "작업 현황",
    description: "작업 발생 건수 및 완료 시간 분석",
    icon: ClipboardList,
    href: "/analysis/fms-team",
    color: "from-cyan-500 to-cyan-600",
  },
];

export default function AnalysisPage() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <PageHeader title="분석" icon={BarChart2} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ANALYSIS_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.href}
              onClick={() => router.push(card.href)}
              className={cn(
                "group relative overflow-hidden rounded-lg bg-gradient-to-br p-6 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95",
                card.color
              )}
            >
              <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/10" />
              <div className="relative space-y-3">
                <Icon className="h-8 w-8 text-white/90" />
                <div className="text-left">
                  <h3 className="text-lg font-semibold">{card.title}</h3>
                  <p className="text-sm text-white/80">{card.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
