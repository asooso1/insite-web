/**
 * 엑셀 다운로드 공통 유틸리티
 *
 * 사용법:
 * ```typescript
 * const blob = await downloadXxx(params);
 * triggerExcelDownload(blob, "파일명.xlsx");
 * ```
 */

/**
 * Blob을 파일로 다운로드 트리거
 * DOM 정리를 try/finally로 보장 (메모리 누수 방지)
 *
 * @param blob - 다운로드할 파일 Blob
 * @param filename - 저장될 파일명 (예: "facilities.xlsx")
 */
export function triggerExcelDownload(blob: Blob, filename: string): void {
  let anchor: HTMLAnchorElement | null = null;
  let objectUrl: string | null = null;
  try {
    objectUrl = window.URL.createObjectURL(blob);
    anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
  } finally {
    if (objectUrl) window.URL.revokeObjectURL(objectUrl);
    if (anchor?.parentNode) document.body.removeChild(anchor);
  }
}

/**
 * 오늘 날짜를 파일명에 사용하기 좋은 포맷으로 반환
 * @returns "20240101" 형식
 */
export function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10).replace(/-/g, "");
}
