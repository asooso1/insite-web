"use client";

import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/data-display/empty-state";
import { PageHeader } from "@/components/common/page-header";

import {
  useSopView,
} from "@/lib/hooks/use-sops";
import {
  SopStateLabel,
  SopStateStyle,
  type SopDTO,
} from "@/lib/types/sop";
import { StatusBadge } from "@/components/data-display/status-badge";

// ============================================================================
// 기본 정보 섹션
// ============================================================================

function BasicInfoSection({ sop }: { sop: SopDTO }) {
  const keywords = sop.sopKeyWord
    .split("#")
    .filter((k) => k.trim());

  return (
    <Card>
      <CardHeader>
        <CardTitle>기본 정보</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-sm font-medium text-muted-foreground">제목</div>
            <div className="mt-1 text-base font-semibold">{sop.title}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">상태</div>
            <div className="mt-1">
              <StatusBadge
                status={SopStateStyle[sop.sopState]}
                label={SopStateLabel[sop.sopState]}
              />
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">빌딩</div>
            <div className="mt-1 text-sm">{sop.buildingDTO.name}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">설비분류</div>
            <div className="mt-1 text-sm">{sop.facilityCategoryName}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">버전</div>
            <div className="mt-1 text-sm">v{sop.version}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">작성자</div>
            <div className="mt-1 text-sm">
              {sop.writerName} ({sop.writerCompanyName})
            </div>
          </div>
          <div className="col-span-2">
            <div className="text-sm font-medium text-muted-foreground">설명</div>
            <div className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">
              {sop.explain}
            </div>
          </div>
          {keywords.length > 0 && (
            <div className="col-span-2">
              <div className="text-sm font-medium text-muted-foreground">
                키워드
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {keywords.map((keyword, idx) => (
                  <Badge key={idx} variant="secondary">
                    {keyword.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// 작업순서 테이블 섹션
// ============================================================================

function JobOrdersSection({ sop }: { sop: SopDTO }) {
  if (!sop.sopJobOrders || sop.sopJobOrders.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>작업순서</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>1차 순서</TableHead>
              <TableHead>2차 순서</TableHead>
              <TableHead>내용</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sop.sopJobOrders.map((job, idx) => (
              <TableRow key={idx}>
                <TableCell className="text-center">
                  {job.jobContentFirstOrder}
                </TableCell>
                <TableCell className="text-center">
                  {job.jobContentSecondOrder}
                </TableCell>
                <TableCell>{job.jobContents}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// 변경이력 테이블 섹션
// ============================================================================

function HistorySection({ sop }: { sop: SopDTO }) {
  if (!sop.sopHistoryDTOs || sop.sopHistoryDTOs.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>변경이력</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>버전</TableHead>
              <TableHead>제목</TableHead>
              <TableHead>작업순서수</TableHead>
              <TableHead>작성일</TableHead>
              <TableHead>상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sop.sopHistoryDTOs.map((history, idx) => (
              <TableRow key={idx}>
                <TableCell className="text-center">v{history.version}</TableCell>
                <TableCell>{history.title}</TableCell>
                <TableCell className="text-center">{history.jobOrderCount}</TableCell>
                <TableCell className="text-sm">
                  {history.writeDate.split(" ")[0]}
                </TableCell>
                <TableCell>
                  <StatusBadge
                    status={SopStateStyle[history.state]}
                    label={SopStateLabel[history.state]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// 메인 상세 페이지
// ============================================================================

export default function SopDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const { data: sop, isLoading, isError, refetch } = useSopView(id);

  if (isError) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="데이터를 불러올 수 없습니다"
        description="잠시 후 다시 시도해주세요."
        action={{ label: "다시 시도", onClick: () => refetch() }}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (!sop) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="SOP를 찾을 수 없습니다"
        description="존재하지 않는 SOP입니다."
        action={{ label: "목록으로 이동", onClick: () => router.push("/work-orders/sop") }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          뒤로가기
        </Button>
        <Button onClick={() => router.push(`/work-orders/sop/${id}/edit`)}>
          수정
        </Button>
      </div>

      {/* 기본 정보 */}
      <BasicInfoSection sop={sop} />

      {/* 작업순서 */}
      <JobOrdersSection sop={sop} />

      {/* 변경이력 */}
      <HistorySection sop={sop} />
    </div>
  );
}
