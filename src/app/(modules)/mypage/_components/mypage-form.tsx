"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useUpdateMyInfo, useMyInfo } from "@/lib/hooks/use-mypage";
import type { MyInfoVO } from "@/lib/types/mypage";

// ============================================================================
// 폼 스키마
// ============================================================================

const mypageSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  department: z.string().optional(),
  position: z.string().optional(),
  officePhone: z.string().optional(),
  mobile: z.string().min(1, "휴대폰 번호를 입력해주세요"),
  email: z.string().email("유효한 이메일을 입력해주세요").optional().or(z.literal("")),
  zipCode: z.string().optional(),
  address: z.string().optional(),
  addressDetail: z.string().optional(),
  birthDate: z.string().optional(),
});

type MypageFormData = z.infer<typeof mypageSchema>;

// ============================================================================
// 메인 폼 컴포넌트
// ============================================================================

export function MypageForm() {
  const router = useRouter();
  const { data: initialData, isLoading } = useMyInfo();
  const updateMyInfo = useUpdateMyInfo();

  const form = useForm<MypageFormData>({
    resolver: zodResolver(mypageSchema),
    defaultValues: {
      name: "",
      department: "",
      position: "",
      officePhone: "",
      mobile: "",
      email: "",
      zipCode: "",
      address: "",
      addressDetail: "",
      birthDate: "",
    },
  });

  // 초기값 설정
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData?.name ?? "",
        department: initialData?.department ?? "",
        position: initialData?.position ?? "",
        officePhone: initialData?.officePhone ?? "",
        mobile: initialData?.mobile ?? "",
        email: initialData?.email ?? "",
        zipCode: initialData?.zipCode ?? "",
        address: initialData?.address ?? "",
        addressDetail: initialData?.addressDetail ?? "",
        birthDate: initialData?.birthDate ?? "",
      });
    }
  }, [initialData, form]);

  const onSubmit = async (data: MypageFormData) => {
    const vo: MyInfoVO = {
      name: data.name,
      department: data.department,
      position: data.position,
      officePhone: data.officePhone,
      mobile: data.mobile,
      email: data.email && data.email !== "" ? data.email : "",
      zipCode: data.zipCode,
      address: data.address,
      addressDetail: data.addressDetail,
      birthDate: data.birthDate,
    };

    updateMyInfo.mutate(vo, {
      onSuccess: () => {
        router.push("/mypage");
      },
    });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-96">로딩 중...</div>;
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-10 w-10"
        >
          <ArrowLeft aria-hidden="true" className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">내 정보 수정</h1>
      </div>

      {/* 폼 */}
      <Card>
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* 이름 */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이름</FormLabel>
                    <FormControl>
                      <Input placeholder="이름" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 부서 & 직책 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>부서</FormLabel>
                      <FormControl>
                        <Input placeholder="부서명" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>직책</FormLabel>
                      <FormControl>
                        <Input placeholder="직책" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 연락처 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="officePhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>사무실 전화</FormLabel>
                      <FormControl>
                        <Input placeholder="사무실 전화" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>휴대폰</FormLabel>
                      <FormControl>
                        <Input placeholder="휴대폰 번호" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 이메일 */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="이메일" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 주소 */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>우편번호</FormLabel>
                        <FormControl>
                          <Input placeholder="우편번호" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>주소</FormLabel>
                      <FormControl>
                        <Input placeholder="주소" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="addressDetail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>상세주소</FormLabel>
                      <FormControl>
                        <Input placeholder="상세주소" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 생년월일 */}
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>생년월일</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 버튼 */}
              <div className="flex gap-2 justify-end pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={updateMyInfo.isPending}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  {updateMyInfo.isPending ? "저장 중..." : "저장"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
