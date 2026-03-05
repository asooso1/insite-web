/**
 * Mock 데이터 생성 유틸리티
 */

/**
 * 접두사와 번호로 ID 문자열 생성
 */
export function generateId(prefix: string, n: number): string {
  return `${prefix}-${String(n).padStart(4, "0")}`;
}

/**
 * 현재 시점 기준 과거 날짜 ISO 문자열 생성
 */
export function randomPast(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString().slice(0, 10);
}

/**
 * 현재 시점 기준 미래 날짜 ISO 문자열 생성
 */
export function randomFuture(daysAhead: number): string {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * daysAhead) + 1);
  return date.toISOString().slice(0, 10);
}

/**
 * 배열에서 랜덤 요소 1개 반환
 */
export function pickRandom<T>(arr: readonly T[]): T {
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx] as T;
}

/**
 * 배열에서 랜덤 요소 n개 반환 (중복 없음)
 */
export function pickRandomN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, arr.length));
}
