"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, User, Building2, Phone, Shield } from "lucide-react";

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
  useEditUser,
  useRegisterRoleList,
} from "@/lib/hooks/use-users";
import { checkUserId } from "@/lib/api/user";
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
  companyId: z.number().min(1, "소속회사를 선택해주세요"),
  department: z.string().optional(),
  position: z.string().optional(),
  type: z.string().optional(),
  mobile: z.string().min(1, "휴대폰 번호를 입력해주세요"),
  email: z.string().optional(),
  birthDate: z.string().optional(),
  gender: z.enum(["M", "F"]),
  hiredDate: z.string().optional(),
  retiredDate: z.string().optional(),
  state: z.string(),
  roleId: z.number().min(1, "역할을 선택해주세요"),
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

  const addUser = useAddUser();
  const editUser = useEditUser();
  const { data: roles } = useRegisterRoleList();

  const [userIdAvailable, setUserIdAvailable] = useState<boolean | null>(null);
  const [checkingUserId, setCheckingUserId] = useState(false);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      userId: "",
      name: "",
      companyId: 0,
      department: "",
      position: "",
      type: "",
      mobile: "",
      email: "",
      birthDate: "",
      gender: "M",
      hiredDate: "",
      retiredDate: "",
      state: AccountState.HIRED,
      roleId: 0,
      note: "",
    },
  });

  // 수정 모드일 때 초기값 설정
  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset({
        userId: initialData.userId || "",
        name: initialData.name || "",
        companyId: initialData.companyId || 0,
        department: initialData.department || "",
        position: initialData.position || "",
        type: initialData.type || "",
        mobile: initialData.mobile || "",
        email: "",
        birthDate: initialData.birthDate?.split("T")[0] || "",
        gender: (initialData.gender as "M" | "F") || "M",
        hiredDate: initialData.hiredDate?.split("T")[0] || "",
        retiredDate: initialData.retiredDate?.split("T")[0] || "",
        state: initialData.state || AccountState.HIRED,
        roleId: initialData.roleId || 0,
        note: initialData.note || "",
      });
    }
  }, [mode, initialData, form]);

  // 아이디 중복 확인
  const handleCheckUserId = useCallback(async () => {
    const currentUserId = form.getValues("userId");
    if (currentUserId.length < 4) {
      alert("아이디는 4자 이상 입력해주세요.");
      return;
    }

    setCheckingUserId(true);
    try {
      const isDuplicate = await checkUserId(currentUserId);
      setUserIdAvailable(!isDuplicate);
      if (isDuplicate) {
        alert("이미 사용중인 아이디입니다.");
      } else {
        alert("사용 가능한 아이디입니다.");
      }
    } catch {
      alert("중복 확인에 실패했습니다.");
    } finally {
      setCheckingUserId(false);
    }
  }, [form]);

  const onSubmit = (data: UserFormData) => {
    if (mode === "create" && userIdAvailable !== true) {
      alert("아이디 중복 확인을 해주세요.");
      return;
    }

    const payload: UserVO = {
      id: userId,
      userId: data.userId,
      name: data.name,
      companyId: data.companyId,
      department: data.department,
      position: data.position,
      type: data.type,
      mobile: data.mobile,
      email: data.email,
      birthDate: data.birthDate,
      gender: data.gender,
      hiredDate: data.hiredDate,
      retiredDate: data.retiredDate,
      state: data.state as AccountState,
      roleId: data.roleId,
      note: data.note,
    };

    if (mode === "create") {
      addUser.mutate(payload, {
        onSuccess: (result) => {
          router.push(`/users/${result.id}`);
        },
      });
    } else {
      editUser.mutate(payload, {
        onSuccess: () => {
          router.push(`/users/${userId}`);
        },
      });
    }
  };

  const isPending = addUser.isPending || editUser.isPending;

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
            {/* 기본 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  기본 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="userId">아이디 *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="userId"
                        placeholder="아이디를 입력하세요"
                        disabled={mode === "edit"}
                        {...form.register("userId")}
                        onChange={(e) => {
                          form.register("userId").onChange(e);
                          setUserIdAvailable(null);
                        }}
                      />
                      {mode === "create" && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleCheckUserId}
                          disabled={checkingUserId}
                          className="shrink-0"
                        >
                          중복 확인
                        </Button>
                      )}
                    </div>
                    {form.formState.errors.userId && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.userId.message}
                      </p>
                    )}
                    {userIdAvailable === true && (
                      <p className="text-sm text-green-600">
                        사용 가능한 아이디입니다.
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
                    <Label htmlFor="birthDate">생년월일</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      {...form.register("birthDate")}
                    />
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
                        {Object.entries(AccountStateLabel)
                          .filter(([key]) => key !== "DEL")
                          .map(([key, label]) => (
                            <SelectItem key={key} value={key}>
                              {label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
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
                    <Label htmlFor="mobile">휴대폰 *</Label>
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
                    <Label htmlFor="email">이메일</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="이메일"
                      {...form.register("email")}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 근무 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  근무 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="department">부서</Label>
                    <Input
                      id="department"
                      placeholder="부서명"
                      {...form.register("department")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">직책</Label>
                    <Input
                      id="position"
                      placeholder="직책"
                      {...form.register("position")}
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
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
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 우측 사이드바 */}
          <div className="space-y-6">
            {/* 역할/권한 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  역할/권한
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>소속회사 *</Label>
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
              </CardContent>
            </Card>

            {/* 비고 */}
            <Card>
              <CardHeader>
                <CardTitle>비고</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="비고를 입력하세요"
                  rows={4}
                  {...form.register("note")}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
