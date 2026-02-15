"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Save,
  User,
  Briefcase,
  Calendar,
  Phone,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useAddUser,
  useUpdateUser,
  useCheckUserId,
  useRoleList,
} from "@/lib/hooks/use-users";
import {
  AccountState,
  AccountStateLabel,
  type AccountDTO,
  type UserVO,
} from "@/lib/types/user";

// ============================================================================
// 폼 스키마
// ============================================================================

const userSchema = z.object({
  userId: z.string().min(4, "아이디는 4자 이상 입력해주세요"),
  name: z.string().min(1, "이름을 입력해주세요"),
  companyId: z.number().min(1, "소속을 선택해주세요"),
  mobile: z.string().min(1, "연락처를 입력해주세요"),
  birthDate: z.string().min(1, "생년월일을 입력해주세요"),
  gender: z.enum(["M", "F"]),
  state: z.string().min(1, "상태를 선택해주세요"),
  roleId: z.number().min(1, "역할을 선택해주세요"),
  hiredDate: z.string().optional(),
  retiredDate: z.string().optional(),
  department: z.string().optional(),
  officePhone: z.string().optional(),
  email: z.string().email("올바른 이메일을 입력해주세요").optional().or(z.literal("")),
  zipCode: z.string().optional(),
  address: z.string().optional(),
  addressDetail: z.string().optional(),
  note: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

// ============================================================================
// Props
// ============================================================================

interface UserFormProps {
  mode: "create" | "edit";
  initialData?: AccountDTO;
  userId?: number;
}

// ============================================================================
// 메인 폼 컴포넌트
// ============================================================================

export function UserForm({ mode, initialData, userId }: UserFormProps) {
  const router = useRouter();
  const [userIdInput, setUserIdInput] = useState("");

  const addUser = useAddUser();
  const updateUser = useUpdateUser();
  const { data: roles } = useRoleList();
  const { data: isUserIdTaken, isLoading: isCheckingUserId } =
    useCheckUserId(mode === "create" ? userIdInput : "");

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      userId: "",
      name: "",
      companyId: 0,
      mobile: "",
      birthDate: "",
      gender: "M",
      state: AccountState.HIRED,
      roleId: 0,
      hiredDate: "",
      retiredDate: "",
      department: "",
      officePhone: "",
      email: "",
      zipCode: "",
      address: "",
      addressDetail: "",
      note: "",
    },
  });

  // 수정 모드일 때 초기값 설정
  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset({
        userId: initialData.userId,
        name: initialData.name,
        companyId: initialData.companyId,
        mobile: initialData.mobile || "",
        birthDate: initialData.birthDate || "",
        gender: initialData.gender,
        state: initialData.state,
        roleId: initialData.roles?.[0]?.id || 0,
        hiredDate: initialData.hiredDate || "",
        retiredDate: initialData.retiredDate || "",
        department: initialData.department || "",
        officePhone: initialData.officePhone || "",
        email: initialData.email || "",
        note: initialData.note || "",
      });
    }
  }, [mode, initialData, form]);

  // 아이디 입력 디바운스
  useEffect(() => {
    const value = form.watch("userId");
    const timer = setTimeout(() => {
      if (mode === "create" && value.length >= 4) {
        setUserIdInput(value);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [form.watch("userId"), mode, form]);

  const onSubmit = (data: UserFormData) => {
    const payload: UserVO = {
      id: userId,
      userId: data.userId,
      name: data.name,
      companyId: data.companyId,
      mobile: data.mobile,
      birthDate: data.birthDate,
      gender: data.gender,
      state: data.state as AccountState,
      roleId: data.roleId,
      hiredDate: data.hiredDate || undefined,
      retiredDate: data.retiredDate || undefined,
      department: data.department || undefined,
      officePhone: data.officePhone || undefined,
      email: data.email || undefined,
      zipCode: data.zipCode || undefined,
      address: data.address || undefined,
      addressDetail: data.addressDetail || undefined,
      note: data.note || undefined,
    };

    if (mode === "create") {
      addUser.mutate(payload, {
        onSuccess: () => {
          router.push("/users");
        },
      });
    } else {
      updateUser.mutate(payload, {
        onSuccess: () => {
          router.push(`/users/${userId}`);
        },
      });
    }
  };

  const isPending = addUser.isPending || updateUser.isPending;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {mode === "create" ? "새 사용자 등록" : "사용자 수정"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "create"
                ? "새로운 사용자를 등록합니다."
                : "사용자 정보를 수정합니다."}
            </p>
          </div>
        </div>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
          <Save className="mr-2 h-4 w-4" />
          저장
        </Button>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          {/* 좌측 메인 폼 */}
          <div className="md:col-span-2 space-y-6">
            {/* 계정 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  계정 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="userId">아이디 *</Label>
                    <div className="relative">
                      <Input
                        id="userId"
                        placeholder="아이디를 입력하세요"
                        disabled={mode === "edit"}
                        {...form.register("userId")}
                      />
                      {mode === "create" && userIdInput.length >= 4 && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {isCheckingUserId ? (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          ) : isUserIdTaken ? (
                            <XCircle className="h-4 w-4 text-destructive" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {form.formState.errors.userId && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.userId.message}
                      </p>
                    )}
                    {mode === "create" &&
                      userIdInput.length >= 4 &&
                      !isCheckingUserId &&
                      isUserIdTaken && (
                        <p className="text-sm text-destructive">
                          이미 사용중인 아이디입니다.
                        </p>
                      )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">이름 *</Label>
                    <Input
                      id="name"
                      placeholder="이름을 입력하세요"
                      {...form.register("name")}
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="gender">성별 *</Label>
                    <Select
                      value={form.watch("gender")}
                      onValueChange={(value) =>
                        form.setValue("gender", value as "M" | "F")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="성별 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">남성</SelectItem>
                        <SelectItem value="F">여성</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">생년월일 *</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      {...form.register("birthDate")}
                    />
                    {form.formState.errors.birthDate && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.birthDate.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="state">상태 *</Label>
                    <Select
                      value={form.watch("state")}
                      onValueChange={(value) => form.setValue("state", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="상태 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(AccountStateLabel).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>역할 *</Label>
                    <Select
                      value={String(form.watch("roleId") || "")}
                      onValueChange={(value) =>
                        form.setValue("roleId", Number(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="역할 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles?.map((role) => (
                          <SelectItem key={role.id} value={String(role.id)}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.roleId && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.roleId.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 연락처 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  연락처
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="mobile">휴대전화 *</Label>
                    <Input
                      id="mobile"
                      placeholder="010-0000-0000"
                      {...form.register("mobile")}
                    />
                    {form.formState.errors.mobile && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.mobile.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="officePhone">사무실 전화</Label>
                    <Input
                      id="officePhone"
                      placeholder="02-0000-0000"
                      {...form.register("officePhone")}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@company.com"
                    {...form.register("email")}
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 비고 */}
            <Card>
              <CardHeader>
                <CardTitle>비고</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="비고 사항을 입력하세요"
                  rows={4}
                  {...form.register("note")}
                />
              </CardContent>
            </Card>
          </div>

          {/* 우측 사이드바 */}
          <div className="space-y-6">
            {/* 소속 */}
            <Card>
              <CardHeader>
                <CardTitle>소속</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>회사 *</Label>
                  <Select
                    value={String(form.watch("companyId") || "")}
                    onValueChange={(value) =>
                      form.setValue("companyId", Number(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="회사 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* TODO: 회사 목록 API 연동 */}
                      <SelectItem value="1">HDC Labs</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.companyId && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.companyId.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">부서</Label>
                  <Input
                    id="department"
                    placeholder="부서명"
                    {...form.register("department")}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 근무 일정 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  근무 일정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hiredDate">입사일</Label>
                  <Input
                    id="hiredDate"
                    type="date"
                    {...form.register("hiredDate")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retiredDate">퇴사일</Label>
                  <Input
                    id="retiredDate"
                    type="date"
                    {...form.register("retiredDate")}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
