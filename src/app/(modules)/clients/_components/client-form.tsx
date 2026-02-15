"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Save,
  Building2,
  Phone,
  MapPin,
  FileText,
  Upload,
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
  useAddClient,
  useUpdateClient,
  useCheckBusinessNo,
} from "@/lib/hooks/use-clients";
import {
  CompanyState,
  CompanyStateLabel,
  type ClientViewDTO,
  type ClientVO,
} from "@/lib/types/client";

// ============================================================================
// 폼 스키마
// ============================================================================

const clientSchema = z.object({
  businessNo: z.string().min(10, "사업자번호를 입력해주세요 (10자리)"),
  name: z.string().min(1, "회사명을 입력해주세요"),
  phone: z.string().min(1, "대표연락처를 입력해주세요"),
  fax: z.string().optional(),
  officerName: z.string().min(1, "담당자명을 입력해주세요"),
  officerPhone: z.string().min(1, "담당자 연락처를 입력해주세요"),
  officerMobile: z.string().optional(),
  officerEmail: z.string().email("올바른 이메일을 입력해주세요").optional().or(z.literal("")),
  state: z.string().min(1, "상태를 선택해주세요"),
  note: z.string().optional(),
  zipCode: z.string().min(1, "우편번호를 입력해주세요"),
  address: z.string().min(1, "주소를 입력해주세요"),
  addressRoad: z.string().optional(),
  addressDetail: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

// ============================================================================
// Props
// ============================================================================

interface ClientFormProps {
  mode: "create" | "edit";
  initialData?: ClientViewDTO;
  clientId?: number;
}

// ============================================================================
// 메인 폼 컴포넌트
// ============================================================================

export function ClientForm({ mode, initialData, clientId }: ClientFormProps) {
  const router = useRouter();
  const [businessNoInput, setBusinessNoInput] = useState("");
  const [logoFiles, setLogoFiles] = useState<File[]>([]);

  const addClient = useAddClient();
  const updateClient = useUpdateClient();
  const { data: isBusinessNoTaken, isLoading: isCheckingBusinessNo } =
    useCheckBusinessNo(mode === "create" ? businessNoInput : "");

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
        state: initialData.state,
        note: initialData.note || "",
        zipCode: initialData.zipCode || "",
        address: initialData.address || "",
        addressRoad: initialData.addressRoad || "",
        addressDetail: initialData.addressDetail || "",
      });
    }
  }, [mode, initialData, form]);

  // 사업자번호 입력 디바운스
  useEffect(() => {
    const value = form.watch("businessNo");
    const timer = setTimeout(() => {
      if (mode === "create" && value.length >= 10) {
        setBusinessNoInput(value);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [form.watch("businessNo"), mode, form]);

  const onSubmit = (data: ClientFormData) => {
    const payload: ClientVO = {
      id: clientId,
      businessNo: data.businessNo,
      name: data.name,
      phone: data.phone,
      fax: data.fax || undefined,
      officerName: data.officerName,
      officerPhone: data.officerPhone,
      officerMobile: data.officerMobile || undefined,
      officerEmail: data.officerEmail || undefined,
      state: data.state as CompanyState,
      note: data.note || undefined,
      zipCode: data.zipCode,
      address: data.address,
      addressRoad: data.addressRoad || data.address,
      addressDetail: data.addressDetail || "",
      files: logoFiles.length > 0 ? logoFiles : undefined,
    };

    if (mode === "create") {
      addClient.mutate(payload, {
        onSuccess: () => {
          router.push("/clients");
        },
      });
    } else {
      updateClient.mutate(payload, {
        onSuccess: () => {
          router.push(`/clients/${clientId}`);
        },
      });
    }
  };

  const isPending = addClient.isPending || updateClient.isPending;

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
              {mode === "create" ? "새 클라이언트 등록" : "클라이언트 수정"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "create"
                ? "새로운 클라이언트를 등록합니다."
                : "클라이언트 정보를 수정합니다."}
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
            {/* 회사 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  회사 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
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
                  <div className="space-y-2">
                    <Label htmlFor="businessNo">사업자번호 *</Label>
                    <div className="relative">
                      <Input
                        id="businessNo"
                        placeholder="000-00-00000"
                        disabled={mode === "edit"}
                        {...form.register("businessNo")}
                      />
                      {mode === "create" && businessNoInput.length >= 10 && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {isCheckingBusinessNo ? (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          ) : isBusinessNoTaken ? (
                            <XCircle className="h-4 w-4 text-destructive" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {form.formState.errors.businessNo && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.businessNo.message}
                      </p>
                    )}
                    {mode === "create" &&
                      businessNoInput.length >= 10 &&
                      !isCheckingBusinessNo &&
                      isBusinessNoTaken && (
                        <p className="text-sm text-destructive">
                          이미 등록된 사업자번호입니다.
                        </p>
                      )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">대표연락처 *</Label>
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
                    <Label htmlFor="fax">팩스</Label>
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
                      {Object.entries(CompanyStateLabel).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* 담당자 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  담당자 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
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
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="officerMobile">담당자 휴대전화</Label>
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
                      placeholder="example@company.com"
                      {...form.register("officerEmail")}
                    />
                    {form.formState.errors.officerEmail && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.officerEmail.message}
                      </p>
                    )}
                  </div>
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
            {/* 주소 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  주소
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                <div className="space-y-2">
                  <Label htmlFor="address">주소 *</Label>
                  <Input
                    id="address"
                    placeholder="주소"
                    {...form.register("address")}
                  />
                  {form.formState.errors.address && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.address.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressDetail">상세주소</Label>
                  <Input
                    id="addressDetail"
                    placeholder="상세주소"
                    {...form.register("addressDetail")}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 로고 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  로고
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mode === "edit" && initialData?.companyLogoDTO && (
                    <div className="flex items-center justify-center rounded-md border p-4">
                      <img
                        src={initialData.companyLogoDTO.fileUrl}
                        alt="현재 로고"
                        className="max-h-20 object-contain"
                      />
                    </div>
                  )}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files) {
                          setLogoFiles(Array.from(files));
                        }
                      }}
                      className="text-sm"
                    />
                    {logoFiles.length > 0 && logoFiles[0] && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {logoFiles[0].name}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
