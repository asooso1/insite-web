"use client";

import { useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, User, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { useAuthStore } from "@/lib/stores/auth-store";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";

/**
 * 로그인 폼 컴포넌트
 */
export function LoginForm(): ReactNode {
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userId: "",
      passwd: "",
    },
  });

  async function onSubmit(data: LoginFormData): Promise<void> {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "로그인에 실패했습니다.");
      }

      const result = await response.json();

      // 인증 상태 저장
      setAuth(result.accessToken, result.user);

      toast.success("로그인되었습니다.");

      // 리다이렉트 처리 (전체 페이지 리로드로 미들웨어 재실행)
      const redirectUrl = searchParams.get("redirect") || "/";
      window.location.href = redirectUrl;
    } catch (error) {
      const message = error instanceof Error ? error.message : "로그인에 실패했습니다.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    {...field}
                    type="text"
                    placeholder="아이디를 입력해 주세요."
                    className="h-12 pl-10"
                    disabled={isLoading}
                    autoComplete="username"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="passwd"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    {...field}
                    type="password"
                    placeholder="비밀번호를 입력해 주세요."
                    className="h-12 pl-10"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="h-12 w-full text-base font-semibold"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              로그인 중...
            </>
          ) : (
            "LOGIN"
          )}
        </Button>
      </form>
    </Form>
  );
}
