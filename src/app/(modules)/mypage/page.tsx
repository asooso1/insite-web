"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

import { useMyInfo, useChangePassword } from "@/lib/hooks/use-mypage";
import type { PasswordChangeVO } from "@/lib/types/mypage";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// ============================================================================
// 비밀번호 변경 스키마
// ============================================================================

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "현재 비밀번호를 입력해주세요"),
    newPassword: z
      .string()
      .min(8, "새 비밀번호는 8자 이상이어야 합니다"),
    confirmPassword: z
      .string()
      .min(1, "비밀번호 확인을 입력해주세요"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "새 비밀번호와 확인이 일치하지 않습니다",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

// ============================================================================
// 메인 페이지
// ============================================================================

export default function MypagePage() {
  const router = useRouter();
  const { data: myInfo, isLoading } = useMyInfo();
  const changePassword = useChangePassword();
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onPasswordSubmit = async (data: PasswordFormData) => {
    const vo: PasswordChangeVO = {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    };

    changePassword.mutate(vo, {
      onSuccess: () => {
        setPasswordSuccess(true);
        passwordForm.reset();
        setTimeout(() => setPasswordSuccess(false), 3000);
      },
    });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-96">로딩 중...</div>;
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold">마이페이지</h1>
        <p className="text-muted-foreground mt-2">내 정보를 확인하고 관리합니다</p>
      </div>

      {/* 내 정보 카드 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>내 정보</CardTitle>
            <CardDescription>기본 정보를 확인합니다</CardDescription>
          </div>
          <Button onClick={() => router.push("/mypage/edit")}>수정</Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 좌측 */}
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">이름</p>
                <p className="text-lg font-semibold">{myInfo?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">회사명</p>
                <p className="text-lg">{myInfo?.companyName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">부서</p>
                <p className="text-lg">{myInfo?.department || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">직책</p>
                <p className="text-lg">{myInfo?.position || "-"}</p>
              </div>
            </div>

            {/* 우측 */}
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">사용자 ID</p>
                <p className="text-lg">{myInfo?.userId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">직무 유형</p>
                <p className="text-lg">{myInfo?.type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">고용 형태</p>
                <p className="text-lg">{myInfo?.workerType}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 연락처 카드 */}
      <Card>
        <CardHeader>
          <CardTitle>연락처</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">사무실 전화</p>
              <p className="text-lg">{myInfo?.officePhone || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">휴대폰</p>
              <p className="text-lg">{myInfo?.mobile}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-muted-foreground">이메일</p>
              <p className="text-lg">{myInfo?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 주소 카드 */}
      <Card>
        <CardHeader>
          <CardTitle>주소</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myInfo?.zipCode && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">우편번호</p>
                <p className="text-lg">{myInfo.zipCode}</p>
              </div>
            )}
            {myInfo?.address && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">주소</p>
                <p className="text-lg">{myInfo.address}</p>
              </div>
            )}
            {myInfo?.addressDetail && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">상세주소</p>
                <p className="text-lg">{myInfo.addressDetail}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 개인 정보 카드 */}
      <Card>
        <CardHeader>
          <CardTitle>개인 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">생년월일</p>
              <p className="text-lg">{myInfo?.birthDate || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">성별</p>
              <p className="text-lg">
                {myInfo?.gender === "M"
                  ? "남"
                  : myInfo?.gender === "F"
                    ? "여"
                    : "-"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 보안 - 비밀번호 변경 */}
      <Card>
        <CardHeader>
          <CardTitle>보안</CardTitle>
          <CardDescription>계정 보안 설정</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="password">
              <AccordionTrigger>비밀번호 변경</AccordionTrigger>
              <AccordionContent className="pt-4">
                {passwordSuccess && (
                  <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
                    비밀번호가 변경되었습니다.
                  </div>
                )}

                <Form {...passwordForm}>
                  <form
                    onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>현재 비밀번호</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="현재 비밀번호"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>새 비밀번호</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="새 비밀번호 (8자 이상)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>비밀번호 확인</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="비밀번호 확인"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={changePassword.isPending}
                      className="w-full"
                    >
                      {changePassword.isPending ? "변경 중..." : "비밀번호 변경"}
                    </Button>
                  </form>
                </Form>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
