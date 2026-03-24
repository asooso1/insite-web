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

/**
 * CSV 문자열 생성 함수
 * BOM(Byte Order Mark)을 포함하여 Excel에서 한글이 올바르게 표시됨
 *
 * @param data - CSV로 변환할 데이터 배열
 * @param headers - 컬럼 이름 매핑 (없으면 data의 키 그대로 사용)
 * @returns BOM이 포함된 CSV 문자열
 */
function generateCsvContent(
  data: Record<string, unknown>[],
  headers?: Record<string, string>
): string {
  if (data.length === 0) {
    return "";
  }

  // 컬럼명 결정 (headers 있으면 사용, 없으면 첫 행의 키 사용)
  const keys = headers ? Object.keys(headers) : Object.keys(data[0] || {});
  const headerRow = headers ? Object.values(headers) : keys;

  // CSV 헤더 행
  const csvHeader = headerRow.map((h) => escapecsvValue(String(h))).join(",");

  // CSV 데이터 행
  const csvRows = data.map((row) =>
    keys.map((key) => escapecsvValue(String(row[key] ?? ""))).join(",")
  );

  // BOM + 헤더 + 데이터
  return "\uFEFF" + [csvHeader, ...csvRows].join("\n");
}

/**
 * CSV 값을 이스케이프 처리
 * 쉼표, 줄바꿈, 큰따옴표가 포함된 경우 큰따옴표로 감싸고 큰따옴표는 두 배로
 *
 * @param value - 이스케이프할 값
 * @returns 이스케이프된 값
 */
function escapecsvValue(value: string): string {
  if (value.includes(",") || value.includes("\n") || value.includes('"')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * CSV 파일로 다운로드 트리거
 * DOM 정리를 try/finally로 보장 (메모리 누수 방지)
 *
 * @param data - 다운로드할 데이터 배열
 * @param filename - 저장될 파일명 (예: "work-orders.csv")
 * @param headers - 컬럼 이름 매핑 (선택사항)
 */
export function triggerCsvDownload(
  data: Record<string, unknown>[],
  filename: string,
  headers?: Record<string, string>
): void {
  const csvContent = generateCsvContent(data, headers);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  triggerExcelDownload(blob, filename);
}
