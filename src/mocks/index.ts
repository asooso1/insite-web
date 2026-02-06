/**
 * MSW 초기화
 * - 개발 환경에서만 활성화
 */
export async function initMocks(): Promise<void> {
  if (typeof window === "undefined") {
    // 서버 사이드에서는 MSW 사용 안함
    return;
  }

  if (process.env.NODE_ENV === "development") {
    const { worker } = await import("./browser");
    await worker.start({
      onUnhandledRequest: "bypass",
    });
  }
}
