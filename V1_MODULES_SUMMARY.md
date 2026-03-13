# v1 (csp-web) vs v2 (insite-web) 모듈 마이그레이션 체크리스트

## 핵심 수치

| 구분 | v1 | v2 | 상태 |
|------|----|----|------|
| **총 HTML 파일** | 585개 | - | 매핑 완료 |
| **모듈 수** | 33개 | 11개 | 진행 중 (33%) |
| **구현률** | 100% | 75% | - |
| **미구현 모듈** | - | 22개 | 우선순위 필요 |

---

## v2 구현 완료 (11개 모듈)

```
✅ work-orders         (38 HTML) - 작업지시
✅ facilities         (14 HTML) - 시설관리
✅ users              (11 HTML) - 사용자관리
✅ clients             (6 HTML) - 고객관리
✅ materials           (5 HTML) - 자재관리
✅ boards              (8 HTML) - 게시판
✅ settings           (22 HTML) - 설정*
✅ licenses            (7 HTML) - 라이선스
✅ patrols            (10 HTML) - 순찰/점검
✅ reports            (14 HTML) - 리포트
✅ dashboard           (N/A)   - 대시보드

* settings는 facility-masters만 구현됨 (전체 22개 기능 중 1개)
```

---

## v1에만 있는 모듈 (22개 - 미구현)

### 🔴 매우 높은 우선순위 (BEMS/BECM 시스템)

```
❌ bems       (85 HTML) - Building Energy Management System
   - 에너지 분석 (35개 페이지)
   - 기준선 관리, 비용 시뮬레이션
   - 기기별 에너지 분석
   ⚠️  insite의 핵심 기능 - 필수 구현

❌ becm       (64 HTML) - Boiler/Chiller Equipment Management
   - 성능 모니터링 (냉각기, 보일러, 스팀)
   - 설비 유지보수
   - 신뢰성 분석
   ⚠️  에너지 효율화의 핵심 - 필수 구현

❌ analysis   (18 HTML) - 통합 분석
   - 에너지/성능 추세
   - 통계 분석
   ⚠️  의사결정 지원 - 높은 우선순위
```

### 🟠 높은 우선순위

```
❌ fieldwork  (26 HTML) - 현장 작업 시스템
   - 현장 대시보드, 출퇴근, 일정
   - 위치 추적, 경로 시각화
   ⚠️  현장 인력 관리 필수

❌ service    (38 HTML) - 서비스 관리
   - 프로젝트, 절감액 추적
   - 기술 공식, 경제성 검토
   ⚠️  비즈니스 가치 높음

❌ setting    (22 HTML) - 고급 설정
   - 현재: facility-masters만 구현
   - 필요: 시스템/사용자/기기/센서 설정
   ⚠️  시스템 운영 기초
```

### 🟡 중간 우선순위

```
❌ sensor     (10 HTML) - 센서 관리
❌ site       (19 HTML) - 사이트/장소 관리
❌ control    (4 HTML)  - 제어 시스템
❌ nfc        (8 HTML)  - NFC 기능
❌ invoice    (6 HTML)  - 청구서
```

### 🟢 낮은 우선순위

```
❌ account    (6 HTML)  - 계정 고급기능
❌ personal   (5 HTML)  - 개인 업무
❌ support    (7 HTML)  - 지원/문의
❌ tag        (5 HTML)  - 태그 관리
❌ task       (2 HTML)  - 작업 추적
❌ mypage     (5 HTML)  - 마이페이지
```

---

## 파일 수별 모듈 분포

```
큰 모듈 (30+ HTML)
├─ bems        : 85 ⭐⭐⭐ (매우 높음)
├─ becm        : 64 ⭐⭐⭐ (매우 높음)
├─ service     : 38 ⭐⭐ (높음)
├─ workOrder   : 38 ✅ 구현됨
└─ common      : 109 (인프라)

중간 모듈 (10-29 HTML)
├─ fieldwork   : 26 ⭐⭐ (높음)
├─ setting     : 22 ⭐⭐ (높음)
├─ site        : 19 ⭐⭐ (높음)
├─ analysis    : 18 ⭐⭐ (높음)
├─ facilities  : 14 ✅ 구현됨
├─ report      : 14 ✅ 구현됨
├─ user        : 11 ✅ 구현됨
├─ mobile      : 11
├─ sensor      : 10 ⭐ (중간)
└─ patrol      : 10 ✅ 구현됨

작은 모듈 (1-9 HTML)
├─ board       : 8 ✅ 구현됨
├─ nfc         : 8
├─ control     : 4
├─ account     : 6
├─ client      : 6
├─ invoice     : 6
├─ license     : 7 ✅ 구현됨
├─ support     : 7
├─ material    : 5 ✅ 구현됨
├─ mypage      : 5
├─ personal    : 5
├─ privacy     : 3
├─ tag         : 5
└─ task        : 2
```

---

## 권장 마이그레이션 로드맵

### Phase 1: 현재 진행 중 (75% 완료)
**상태:** 진행 중
- [x] 기본 CRUD 11개 모듈
- [ ] 모바일 완성
- [ ] 메뉴 시스템 확장

**예상 완료:** 2025-03-31

---

### Phase 2: 분석 & 설정 강화 (3-4개월)
**우선도:** 🔴 매우 높음
**작업량:** ~500-600시간

```
1순위: Analysis + 설정 고도화
├─ 에너지 분석 페이지 (18개)
├─ 시스템 설정 (22개)
└─ 필드워크 대시보드 (선택적)

2순위: 필드워크 시스템
└─ 현장 관리 (26개)
```

**기술 고려사항:**
- 차트 라이브러리 (Recharts/ECharts)
- 필터/검색 UI 복잡도 높음
- 실시간 데이터 (WebSocket)

**예상 완료:** 2025-06-30

---

### Phase 3: BEMS/BECM 기초 (6개월)
**우선도:** 🔴 매우 높음
**작업량:** ~1,500-2,000시간
**복잡도:** 매우 높음

```
3a단계: 기본 대시보드 & 모니터링
├─ BEMS 대시보드 (5개)
├─ 기본 분석 (10개)
└─ BECM 모니터링 (15개)

3b단계: 고급 분석
├─ 에너지 분석 (35개)
├─ 기준선 관리
└─ 비용 시뮬레이션

3c단계: 전문 기능
├─ 기술 공식
├─ 경제성 검토
└─ 3D 시각화
```

**기술 고려사항:**
- 3D 시각화 (Three.js/Babylon.js)
- 실시간 모니터링 (WebSocket/Server-Sent Events)
- 복잡한 필터링 & 쿼리
- 대용량 데이터 처리

**예상 완료:** 2025-12-31

---

### Phase 4: 나머지 모듈 (3개월)
**우선도:** 🟡 낮음
**작업량:** ~300-400시간

```
서비스/센서/사이트/개인기능 등
```

**예상 완료:** 2026-03-31

---

## 마이그레이션 영향도 분석

### 기능별 중요도

| 기능 | v1 파일 | 영향도 | 사용자 |
|------|---------|--------|--------|
| BEMS (에너지관리) | 85 | ⭐⭐⭐⭐⭐ | 시설관리자 |
| BECM (설비관리) | 64 | ⭐⭐⭐⭐⭐ | 유지보수팀 |
| 분석/리포트 | 32 | ⭐⭐⭐⭐ | 경영진/분석팀 |
| 현장 관리 | 26 | ⭐⭐⭐⭐ | 현장 작업자 |
| 기본 CRUD | 82 | ⭐⭐⭐ | 전체 |
| 설정 | 22 | ⭐⭐⭐ | 관리자 |
| 개인 기능 | 31 | ⭐⭐ | 개인 사용자 |

### 의존성 그래프

```
accounts/auth
    ↓
dashboard
    ├─→ analysis ←─ facilities, users
    │       ↓
    │   bems/becm ←─ sensors, site
    │
    ├─→ work-orders ←─ reports, fieldwork
    │       ↓
    │   patrol ←─ licenses, materials
    │
    └─→ settings ←─ clients, service
```

---

## v1 vs v2 기술 비교

### 프론트엔드

| 항목 | v1 | v2 |
|------|----|----|
| 프레임워크 | Thymeleaf + Vue 2 | Next.js 15 |
| 상태관리 | Vue (기본) | Zustand / Context |
| 라우팅 | Spring MVC | File-based (App Router) |
| 폼 | VeeValidate | React Hook Form + Zod |
| 스타일 | Bootstrap 5 | Tailwind CSS |
| 차트 | Chart.js | Recharts (권장) |

### 백엔드 (공통)

```
v1과 v2 모두 사용: csp-was (REST API)
- /api/workOrder/*
- /api/facility/*
- /api/analysis/*
- /api/bems/*
- /api/becm/*
- /api/services/menus
```

---

## v1 메뉴 시스템

### 구조

```
Depth 1 (카테고리, 접을 수 있음)
├─ 대시보드
├─ 에너지관리
│  ├─ Depth 2 (그룹)
│  │  ├─ BEMS
│  │  │  ├─ Depth 3 (페이지)
│  │  │  ├─ 분석
│  │  │  └─ 기준선 관리
│  │  └─ BECM
│  │     ├─ 대시보드
│  │     └─ 성능 모니터링
│  └─ 분석
└─ 운영관리
   ├─ 작업지시
   ├─ 순찰/점검
   └─ 리포트
```

### API

```
GET /api/services/menus?buildingId={id}
→ MenuTreeDTO[]
  ├─ id, name, url, icon, depth
  ├─ parentId (상위 메뉴)
  └─ children (재귀)
```

---

## 다음 액션 아이템

### 즉시 (이번 주)
- [ ] 이 분석 문서 리뷰 및 확인
- [ ] Phase 2 우선순위 최종 결정
- [ ] 리소스 할당 계획

### 단기 (1-2주)
- [ ] 분석 모듈 UI/UX 설계
- [ ] BEMS 데이터 모델 정의
- [ ] 메뉴 시스템 v2 구현 계획

### 중기 (1개월)
- [ ] Phase 2 개발 착수
- [ ] v1 API 명세 완성
- [ ] 테스트 전략 수립

---

**최종 업데이트:** 2025-03-05
**분석 범위:** v1 585개 HTML, 33개 모듈 | v2 11개 모듈 구현
**담당:** Exploration Team
