/**
 * UI Preview 페이지 — 개발 전용
 * 모든 컴포넌트를 Mock 데이터와 함께 시각적으로 확인합니다.
 */

import type { ReactNode } from "react";
import {
  ClipboardList,
  Building,
  Users,
  TrendingUp,
  Search,
  Inbox,
  FileX,
  AlertCircle,
} from "lucide-react";

import { KPICard, KPICardGrid } from "@/components/data-display/kpi-card";
import { StatusBadge } from "@/components/data-display/status-badge";
import { InfoPanel } from "@/components/data-display/info-panel";
import { EmptyState, NoSearchResults, NoData, ErrorState } from "@/components/data-display/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ============================================================================
// Mock 데이터 — 번들 보호 (개발 전용)
// ============================================================================

const mockWorkOrders =
  process.env.NODE_ENV === "development"
    ? (await import("@/mocks/data/work-orders")).mockWorkOrders
    : [];

const mockFacilities =
  process.env.NODE_ENV === "development"
    ? (await import("@/mocks/data/facilities")).mockFacilities
    : [];

const { mockWorkOrderStatus } =
  process.env.NODE_ENV === "development"
    ? await import("@/mocks/data/dashboard")
    : { mockWorkOrderStatus: { totalCount: 0, pendingCount: 0, inProgressCount: 0, completedCount: 0, overdueCount: 0 } };

// ============================================================================
// 섹션 헬퍼
// ============================================================================

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}): ReactNode {
  return (
    <section data-section={id} className="space-y-4">
      <div className="border-b pb-2">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="text-xs text-muted-foreground font-mono">data-section="{id}"</p>
      </div>
      {children}
    </section>
  );
}

// ============================================================================
// 메인 페이지
// ============================================================================

export default async function UIPreviewPage(): Promise<ReactNode> {
  const firstFacility = mockFacilities[0];

  return (
    <div className="space-y-16">
      {/* 페이지 헤더 */}
      <PageHeader
        title="UI Preview"
        description="insite-web 컴포넌트 시각 검증 페이지 — 개발 전용"
        icon={ClipboardList}
        stats={[
          { label: "섹션", value: 10 },
          { label: "컴포넌트", value: "30+" },
        ]}
      />

      {/* Section 1: Colors */}
      <Section id="colors" title="색상 팔레트">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "primary", cls: "bg-primary" },
            { label: "secondary", cls: "bg-secondary" },
            { label: "muted", cls: "bg-muted" },
            { label: "accent", cls: "bg-accent" },
            { label: "destructive", cls: "bg-destructive" },
            { label: "brand gradient", style: "var(--gradient-brand)" },
            { label: "brand soft", style: "var(--gradient-brand-soft)" },
            { label: "success", style: "var(--gradient-success)" },
          ].map(({ label, cls, style }) => (
            <div key={label} className="space-y-1">
              <div
                className={`h-12 rounded-lg border ${cls ?? ""}`}
                style={style ? { background: `var(--gradient-${label.replace(" ", "-").replace("brand ", "brand")})` } : undefined}
              />
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="space-y-1">
            <div className="h-8 rounded shadow-[var(--shadow-card)]" />
            <p className="text-xs text-muted-foreground">shadow-card</p>
          </div>
          <div className="space-y-1">
            <div className="h-8 rounded shadow-[var(--shadow-card-hover)]" />
            <p className="text-xs text-muted-foreground">shadow-card-hover</p>
          </div>
          <div className="space-y-1">
            <div className="h-8 rounded shadow-[var(--shadow-panel)]" />
            <p className="text-xs text-muted-foreground">shadow-panel</p>
          </div>
        </div>
      </Section>

      {/* Section 2: Typography */}
      <Section id="typography" title="타이포그래피">
        <div className="space-y-3">
          {[
            { cls: "text-3xl font-bold", label: "3xl / bold — 페이지 제목" },
            { cls: "text-2xl font-semibold", label: "2xl / semibold — 섹션 제목" },
            { cls: "text-xl font-semibold", label: "xl / semibold — 서브 제목" },
            { cls: "text-lg font-medium", label: "lg / medium — 카드 제목" },
            { cls: "text-base", label: "base — 본문 텍스트" },
            { cls: "text-sm text-muted-foreground", label: "sm / muted — 보조 텍스트" },
            { cls: "text-xs text-muted-foreground uppercase tracking-wide font-medium", label: "xs / uppercase — InfoPanel 레이블" },
          ].map(({ cls, label }) => (
            <div key={label} className="flex items-baseline gap-4">
              <span className={cls}>{label}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 3: Badges */}
      <Section id="badges" title="StatusBadge — 전체 Enum 값">
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              작업지시 상태 (WorkOrderState)
            </p>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status="WRITE" />
              <StatusBadge status="ISSUE" />
              <StatusBadge status="PROCESSING" />
              <StatusBadge status="REQ_COMPLETE" />
              <StatusBadge status="COMPLETE" />
              <StatusBadge status="CANCEL" />
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              시설 상태 (FacilityState)
            </p>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status="BEFORE_CONSTRUCT" />
              <StatusBadge status="ONGOING_CONSTRUCT" />
              <StatusBadge status="END_CONSTRUCT" />
              <StatusBadge status="BEFORE_OPERATING" />
              <StatusBadge status="ONGOING_OPERATING" />
              <StatusBadge status="END_OPERATING" />
              <StatusBadge status="DISCARD" />
              <StatusBadge status="NOW_CHECK" />
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Generic 상태
            </p>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status="pending" />
              <StatusBadge status="inProgress" />
              <StatusBadge status="completed" />
              <StatusBadge status="cancelled" />
              <StatusBadge status="high" />
              <StatusBadge status="urgent" />
            </div>
          </div>
        </div>
      </Section>

      {/* Section 4: KPI Cards */}
      <Section id="kpi-cards" title="KPI 카드">
        <KPICardGrid columns={4}>
          <KPICard
            title="총 작업 건수"
            value={mockWorkOrderStatus.totalCount ?? 0}
            unit="건"
            icon={ClipboardList}
            trend="up"
            trendValue="+12%"
            trendLabel="전월 대비"
          />
          <KPICard
            title="진행중 작업"
            value={mockWorkOrderStatus.inProgressCount ?? 0}
            unit="건"
            icon={TrendingUp}
            trend="neutral"
            trendValue="±0%"
            trendLabel="전월 대비"
          />
          <KPICard
            title="완료 작업"
            value={mockWorkOrderStatus.completedCount ?? 0}
            unit="건"
            icon={Users}
            trend="up"
            trendValue="+8%"
            trendLabel="전월 대비"
          />
          <KPICard
            title="지연 작업"
            value={mockWorkOrderStatus.overdueCount ?? 0}
            unit="건"
            icon={Building}
            trend="down"
            trendValue="-2건"
            trendLabel="전월 대비"
          />
        </KPICardGrid>
      </Section>

      {/* Section 5: Data Table */}
      <Section id="data-table" title="데이터 테이블 — 작업지시 50개">
        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">작업지시 목록 ({mockWorkOrders.length}건)</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-auto max-h-[400px]">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 sticky top-0 backdrop-blur-sm">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">ID</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">작업명</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">상태</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">빌딩</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">작성자</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">작성일</th>
                  </tr>
                </thead>
                <tbody>
                  {mockWorkOrders.map((wo, i) => (
                    <tr key={wo.workOrderDTO.id} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                      <td className="px-4 py-2.5 text-muted-foreground">{wo.workOrderDTO.id}</td>
                      <td className="px-4 py-2.5 font-medium max-w-[200px] truncate">{wo.workOrderDTO.name}</td>
                      <td className="px-4 py-2.5">
                        <StatusBadge status={wo.workOrderDTO.state} />
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">{wo.buildingDTO.name}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{wo.workOrderDTO.writerName}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{wo.workOrderDTO.writeDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* Section 6: Filter Bar */}
      <Section id="filter-bar" title="SearchFilterBar — 필터 토글">
        <Card className="shadow-[var(--shadow-card)] p-4">
          <p className="text-xs text-muted-foreground mb-3">
            showFilterToggle=true 일 때 "필터" 버튼으로 접기/펼치기
          </p>
          <div className="space-y-2">
            <div className="flex gap-2 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="작업 검색..." className="pl-8 h-9" />
              </div>
              <Button variant="outline" size="sm" className="h-9 gap-1">
                필터
                <Badge variant="secondary" className="ml-1 rounded-sm px-1 font-normal">3</Badge>
              </Button>
              <Button size="sm" className="h-9">검색</Button>
            </div>
            <div className="flex flex-wrap gap-2 border border-border/60 rounded-lg p-3">
              <Select>
                <SelectTrigger className="h-9 w-[150px]">
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WRITE">작성</SelectItem>
                  <SelectItem value="ISSUE">발행</SelectItem>
                  <SelectItem value="PROCESSING">처리중</SelectItem>
                  <SelectItem value="COMPLETE">완료</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="h-9 w-[150px]">
                  <SelectValue placeholder="빌딩 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">강남파이낸스센터</SelectItem>
                  <SelectItem value="2">서울스퀘어</SelectItem>
                  <SelectItem value="3">삼성타워</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </Section>

      {/* Section 7: Info Panel */}
      <Section id="info-panel" title="InfoPanel — 시설 상세">
        {firstFacility ? (
          <InfoPanel
            title="시설 기본 정보"
            columns={2}
            showDivider
            items={[
              { label: "시설명", value: firstFacility.facilityDTO.name },
              { label: "상태", value: <StatusBadge status={firstFacility.facilityDTO.state} /> },
              { label: "빌딩", value: firstFacility.buildingDTO.name },
              { label: "층", value: firstFacility.facilityDTO.buildingFloorName },
              { label: "대분류", value: firstFacility.firstFacilityCategory?.name ?? "-" },
              { label: "중분류", value: firstFacility.secondFacilityCategory?.name ?? "-" },
              { label: "시설 번호", value: firstFacility.facilityDTO.facilityNo },
              { label: "판매사", value: firstFacility.facilityDTO.sellCompany ?? "-" },
              { label: "설치일", value: firstFacility.facilityDTO.installDate ?? "-" },
              { label: "운영 시작일", value: firstFacility.facilityDTO.startRunDate ?? "-" },
            ]}
          />
        ) : (
          <p className="text-muted-foreground text-sm">시설 Mock 데이터 없음</p>
        )}
      </Section>

      {/* Section 8: Charts */}
      <Section id="charts" title="차트 — 월별 작업 현황">
        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="text-base">월별 작업 현황 (2025.03 ~ 2026.02)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { month: "2025-03", total: 42, completed: 38 },
                { month: "2025-06", total: 51, completed: 47 },
                { month: "2025-09", total: 47, completed: 43 },
                { month: "2025-12", total: 58, completed: 53 },
                { month: "2026-01", total: 46, completed: 42 },
                { month: "2026-02", total: 50, completed: 7 },
              ].map(({ month, total, completed }) => (
                <div key={month} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-20 shrink-0">{month}</span>
                  <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-[image:var(--gradient-brand)] rounded-full"
                      style={{ width: `${(completed / total) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-20 text-right">
                    {completed}/{total}건
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* Section 9: Forms */}
      <Section id="forms" title="폼 요소 갤러리">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="shadow-[var(--shadow-card)] p-4 space-y-3">
            <p className="text-sm font-medium">Input 컴포넌트</p>
            <Input placeholder="일반 텍스트 입력" />
            <Input placeholder="검색..." type="search" />
            <Input placeholder="비밀번호" type="password" />
            <Input placeholder="비활성화" disabled />
          </Card>
          <Card className="shadow-[var(--shadow-card)] p-4 space-y-3">
            <p className="text-sm font-medium">Select 컴포넌트</p>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="상태 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WRITE">작성</SelectItem>
                <SelectItem value="ISSUE">발행</SelectItem>
                <SelectItem value="PROCESSING">처리중</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm font-medium mt-2">Button 변형</p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm">Primary</Button>
              <Button size="sm" variant="secondary">Secondary</Button>
              <Button size="sm" variant="outline">Outline</Button>
              <Button size="sm" variant="ghost">Ghost</Button>
              <Button size="sm" variant="destructive">Destructive</Button>
            </div>
          </Card>
        </div>
      </Section>

      {/* Section 10: Empty States */}
      <Section id="empty-states" title="빈 상태 컴포넌트 3종">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="shadow-[var(--shadow-card)]">
            <CardContent className="pt-6">
              <NoData />
            </CardContent>
          </Card>
          <Card className="shadow-[var(--shadow-card)]">
            <CardContent className="pt-6">
              <NoSearchResults />
            </CardContent>
          </Card>
          <Card className="shadow-[var(--shadow-card)]">
            <CardContent className="pt-6">
              <ErrorState message="네트워크 연결을 확인해 주세요." />
            </CardContent>
          </Card>
        </div>
      </Section>
    </div>
  );
}
