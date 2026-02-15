"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Trash2,
  KeyRound,
  Building2,
  Phone,
  Mail,
  Calendar,
  User,
  Shield,
  Briefcase,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/data-display/status-badge";
import { EmptyState } from "@/components/data-display/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useUserView, useDeleteUser, useResetPassword } from "@/lib/hooks/use-users";
import {
  AccountStateLabel,
  AccountStateStyle,
  AccountTypeLabel,
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
  const deleteUser = useDeleteUser();
  const resetPassword = useResetPassword();

  const handleDelete = () => {
    deleteUser.mutate(id, {
      onSuccess: () => {
        router.push("/users");
      },
    });
  };

  const handleResetPassword = () => {
    resetPassword.mutate(id);
  };

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
                label={AccountStateLabel[user.state]}
              />
            </div>
            <p className="text-muted-foreground">
              @{user.userId} · {AccountTypeLabel[user.type] || user.typeName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <KeyRound className="mr-2 h-4 w-4" />
                비밀번호 초기화
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>비밀번호를 초기화하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>
                  {user.name}({user.userId})의 비밀번호가 초기화됩니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction onClick={handleResetPassword}>
                  초기화
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button
            variant="outline"
            onClick={() => router.push(`/users/${id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            수정
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                삭제
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>사용자를 삭제하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>
                  이 작업은 되돌릴 수 없습니다. {user.name}({user.userId})
                  계정이 삭제됩니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  삭제
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
                icon={Phone}
                label="연락처"
                value={user.mobile}
              />
              <InfoItem
                icon={Phone}
                label="사무실 전화"
                value={user.officePhone}
              />
              <InfoItem icon={Mail} label="이메일" value={user.email} />
              <InfoItem
                icon={User}
                label="성별"
                value={user.gender === "M" ? "남성" : "여성"}
              />
              <InfoItem
                icon={Calendar}
                label="생년월일"
                value={user.birthDate}
              />
              <InfoItem
                icon={Building2}
                label="소속"
                value={user.companyName}
              />
            </CardContent>
          </Card>

          {/* 근무 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>근무 정보</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <InfoItem
                icon={Briefcase}
                label="부서"
                value={user.department}
              />
              <InfoItem
                icon={Briefcase}
                label="직위"
                value={user.position}
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
              <InfoItem
                icon={Building2}
                label="담당 건물"
                value={user.buildingCnt > 0 ? `${user.buildingCnt}개` : "-"}
              />
            </CardContent>
          </Card>

          {/* 비고 */}
          {user.note && (
            <Card>
              <CardHeader>
                <CardTitle>비고</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm">{user.note}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 우측 사이드바 */}
        <div className="space-y-6">
          {/* 역할 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                역할
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.roles && user.roles.length > 0 ? (
                <div className="space-y-2">
                  {user.roles.map((role) => (
                    <div
                      key={role.id}
                      className="flex items-center justify-between rounded-md border p-2"
                    >
                      <span className="text-sm font-medium">{role.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {role.code}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  할당된 역할이 없습니다.
                </p>
              )}
            </CardContent>
          </Card>

          {/* 이력 */}
          <Card>
            <CardHeader>
              <CardTitle>이력</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">등록</p>
                <p className="font-medium">{user.writerName}</p>
                <p className="text-xs text-muted-foreground">
                  {user.writeDate}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
