"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, Building2, Phone, MapPin } from "lucide-react";

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

import { useAddClient, useEditClient } from "@/lib/hooks/use-clients";
import { checkBusinessNo } from "@/lib/api/company";
import {
  CompanyState,
  CompanyStateLabel,
  type CompanyDTO,
  type ClientAddVO,
  type ClientEditVO,
} from "@/lib/types/client";

// ============================================================================
// 폼 스키마
// ============================================================================

const clientSchema = z.object({
  businessNo: z.string().min(1, "사업자번호를 입력해주세요"),
  name: z.string().min(1, "회사명을 입력해주세요"),
  phone: z.string().min(1, "대표 전화를 입력해주세요"),
  fax: z.string().optional(),
  officerName: z.string().min(1, "담당자명을 입력해주세요"),
  officerPhone: z.string().min(1, "담당자 전화를 입력해주세요"),
  officerMobile: z.string().optional(),
  officerEmail: z.string().optional(),
  state: z.string(),
  note: z.string().optional(),
  zipCode: z.string().min(1, "우편번호를 입력해주세요"),
  address: z.string().min(1, "주소를 입력해주세요"),
  addressRoad: z.string().optional(),
  addressDetail: z.string().min(1, "상세주소를 입력해주세요"),
});

type ClientFormData = z.infer<typeof clientSchema>;

// ============================================================================
// Props
// ============================================================================

interface ClientFormProps {
  mode: "create" | "edit";
  initialData?: CompanyDTO;
  clientId?: number;
}

// ============================================================================
// 메인 폼 컴포넌트
// ============================================================================

export function ClientForm({ mode, initialData, clientId }: ClientFormProps) {
  const router = useRouter();

  const addClient = useAddClient();
  const editClient = useEditClient();

  const [businessNoAvailable, setBusinessNoAvailable] = useState<boolean | null>(null);
  const [checkingBusinessNo, setCheckingBusinessNo] = useState(false);

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      businessNo: "",
      name: "",
      phone: "",
      fax: "",
      officerName: "",
      officerPhone: "",
      officerMobile: "",
      officerEmail: "",
      state: CompanyState.USE,
      note: "",
      zipCode: "",
      address: "",
      addressRoad: "",
      addressDetail: "",
    },
  });

  // 수정 모드일 때 초기값 설정
  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset({
        businessNo: initialData.businessNo || "",
        name: initialData.name || "",
        phone: initialData.phone || "",
        fax: initialData.fax || "",
        officerName: initialData.officerName || "",
        officerPhone: initialData.officerPhone || "",
        officerMobile: initialData.officerMobile || "",
        officerEmail: initialData.officerEmail || "",
        state: initialData.state || CompanyState.USE,
        note: initialData.note || "",
        zipCode: initialData.zipCode || "",
        address: initialData.address || "",
        addressRoad: initialData.addressRoad || "",
        addressDetail: initialData.addressDetail || "",
      });
    }
  }, [mode, initialData, form]);

  // 사업자번호 중복 확인
  const handleCheckBusinessNo = useCallback(async () => {
    const currentBusinessNo = form.getValues("businessNo");
    if (!currentBusinessNo.trim()) {
      alert("사업자번호를 입력해주세요.");
      return;
    }

    setCheckingBusinessNo(true);
    try {
      const isDuplicate = await checkBusinessNo(currentBusinessNo);
      setBusinessNoAvailable(!isDuplicate);
      if (isDuplicate) {
        alert("이미 등록된 사업자번호입니다.");
      } else {
        alert("사용 가능한 사업자번호입니다.");
      }
    } catch {
      alert("중복 확인에 실패했습니다.");
    } finally {
      setCheckingBusinessNo(false);
    }
  }, [form]);

  const onSubmit = (data: ClientFormData) => {
    if (mode === "create" && businessNoAvailable !== true) {
      alert("사업자번호 중복 확인을 해주세요.");
      return;
    }

    if (mode === "create") {
      const payload: ClientAddVO = {
        businessNo: data.businessNo,
        name: data.name,
        phone: data.phone,
        fax: data.fax,
        officerName: data.officerName,
        officerPhone: data.officerPhone,
        officerMobile: data.officerMobile,
        officerEmail: data.officerEmail,
        state: data.state as CompanyState,
        note: data.note,
        zipCode: data.zipCode,
        address: data.address,
        addressRoad: data.addressRoad,
        addressDetail: data.addressDetail,
      };
      addClient.mutate(payload, {
        onSuccess: (result) => {
          router.push(`/clients/${result.id}`);
        },
      });
    } else {
      const payload: ClientEditVO = {
        id: clientId!,
        name: data.name,
        phone: data.phone,
        fax: data.fax,
        officerName: data.officerName,
        officerPhone: data.officerPhone,
        officerMobile: data.officerMobile,
        officerEmail: data.officerEmail,
        state: data.state as CompanyState,
        note: data.note,
        zipCode: data.zipCode,
        address: data.address,
        addressRoad: data.addressRoad,
        addressDetail: data.addressDetail,
      };
      editClient.mutate(payload, {
        onSuccess: () => {
          router.push(`/clients/${clientId}`);
        },
      });
    }
  };

  const isPending = addClient.isPending || editClient.isPending;

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
              {mode === "create" ? "새 고객사 등록" : "고객사 수정"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "create"
                ? "새로운 고객사를 등록합니다."
                : "고객사 정보를 수정합니다."}
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
                  <Building2 className="h-4 w-4" />
                  기본 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="businessNo">사업자번호 *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="businessNo"
                        placeholder="000-00-00000"
                        disabled={mode === "edit"}
                        {...form.register("businessNo")}
                        onChange={(e) => {
                          form.register("businessNo").onChange(e);
                          setBusinessNoAvailable(null);
                        }}
                      />
                      {mode === "create" && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleCheckBusinessNo}
                          disabled={checkingBusinessNo}
                          className="shrink-0"
                        >
                          중복 확인
                        </Button>
                      )}
                    </div>
                    {form.formState.errors.businessNo && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.businessNo.message}
                      </p>
                    )}
                    {businessNoAvailable === true && (
                      <p className="text-sm text-green-600">
                        사용 가능한 사업자번호입니다.
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">회사명 *</Label>
                    <Input
                      id="name"
                      placeholder="회사명을 입력하세요"
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
                    <Label htmlFor="phone">대표 전화 *</Label>
                    <Input
                      id="phone"
                      placeholder="02-0000-0000"
                      {...form.register("phone")}
                    />
                    {form.formState.errors.phone && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fax">FAX</Label>
                    <Input
                      id="fax"
                      placeholder="02-0000-0000"
                      {...form.register("fax")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">상태 *</Label>
                  <Select
                    value={form.watch("state")}
                    onValueChange={(value) => form.setValue("state", value)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="상태 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CompanyStateLabel)
                        .filter(([key]) => key !== "DEL")
                        .map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* 주소 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  주소
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">우편번호 *</Label>
                    <Input
                      id="zipCode"
                      placeholder="우편번호"
                      {...form.register("zipCode")}
                    />
                    {form.formState.errors.zipCode && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.zipCode.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">지번주소 *</Label>
                  <Input
                    id="address"
                    placeholder="지번주소"
                    {...form.register("address")}
                  />
                  {form.formState.errors.address && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.address.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressRoad">도로명주소</Label>
                  <Input
                    id="addressRoad"
                    placeholder="도로명주소"
                    {...form.register("addressRoad")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressDetail">상세주소 *</Label>
                  <Input
                    id="addressDetail"
                    placeholder="상세주소"
                    {...form.register("addressDetail")}
                  />
                  {form.formState.errors.addressDetail && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.addressDetail.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 우측 사이드바 */}
          <div className="space-y-6">
            {/* 담당자 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  담당자 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="officerName">담당자명 *</Label>
                  <Input
                    id="officerName"
                    placeholder="담당자명"
                    {...form.register("officerName")}
                  />
                  {form.formState.errors.officerName && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.officerName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="officerPhone">담당자 전화 *</Label>
                  <Input
                    id="officerPhone"
                    placeholder="02-0000-0000"
                    {...form.register("officerPhone")}
                  />
                  {form.formState.errors.officerPhone && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.officerPhone.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="officerMobile">담당자 휴대폰</Label>
                  <Input
                    id="officerMobile"
                    placeholder="010-0000-0000"
                    {...form.register("officerMobile")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="officerEmail">담당자 이메일</Label>
                  <Input
                    id="officerEmail"
                    type="email"
                    placeholder="이메일"
                    {...form.register("officerEmail")}
                  />
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
