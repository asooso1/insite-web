# 성능 베이스라인 측정 문서

> 작성일: 2026-02-06
> 상태: 🔄 측정 대기

## 목적

기존 csp-web의 성능 지표를 측정하여 마이그레이션 후 비교 검증의 기준선을 수립합니다.

---

## 1. Web Vitals 측정

### 1.1 측정 대상 페이지

| 번호 | 페이지 | URL | 중요도 | 측정 상태 |
|------|--------|-----|--------|----------|
| 1 | 로그인 | /login | 높음 | ⏳ 대기 |
| 2 | 메인 대시보드 | /main | 높음 | ⏳ 대기 |
| 3 | FMS 대시보드 | /fms | 높음 | ⏳ 대기 |
| 4 | 작업 목록 | /work-orders | 높음 | ⏳ 대기 |
| 5 | 작업 상세 | /work-orders/{id} | 중간 | ⏳ 대기 |
| 6 | 시설 목록 | /facilities | 중간 | ⏳ 대기 |
| 7 | 센서 대시보드 | /sensor | 중간 | ⏳ 대기 |
| 8 | 현장작업 | /fieldwork | 중간 | ⏳ 대기 |

### 1.2 측정 지표

| 지표 | 설명 | 목표 | 측정 도구 |
|------|------|------|----------|
| **LCP** | Largest Contentful Paint | < 2.5s | Lighthouse, WebPageTest |
| **CLS** | Cumulative Layout Shift | < 0.1 | Lighthouse |
| **INP** | Interaction to Next Paint | < 200ms | Lighthouse |
| **FCP** | First Contentful Paint | < 1.8s | Lighthouse |
| **TTFB** | Time to First Byte | < 0.8s | Lighthouse |
| **TBT** | Total Blocking Time | < 200ms | Lighthouse |

### 1.3 측정 결과 템플릿

#### 로그인 페이지 (/login)

| 지표 | 현재 (csp-web) | 목표 | insite-web | 차이 |
|------|---------------|------|------------|------|
| LCP | - | < 2.5s | - | - |
| CLS | - | < 0.1 | - | - |
| INP | - | < 200ms | - | - |
| FCP | - | < 1.8s | - | - |
| TTFB | - | < 0.8s | - | - |
| TBT | - | < 200ms | - | - |
| **Lighthouse 점수** | - | > 90 | - | - |

#### 메인 대시보드 (/main)

| 지표 | 현재 (csp-web) | 목표 | insite-web | 차이 |
|------|---------------|------|------------|------|
| LCP | - | < 2.5s | - | - |
| CLS | - | < 0.1 | - | - |
| INP | - | < 200ms | - | - |
| FCP | - | < 1.8s | - | - |
| TTFB | - | < 0.8s | - | - |
| TBT | - | < 200ms | - | - |
| **Lighthouse 점수** | - | > 90 | - | - |

#### FMS 대시보드 (/fms)

| 지표 | 현재 (csp-web) | 목표 | insite-web | 차이 |
|------|---------------|------|------------|------|
| LCP | - | < 2.5s | - | - |
| CLS | - | < 0.1 | - | - |
| INP | - | < 200ms | - | - |
| FCP | - | < 1.8s | - | - |
| TTFB | - | < 0.8s | - | - |
| TBT | - | < 200ms | - | - |
| **Lighthouse 점수** | - | > 90 | - | - |

#### 작업 목록 (/work-orders)

| 지표 | 현재 (csp-web) | 목표 | insite-web | 차이 |
|------|---------------|------|------------|------|
| LCP | - | < 2.5s | - | - |
| CLS | - | < 0.1 | - | - |
| INP | - | < 200ms | - | - |
| FCP | - | < 1.8s | - | - |
| TTFB | - | < 0.8s | - | - |
| TBT | - | < 200ms | - | - |
| **Lighthouse 점수** | - | > 90 | - | - |

---

## 2. API 응답 시간 측정

### 2.1 측정 대상 API

| 번호 | API | 메서드 | 중요도 | 측정 상태 |
|------|-----|--------|--------|----------|
| 1 | /api/auth/login | POST | 높음 | ⏳ 대기 |
| 2 | /api/services/menus | GET | 높음 | ⏳ 대기 |
| 3 | /api/work-orders | GET | 높음 | ⏳ 대기 |
| 4 | /api/dashboards/{type} | GET | 높음 | ⏳ 대기 |
| 5 | /api/widgets/{id}/data | GET | 중간 | ⏳ 대기 |
| 6 | /api/buildings | GET | 중간 | ⏳ 대기 |
| 7 | /api/facilities | GET | 중간 | ⏳ 대기 |
| 8 | /api/sensors/data | GET | 중간 | ⏳ 대기 |

### 2.2 측정 결과 템플릿

| API | P50 | P95 | P99 | 목표 P95 | 상태 |
|-----|-----|-----|-----|----------|------|
| /api/auth/login | - | - | - | < 500ms | ⏳ |
| /api/services/menus | - | - | - | < 200ms | ⏳ |
| /api/work-orders | - | - | - | < 500ms | ⏳ |
| /api/dashboards/{type} | - | - | - | < 300ms | ⏳ |
| /api/widgets/{id}/data | - | - | - | < 500ms | ⏳ |
| /api/buildings | - | - | - | < 200ms | ⏳ |
| /api/facilities | - | - | - | < 500ms | ⏳ |
| /api/sensors/data | - | - | - | < 1000ms | ⏳ |

---

## 3. 번들 사이즈 측정

### 3.1 현재 csp-web 번들 분석

| 항목 | 크기 (gzip) | 비고 |
|------|------------|------|
| 전체 JS | - | |
| 전체 CSS | - | |
| Vue.js | - | |
| jQuery | - | |
| DHTMLX | - | |
| 기타 라이브러리 | - | |

### 3.2 목표 번들 사이즈

| 항목 | 목표 (gzip) | 비고 |
|------|------------|------|
| First Load JS | < 150KB | 초기 로딩 |
| 페이지별 추가 | < 50KB | 라우트별 청크 |
| 전체 CSS | < 50KB | Tailwind purge |

### 3.3 insite-web 예상 구성

| 라이브러리 | 예상 크기 (gzip) | 대체 대상 |
|-----------|-----------------|----------|
| React + Next.js | ~90KB | Vue.js |
| Tailwind CSS | ~10KB | SCSS 112개 파일 |
| shadcn/ui | ~20KB | 커스텀 컴포넌트 |
| Recharts | ~45KB | ApexCharts |
| TanStack Table | ~15KB | 커스텀 테이블 |
| Zustand | ~1KB | Vuex 없음 |
| React Query | ~12KB | - |
| **합계** | ~193KB | |

---

## 4. 측정 방법

### 4.1 Lighthouse CLI

```bash
# Lighthouse 설치
npm i -g lighthouse

# 측정 실행
lighthouse https://csp-web.example.com/login \
  --output=json \
  --output-path=./reports/login.json \
  --chrome-flags="--headless"
```

### 4.2 WebPageTest

1. https://www.webpagetest.org/ 접속
2. 테스트 위치: Seoul, South Korea
3. 브라우저: Chrome
4. 연결: Cable (5/1 Mbps)

### 4.3 API 응답 시간 측정

```bash
# Apache Bench 사용
ab -n 100 -c 10 -H "Authorization: Bearer $TOKEN" \
  https://csp-was.example.com/api/work-orders

# 또는 hey 사용
hey -n 100 -c 10 -H "Authorization: Bearer $TOKEN" \
  https://csp-was.example.com/api/work-orders
```

---

## 5. 측정 일정

| 단계 | 작업 | 예정일 | 상태 |
|------|------|--------|------|
| 1 | csp-web 스테이징 접근 확인 | - | ⏳ |
| 2 | Lighthouse 측정 환경 구성 | - | ⏳ |
| 3 | Web Vitals 측정 실행 | - | ⏳ |
| 4 | API 응답 시간 측정 실행 | - | ⏳ |
| 5 | 번들 사이즈 분석 | - | ⏳ |
| 6 | 결과 정리 및 보고서 작성 | - | ⏳ |

---

## 6. 비교 검증 계획

마이그레이션 완료 후 동일한 측정을 수행하여 비교합니다.

### 6.1 성공 기준

| 항목 | 기준 |
|------|------|
| Web Vitals | 모든 지표가 목표 충족 |
| Lighthouse 점수 | 90점 이상 |
| API 응답 시간 | 기존 대비 동등 또는 개선 |
| 번들 사이즈 | First Load < 150KB |

### 6.2 보고서 작성

마이그레이션 완료 후 다음 내용을 포함한 성능 비교 보고서 작성:

1. 측정 결과 요약
2. 지표별 비교 차트
3. 개선/악화 항목 분석
4. 추가 최적화 권장 사항

---

## 참고

- [web.dev - Web Vitals](https://web.dev/vitals/)
- [Lighthouse Scoring Calculator](https://googlechrome.github.io/lighthouse/scorecalc/)
- [WebPageTest](https://www.webpagetest.org/)
