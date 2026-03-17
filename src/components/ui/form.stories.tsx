import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "./form";
import { Input } from "./input";
import { Textarea } from "./textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { toast } from "sonner";

const meta = {
  title: "Components/UI/Form",
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

// 기본 폼 스키마
const BasicFormSchema = z.object({
  facilityName: z.string().min(1, "시설명을 입력해주세요"),
  location: z.string().min(1, "위치를 선택해주세요"),
  description: z.string().optional(),
});

type BasicFormValues = z.infer<typeof BasicFormSchema>;

export const BasicForm: StoryObj = {
  render: function Render() {
    const form = useForm<BasicFormValues>({
      resolver: zodResolver(BasicFormSchema),
      defaultValues: {
        facilityName: "",
        location: "",
        description: "",
      },
    });

    function onSubmit(data: BasicFormValues) {
      toast.success("저장되었습니다.");
      console.log(data);
    }

    return (
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <FormField
          control={form.control}
          name="facilityName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>시설명</FormLabel>
              <FormControl>
                <Input placeholder="시설명을 입력하세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>위치</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="위치를 선택하세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="roof">옥상</SelectItem>
                  <SelectItem value="basement">지하</SelectItem>
                  <SelectItem value="lobby">로비</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>설명</FormLabel>
              <FormControl>
                <Textarea placeholder="추가 정보를 입력하세요" {...field} />
              </FormControl>
              <FormDescription>최대 200자까지 입력 가능합니다</FormDescription>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline">
            취소
          </Button>
          <Button type="submit">저장</Button>
        </div>
      </form>
    );
  },
};

// 유효성 검사 예제
const ValidationFormSchema = z.object({
  email: z.string().email("올바른 이메일 형식이 아닙니다"),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다"),
  confirmPassword: z.string(),
  ageConfirm: z.boolean().refine((val) => val === true, {
    message: "18세 이상임을 확인해주세요",
  }),
});

type ValidationFormValues = z.infer<typeof ValidationFormSchema>;

export const WithValidation: StoryObj = {
  render: function Render() {
    const form = useForm<ValidationFormValues>({
      resolver: zodResolver(ValidationFormSchema),
      defaultValues: {
        email: "",
        password: "",
        confirmPassword: "",
        ageConfirm: false,
      },
    });

    function onSubmit(data: ValidationFormValues) {
      toast.success("회원가입이 완료되었습니다.");
      console.log(data);
    }

    return (
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                />
              </FormControl>
              <FormDescription>최소 8자 이상</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호 확인</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ageConfirm"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>18세 이상입니다</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          가입하기
        </Button>
      </form>
    );
  },
};

// 로그인 폼
const LoginFormSchema = z.object({
  username: z.string().min(1, "사용자명을 입력해주세요"),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

type LoginFormValues = z.infer<typeof LoginFormSchema>;

export const LoginForm: StoryObj = {
  render: function Render() {
    const form = useForm<LoginFormValues>({
      resolver: zodResolver(LoginFormSchema),
      defaultValues: {
        username: "",
        password: "",
      },
    });

    const isSubmitting = form.formState.isSubmitting;

    function onSubmit(data: LoginFormValues) {
      toast.success("로그인되었습니다.");
      console.log(data);
    }

    return (
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-sm">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>사용자명</FormLabel>
              <FormControl>
                <Input
                  placeholder="사용자명 또는 이메일"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "로그인 중..." : "로그인"}
        </Button>
      </form>
    );
  },
};

// 검색 폼
const SearchFormSchema = z.object({
  keyword: z.string().optional(),
  facilityType: z.string().optional(),
  status: z.string().optional(),
});

type SearchFormValues = z.infer<typeof SearchFormSchema>;

export const SearchForm: StoryObj = {
  render: function Render() {
    const form = useForm<SearchFormValues>({
      resolver: zodResolver(SearchFormSchema),
      defaultValues: {
        keyword: "",
        facilityType: "",
        status: "",
      },
    });

    function onSubmit(data: SearchFormValues) {
      toast.success("검색되었습니다.");
      console.log(data);
    }

    return (
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="keyword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>검색어</FormLabel>
                <FormControl>
                  <Input
                    placeholder="시설명이나 설명 검색"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="facilityType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>시설 유형</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="모든 유형" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">모든 유형</SelectItem>
                    <SelectItem value="hvac">공조</SelectItem>
                    <SelectItem value="elevator">승강기</SelectItem>
                    <SelectItem value="electrical">전기</SelectItem>
                    <SelectItem value="plumbing">배관</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>상태</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="모든 상태" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">모든 상태</SelectItem>
                    <SelectItem value="operating">운영 중</SelectItem>
                    <SelectItem value="maintenance">유지보수 중</SelectItem>
                    <SelectItem value="idle">유휴</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
          >
            초기화
          </Button>
          <Button type="submit">검색</Button>
        </div>
      </form>
    );
  },
};
