import type { ReactElement, ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * 테스트용 QueryClient
 */
function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * 테스트용 프로바이더 래퍼
 */
function TestProviders({ children }: { children: ReactNode }): ReactNode {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

/**
 * 커스텀 render 함수
 * - React Query Provider 포함
 */
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
): ReturnType<typeof render> {
  return render(ui, { wrapper: TestProviders, ...options });
}

// re-export
export * from "@testing-library/react";
export { customRender as render };
