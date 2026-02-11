/**
 * 차트 컬러 유틸리티
 *
 * CSS 변수 기반 categorical 팔레트
 * 시리즈 수에 따라 최적의 컬러 조합 반환
 */

// ============================================================================
// Color Palettes (HSL Values)
// ============================================================================

/**
 * 메인 categorical 팔레트 (최대 12개)
 * 다크모드/라이트모드 모두에서 가독성 좋은 색상
 */
export const CHART_COLORS = {
  blue: "hsl(217, 91%, 60%)",
  green: "hsl(142, 71%, 45%)",
  orange: "hsl(24, 95%, 53%)",
  purple: "hsl(262, 83%, 58%)",
  pink: "hsl(330, 81%, 60%)",
  cyan: "hsl(187, 85%, 43%)",
  yellow: "hsl(45, 93%, 47%)",
  red: "hsl(0, 84%, 60%)",
  indigo: "hsl(234, 89%, 64%)",
  teal: "hsl(174, 72%, 40%)",
  amber: "hsl(38, 92%, 50%)",
  lime: "hsl(84, 78%, 45%)",
} as const;

/**
 * 순서 보장된 컬러 배열
 * 가독성을 위해 인접 색상은 명도/채도 차이가 큰 것으로 배치
 */
const ORDERED_COLORS = [
  CHART_COLORS.blue,
  CHART_COLORS.orange,
  CHART_COLORS.green,
  CHART_COLORS.purple,
  CHART_COLORS.cyan,
  CHART_COLORS.pink,
  CHART_COLORS.yellow,
  CHART_COLORS.red,
  CHART_COLORS.indigo,
  CHART_COLORS.teal,
  CHART_COLORS.amber,
  CHART_COLORS.lime,
];

/**
 * 단일 색상 팔레트 (명도 변화)
 * 같은 색상의 밝기를 조절하여 시리즈 구분
 */
export const SINGLE_COLOR_SHADES = {
  blue: [
    "hsl(217, 91%, 75%)",
    "hsl(217, 91%, 60%)",
    "hsl(217, 91%, 45%)",
    "hsl(217, 85%, 35%)",
    "hsl(217, 75%, 25%)",
  ],
  green: [
    "hsl(142, 71%, 60%)",
    "hsl(142, 71%, 45%)",
    "hsl(142, 71%, 35%)",
    "hsl(142, 65%, 25%)",
    "hsl(142, 55%, 18%)",
  ],
  orange: [
    "hsl(24, 95%, 68%)",
    "hsl(24, 95%, 53%)",
    "hsl(24, 90%, 42%)",
    "hsl(24, 85%, 32%)",
    "hsl(24, 75%, 22%)",
  ],
} as const;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * 시리즈 수에 따라 최적의 컬러 배열 반환
 *
 * @param count - 필요한 컬러 수
 * @returns HSL 색상 문자열 배열
 *
 * @example
 * getChartColors(3) // ["hsl(217, 91%, 60%)", "hsl(24, 95%, 53%)", "hsl(142, 71%, 45%)"]
 */
export function getChartColors(count: number): string[] {
  if (count <= 0) return [];
  if (count <= ORDERED_COLORS.length) {
    return ORDERED_COLORS.slice(0, count);
  }

  // 12개 이상 필요 시 반복
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const color = ORDERED_COLORS[i % ORDERED_COLORS.length];
    if (color) {
      result.push(color);
    }
  }
  return result;
}

/**
 * 이름으로 특정 색상 가져오기
 *
 * @param name - 색상 이름 (blue, green, orange 등)
 * @returns HSL 색상 문자열
 */
export function getChartColor(name: keyof typeof CHART_COLORS): string {
  return CHART_COLORS[name];
}

/**
 * 단일 색상의 명도 변화 팔레트 반환
 *
 * @param baseColor - 기본 색상 이름
 * @param count - 필요한 색상 수
 * @returns HSL 색상 문자열 배열
 */
export function getSingleColorPalette(
  baseColor: keyof typeof SINGLE_COLOR_SHADES,
  count: number
): string[] {
  const shades = SINGLE_COLOR_SHADES[baseColor];
  if (count <= shades.length) {
    return shades.slice(0, count);
  }
  // 더 많은 색상이 필요하면 반복
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const shade = shades[i % shades.length];
    if (shade) {
      result.push(shade);
    }
  }
  return result;
}

/**
 * ChartConfig 객체 생성 헬퍼
 * shadcn/ui ChartContainer에서 사용
 *
 * @param labels - 데이터 키와 라벨 매핑
 * @returns ChartConfig 객체
 *
 * @example
 * createChartConfig({
 *   revenue: "매출",
 *   profit: "이익",
 * })
 */
export function createChartConfig(
  labels: Record<string, string>
): Record<string, { label: string; color: string }> {
  const keys = Object.keys(labels);
  const colors = getChartColors(keys.length);

  return keys.reduce(
    (config, key, index) => {
      const label = labels[key];
      const color = colors[index];
      if (label && color) {
        config[key] = { label, color };
      }
      return config;
    },
    {} as Record<string, { label: string; color: string }>
  );
}

/**
 * 차트 그라디언트 ID 생성
 */
export function getGradientId(prefix: string, index: number): string {
  return `${prefix}-gradient-${index}`;
}

// ============================================================================
// Status Colors (업무 상태 등)
// ============================================================================

export const STATUS_COLORS = {
  success: "hsl(142, 71%, 45%)",
  warning: "hsl(38, 92%, 50%)",
  error: "hsl(0, 84%, 60%)",
  info: "hsl(217, 91%, 60%)",
  pending: "hsl(45, 93%, 47%)",
  completed: "hsl(142, 71%, 45%)",
  inProgress: "hsl(217, 91%, 60%)",
  cancelled: "hsl(0, 0%, 45%)",
} as const;

/**
 * 상태에 따른 색상 반환
 */
export function getStatusColor(status: keyof typeof STATUS_COLORS): string {
  return STATUS_COLORS[status];
}
