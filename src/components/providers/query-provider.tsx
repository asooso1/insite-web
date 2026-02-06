"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

/**
 * React Query 프로바이더
 * - 서버 상태 관리
 * - 캐싱 전략 설정
 */
export function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 5분 동안 데이터를 fresh로 유지
            staleTime: 1000 * 60 * 5,
            // 30분 동안 캐시 유지
            gcTime: 1000 * 60 * 30,
            // 3회 재시도 (5xx 에러 시)
            retry: (failureCount, error) => {
              // 4xx 에러는 재시도하지 않음
              if (error instanceof Error && "status" in error) {
                const status = (error as { status: number }).status;
                if (status >= 400 && status < 500) {
                  return false;
                }
              }
              return failureCount < 3;
            },
            // 창 포커스 시 자동 refetch 비활성화
            refetchOnWindowFocus: false,
          },
          mutations: {
            // 뮤테이션 재시도 비활성화
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
