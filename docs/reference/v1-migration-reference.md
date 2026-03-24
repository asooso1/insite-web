# v1 → v2 마이그레이션 참조

> **목적**: csp-web(v1) → insite-web(v2) 마이그레이션의 단일 참조 문서
> **대상**: AI 에이전트, 개발자
> **최종 업데이트**: 2026-03-24
> **통합 대상**: v1-modules-summary.md, v1-gap-analysis.md, v1-module-map.md

---

## 이 문서 사용법 (AI 에이전트 가이드)

```
필요한 정보                          → 참조 섹션
──────────────────────────────────────────────────
전체 진행률/남은 작업량 확인          → "현재 상태 대시보드"
구현 완료된 모듈의 v2 경로           → "구현 완료 모듈"
다음 구현할 모듈 선택                → "미구현 모듈 - 우선순위별"
BEMS/BECM 세부 화면 목록             → "BEMS 상세" / "BECM 상세"
v1 패턴을 v2로 변환하는 방법         → "v1 → v2 구현 패턴 매핑"
새 모듈 구현 시작 절차               → "모듈 구현 체크리스트 템플릿"
모듈 간 의존성 확인                  → "기술 의존성 그래프"
```

**Phase 로드맵 상세**: `docs/task-next.md` (Phase A-D, 25개 태스크, ~38주)
**진행 현황 상세**: `docs/task-progress.md`

---

## 현재 상태 대시보드

| 지표 | 값 |
|------|-----|
| v1 전체 HTML 파일 | 585개 (33개 모듈) |
| v2 구현 완료 | **13개 모듈** (Phase 1-9 + A-B) |
| v2 미구현 | **20개 모듈** |
| 전체 진행률 | **~75%** |
| 다음 단계 | Phase C (중기, 10-20주) |
| 최종 목표 | Phase D 완료 시 v1 완전 대체 |

### Phase 타임라인 (2026년)

| Phase | 기간 | 상태 | 핵심 내용 |
|-------|------|------|----------|
| Phase 1-9 | ~ 2026-03 | ✅ 완료 | 기반 + 13개 모듈 + UX |
| Phase A | 1-3주 | ✅ 완료 | 빠른 UX 개선 (KPI, 엑셀, 필터) |
| Phase B | 4-9주 | ✅ 완료 | nuqs, 벌크 액션, 알림, 권한, CSV |
| **Phase C** | **10-20주** | **다음** | 감사 로그, SSE, BEMS 기초, FEMS |
| **Phase D** | **21-46주** | 대기 | BEMS/BECM/FEMS 완전 구현 |

---

## 구현 완료 모듈 (13개)

| 모듈 | v1 HTML | v2 라우트 | 비고 |
|------|---------|----------|------|
| work-orders (작업지시) | 38 | `/work-orders` | 완전 구현 (SOP/민원/TBM 포함) |
| facilities (시설관리) | 14 | `/facilities` | 완전 구현 |
| users (사용자관리) | 11 | `/users` | 완전 구현 |
| clients (고객관리) | 6 | `/clients` | 완전 구현 |
| materials (자재관리) | 5 | `/materials` | 완전 구현 |
| boards (게시판) | 8 | `/boards` | 공지사항 + 자료실 |
| settings (설정) | 22 | `/settings` | **부분 구현** (facility-masters + 메뉴 관리) |
| licenses (라이선스) | 7 | `/licenses` | 완전 구현 |
| patrols (순찰/점검) | 10 | `/patrols` | 순찰팀 포함 |
| reports (리포트) | 14 | `/reports` | 월간/주간/작업일지 |
| dashboard (대시보드) | N/A | `/dashboard` | 위젯 프레임워크 구현 |
| fieldwork (현장작업) | 26 | `/fieldwork` | Phase 9 구현 |
| analysis (분석) | 18 | `/analysis` | Phase 9 구현 |

> **참고**: settings는 전체 22개 기능 중 일부만 구현됨. 나머지는 Phase C "설정 고도화"로 분류.

---

## 미구현 모듈 (20개) - 우선순위별

### 🔴 매우 높은 우선순위 (Phase D, 149 HTML)

| 모듈 | v1 HTML | 복잡도 | 필요 기술 | 의존성 |
|------|---------|--------|----------|--------|
| **bems** (빌딩 에너지 관리) | 85 | ★★★★★ | WebSocket/SSE, 고급 차트, 시계열 처리 | C-05 (BEMS 기초) |
| **becm** (보일러/냉동 관리) | 64 | ★★★★★ | 실시간 모니터링, 알람, 센서 통합 | D-01 (BEMS 일부 재활용) |

### 🟠 높은 우선순위 (Phase C-D, 59 HTML)

| 모듈 | v1 HTML | 복잡도 | 필요 기술 | 의존성 |
|------|---------|--------|----------|--------|
| **service** (서비스 관리) | 38 | ★★★☆☆ | 프로젝트 관리, 수식 엔진, ROI 분석 | 없음 |
| **setting-advanced** (설정 고도화) | 21 | ★★★☆☆ | 권한 관리 UI, 로깅, 설정 검증 | 없음 |

### 🟡 중간 우선순위 (Phase C-D, 47 HTML)

| 모듈 | v1 HTML | 복잡도 | 필요 기술 | 의존성 |
|------|---------|--------|----------|--------|
| **site** (사이트/장소) | 19 | ★★★☆☆ | 계층 구조 (사이트→층→구역), 평면도 | 없음 |
| **sensor** (센서) | 10 | ★★★☆☆ | 실시간 데이터, 알람 | bems/becm 기반 |
| **nfc** (NFC) | 8 | ★★☆☆☆ | NFC 디바이스 연동 | 없음 |
| **invoice** (청구서) | 6 | ★★☆☆☆ | 기본 CRUD | 없음 |
| **control** (제어) | 4 | ★★☆☆☆ | 원격 제어, 명령 로깅 | sensor |

### 🟢 낮은 우선순위 (Phase D, 31 HTML)

| 모듈 | v1 HTML | 복잡도 | 필요 기술 | 의존성 |
|------|---------|--------|----------|--------|
| **support** (지원/문의) | 7 | ★★☆☆☆ | 기본 CRUD + 카테고리 | 없음 |
| **account** (계정 고급기능) | 6 | ★☆☆☆☆ | ID 찾기, 비밀번호 변경 | 없음 |
| **mypage** (마이페이지) | 5 | ★☆☆☆☆ | 프로필, 알림 설정 | 없음 |
| **personal** (개인 업무) | 5 | ★☆☆☆☆ | 기본 CRUD | 없음 |
| **tag** (태그 관리) | 5 | ★☆☆☆☆ | 기본 CRUD + 카테고리 | 없음 |
| **privacy** (개인정보 정책) | 3 | ★☆☆☆☆ | 정적 페이지 | 없음 |
| **task** (작업 추적) | 2 | ★☆☆☆☆ | 목록 + 상세 | 없음 |

---

## BEMS 상세 (85 HTML) - Phase D 핵심

**v1 경로**: `/templates/bems/`
**v2 경로**: `/src/app/(modules)/bems/` (신규)
**API prefix**: `/api/bems/*`

| 서브모듈 | 파일 수 | 주요 화면 | 필요 기술 |
|---------|--------|----------|----------|
| **anls** (분석) | 35 | 기준선 관리, 비용 시뮬레이션, 층별 에너지, 설비별 분석 | 시계열 차트, 필터링, 기간 비교 |
| **dash** (대시보드) | 5 | 에너지 현황, 실시간 모니터링, 비용 분석, 추이 | SSE, KPI 카드, 차트 |
| **cnt** (계산) | 8 | 에너지/비용/배출량 계산 | 수식 엔진 |
| **ecm** (에너지 절감) | 8 | ECM 목록/등록/분석 | 기본 CRUD + 분석 차트 |
| **eqp** (기기) | 5 | 설비 목록/상세 | 기본 CRUD |
| **engyCost** (에너지 비용) | 4 | 비용 목록/분석 | 차트, 비용 계산 |
| **std** (표준정보) | 5 | 표준 데이터 관리 | 기본 CRUD |
| **rept** (리포트) | 2 | 에너지 보고서 | 엑셀/PDF export |
| **common + demo** | 13 | 공통 컴포넌트, 데모 | - |

### BEMS 핵심 화면 (anls/ 35개)

```
기준선 관리:     baseLineList, baseLineEsmMgmt, baseLineMethdMgmt
비용 시뮬:       costSimlMgmt, engyPlanCostList, engyWellRateList
층별 에너지:     engyFloorList
설비별 분석:     eqpAirCprsList, eqpHeatList, eqpTherList, eqpWaterList
에너지 절감:     esmHistList, heatStorSystem
성능 분석:       aiFlowDiagram, airCompressorPerf, boilerPerf,
                chilledWaterPerf, coolingTowerPerf, heatExchangerPerf,
                pipelineLossAnalysis, powerQuality, steamConsumption,
                systemEfficiency, virtualMeterAnalysis, waterConsumption
```

### BEMS 구현 전략 (3단계)

| 단계 | 범위 | 화면 | 예상 공수 |
|------|------|------|----------|
| C-05 (기초) | 대시보드 MVP + KPI 카드 | 5개 | 3-4주 |
| D-01a (분석) | 에너지 상세 분석 + 설비별 | 27개 | 3주 |
| D-01b (고급) | ECM + 비용 + 보고서 + 설정 | 53개 | 3-5주 |

---

## BECM 상세 (64 HTML) - Phase D 핵심

**v1 경로**: `/templates/becm/`
**v2 경로**: `/src/app/(modules)/becm/` (신규)
**API prefix**: `/api/becm/*`

| 서브모듈 | 파일 수 | 주요 화면 | 필요 기술 |
|---------|--------|----------|----------|
| **pfmc** (성능 모니터링) | 28 | 흡수식/냉온수/터보 냉각기, 증기/진공 보일러 + 팝업 | 실시간 센서, 차트 |
| **std** (표준정보) | 9 | COP 관리, 항목관리, 자재, 냉매, 스팀데이터 + 팝업 | 기본 CRUD |
| **svc** (서비스) | 7 | 프로젝트, 절감, 기술공식, 경제성, IPVM | 수식 엔진, ROI |
| **anls** (분석) | 6 | 장비 청구, 부하계산, IPLV, 냉매 확인 | 계산 엔진 |
| **engy** (에너지) | 4 | 노드 편집, 연결, 실시간 | WebSocket |
| **dash** (대시보드) | 1 | BECM 대시보드 | SSE, 차트 |
| **rept** (리포트) | 1 | 데이터 리스트 | 엑셀 export |

### BECM 성능 모니터링 세부 (pfmc/ 28개)

```
흡수식 냉각기:    asrpChlr.html + 3개 팝업 (4)
냉온수 냉각기:    coldHotwterChlr.html + 3개 팝업 (4)
증기 보일러:      stemBoil.html + 3개 팝업 (4)
터보 냉각기:      trboChlr.html + 3개 팝업 (4)
진공 온수 보일러:  vcumHotwterBoil.html + 3개 팝업 (4)
기타 팝업/모달:   8
```

### BECM 필수 기술 결정 사항

| 항목 | 옵션 | 결정 시점 |
|------|------|----------|
| 실시간 통신 | WebSocket / SSE / MQTT | D-02 착수 전 |
| 차트 라이브러리 | ECharts (권장) / Recharts | C-05에서 결정 |
| 센서 데이터 저장 | 시계열 DB / RDB 집계 | D-01 설계 시 |

---

## v1 → v2 구현 패턴 매핑

### 페이지 라우팅

| v1 (Spring MVC) | v2 (Next.js App Router) |
|-----------------|------------------------|
| `/module/list` → `moduleList.html` | `/module` → `page.tsx` |
| `/module/add` → `moduleAdd.html` | `/module/new` → `page.tsx` |
| `/module/{id}` → `moduleView.html` | `/module/[id]` → `page.tsx` |
| `/module/{id}/edit` → `moduleEdit.html` | `/module/[id]/edit` → `page.tsx` |

### CRUD 패턴

| v1 (Thymeleaf + Vue 2) | v2 (Next.js 15) |
|------------------------|-----------------|
| Bootstrap 테이블 + jQuery 페이지네이션 | `DataTable` + `FilterBar` + `PageHeader` |
| Vue data + VeeValidate | React Hook Form + Zod |
| Bootstrap Modal + jQuery trigger | `Dialog` (shadcn/ui) + 상태 관리 |
| `window.confirm()` | `AlertDialog` |
| `axios` + Vuex | `apiClient` + React Query + Zustand |

### 상세 패턴 참조

컴포넌트 패턴 표준: `.claude/rules/component-patterns.md`
디자인 시스템: `.claude/rules/design-system.md`

---

## 기술 의존성 그래프

```
auth (인증)
  ↓
dashboard (대시보드)
  ├── analysis (분석) ←── facilities, users
  │     ↓
  │   bems ←── sensor, site
  │     ↓
  │   becm ←── sensor, control
  │     ↓
  │   fems (Phase C-D 신규)
  │
  ├── work-orders ←── reports, fieldwork
  │     ↓
  │   patrol ←── licenses, materials
  │
  └── settings ←── clients, service
        ↓
      setting-advanced
```

### 기술 스택 매핑

| 항목 | v1 | v2 |
|------|----|----|
| 프레임워크 | Thymeleaf + Vue.js 2 | Next.js 15 (App Router) |
| 상태관리 | Vue data / Vuex | Zustand + React Query |
| 라우팅 | Spring MVC | File-based routing |
| 폼 | VeeValidate | React Hook Form + Zod |
| 스타일 | Bootstrap 5 | Tailwind CSS + CSS Variables |
| 차트 | Chart.js | Recharts (또는 ECharts, C-05에서 결정) |
| HTTP | axios | apiClient (fetch 기반) + React Query |
| 백엔드 | csp-was (REST API) | csp-was (REST API) - **동일** |

---

## 모듈 구현 체크리스트 템플릿

새 모듈 구현 시 아래 순서를 따른다. 기존 패턴 참조: `src/lib/{types,api,hooks}/facility.ts`

### 1단계: 사전 조사
- [ ] csp-was 컨트롤러에서 API 엔드포인트 확인
- [ ] v1 HTML 파일 구조 파악 (이 문서의 해당 모듈 섹션 참조)
- [ ] 필요한 기술 스택 확인 (차트, 실시간, 지도 등)

### 2단계: 타입 + API + 훅
- [ ] `src/lib/types/{module}.ts` - Enum + DTO + VO + SearchVO
- [ ] `src/lib/api/{module}.ts` - CRUD 함수 (apiClient 사용)
- [ ] `src/lib/hooks/use-{module}.ts` - Keys Factory + useQuery + useMutation

### 3단계: 페이지
- [ ] `page.tsx` - 목록 (DataTable + FilterBar + PageHeader)
- [ ] `[id]/page.tsx` - 상세 (InfoPanel + Tabs)
- [ ] `new/page.tsx` - 등록 (React Hook Form + Zod)
- [ ] `[id]/edit/page.tsx` - 수정
- [ ] `_components/{module}-form.tsx` - 폼 컴포넌트

### 4단계: 검증
- [ ] `npm run build` 성공
- [ ] staleTime 설정됨 (목록 30s, 상세 60s)
- [ ] StatusBadge 사용 (직접 색상 클래스 금지)
- [ ] 로딩/빈/에러 3가지 상태 처리됨
- [ ] Stories 파일 생성됨 (신규 컴포넌트)
