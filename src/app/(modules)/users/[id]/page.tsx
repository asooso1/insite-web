"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Building2,
  Phone,
  Mail,
  Calendar,
  User,
  Shield,
  AlertCircle,
  KeyRound,
  Briefcase,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/data-display/status-badge";
import { EmptyState } from "@/components/data-display/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

import { useUserView, useResetPassword } from "@/lib/hooks/use-users";
import {
  AccountStateLabel,
  AccountStateStyle,
  AccountTypeLabel,
  type AccountType,
} from "@/lib/types/user";

// ============================================================================
// 정보 항목 컴포넌트
// ============================================================================

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value || "-"}</p>
      </div>
    </div>
  );
}

// ============================================================================
// 로딩 스켈레톤
// ============================================================================

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

// ============================================================================
// 메인 페이지 컴포넌트
// ============================================================================

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { data: user, isLoading, isError } = useUserView(id);
  const resetPasswordMutation = useResetPassword();

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (isError || !user) {
    return (
      <div className="p-6">
        <EmptyState
          icon={AlertCircle}
          title="사용자를 찾을 수 없습니다"
          description="요청하신 사용자가 존재하지 않거나 접근 권한이 없습니다."
          action={{
            label: "목록으로 돌아가기",
            onClick: () => router.push("/users"),
          }}
        />
      </div>
    );
  }

  const handleResetPassword = () => {
    if (confirm(`${user.name} 사용자의 비밀번호를 초기화하시겠습니까?`)) {
      resetPasswordMutation.mutate(
        { id: user.id, userId: user.userId, name: user.name, companyId: user.companyId, mobile: user.mobile, gender: user.gender as "M" | "F", state: user.state, roleId: user.roleId, isInitPassword: true },
        {
          onSuccess: () => alert("비밀번호가 초기화되었습니다."),
          onError: () => alert("비밀번호 초기화에 실패했습니다."),
        }
      );
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/users")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <StatusBadge
                status={AccountStateStyle[user.state]}
                label={AccountStateLabel[user.state] ?? user.state}
              />
            </div>
            <p className="text-muted-foreground">
              @{user.userId} · {user.roleName || "역할 없음"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetPassword}
            disabled={resetPasswordMutation.isPending}
          >
            <KeyRound className="mr-2 h-4 w-4" />
            비밀번호 초기화
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/users/${id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            수정
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* 좌측 메인 컨텐츠 */}
        <div className="md:col-span-2 space-y-6">
          {/* 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <InfoItem icon={User} label="이름" value={user.name} />
              <InfoItem icon={User} label="아이디" value={user.userId} />
              <InfoItem
                icon={Building2}
                label="소속회사"
                value={user.companyName}
              />
              <InfoItem
                icon={Briefcase}
                label="부서"
                value={user.department}
              />
              <InfoItem
                icon={Briefcase}
                label="직책"
                value={user.position}
              />
              <InfoItem
                icon={Shield}
                label="유형"
                value={
                  user.type
                    ? AccountTypeLabel[user.type as AccountType] ?? user.type
                    : "-"
                }
              />
              <InfoItem
                icon={User}
                label="성별"
                value={user.gender === "M" ? "남성" : user.gender === "F" ? "여성" : "-"}
              />
              <InfoItem
                icon={Calendar}
                label="생년월일"
                value={user.birthDate}
              />
            </CardContent>
          </Card>

          {/* 연락처 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>연락처</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <InfoItem icon={Phone} label="휴대폰" value={user.mobile} />
              <InfoItem
                icon={Mail}
                label="이메일"
                value="-"
              />
            </CardContent>
          </Card>

          {/* 담당 건물 */}
          {user.buildingAccountDTO && user.buildingAccountDTO.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  담당 건물 ({user.buildingAccountDTO.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {user.buildingAccountDTO.map((ba) => (
                    <div
                      key={ba.id}
                      className="flex items-center justify-between rounded-md border p-3"
                    >
                      <div>
                        <p className="font-medium">{ba.buildingName}</p>
                        <p className="text-sm text-muted-foreground">
                          {ba.companyName}
                        </p>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {ba.jobTypeName || ba.jobType}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 우측 사이드바 */}
        <div className="space-y-6">
          {/* 근무 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>근무 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoItem
                icon={Shield}
                label="역할"
                value={user.roleName}
              />
              <InfoItem
                icon={Calendar}
                label="입사일"
                value={user.hiredDate}
              />
              <InfoItem
                icon={Calendar}
                label="퇴사일"
                value={user.retiredDate}
              />
            </CardContent>
          </Card>

          {/* 자격증 */}
          {user.accountLicenseDTO && user.accountLicenseDTO.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>자격증</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {user.accountLicenseDTO.map((license) => (
                    <div
                      key={license.id}
                      className="rounded-md border p-2"
                    >
                      <p className="text-sm font-medium">
                        {license.licenseName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {license.licenseNo}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 이력 */}
          <Card>
            <CardHeader>
              <CardTitle>이력</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">등록일</p>
                <p className="font-medium">
                  {user.writeEmbedded || user.writeDate || "-"}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">비고</p>
                <p className="text-sm">{user.note || "-"}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
