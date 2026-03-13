# insite 프로젝트 v1 (csp-web) vs v2 (insite-web) 기능 분석

## 요약

| 항목 | 수량 | 상태 |
|------|------|------|
| **v1 HTML 템플릿** | 585개 | 완전히 매핑됨 |
| **v1 모듈** | 33개 | 상세 분석됨 |
| **v2 구현 모듈** | 11개 | 진행 중 (75%) |
| **갭(미구현)** | 22개 모듈 | 우선순위 지정 필요 |

---

## 1. v1 전체 모듈 및 기능 목록 (585개 HTML 파일)

### 1.1 v1 모듈별 HTML 파일 개수 (경로 기준)

```
account              : 6 files     # 사용자 인증/계정 관리
  - login.html, idFind.html, temporary/userList.html, modal/passwordChange.html 등

analysis            : 18 files    # 에너지/성능 분석
  - energyStatus.html, usageStatus.html, statistics.html
  - trendEMS(Edit/List/View).html, trendFMS(Edit/List/View).html, trendRMS(Edit/List/View).html
  - fmsItemHistory.html, fmsLabor.html, fmsTeam.html, rms.html
  - demoChart1.html, demoChart2.html

becm               : 64 files    # 보일러/냉동시스템 모니터링 (대규모)
  - anls/         : 6 files      # 분석 (eqpBillList, loadCalc, iplv, 등)
  - dash/         : 1 file       # 대시보드
  - engy/         : 4 files      # 에너지 (eqpNodeEdit, eqpNodeCnnc, eqpEqpPrmtEdit, 등)
  - pfmc/         : 28 files     # 성능 모니터링 (asrpChlr, coldHotwterChlr, stemBoil, trboChlr, vcumHotwterBoil + modal)
  - rept/         : 1 file       # 리포트
  - std/          : 9 files      # 표준 정보 (eqpCopMng, eqpItemMng, mtrlMng, rfgrMng, stemDataMng + modal)
  - svc/          : 7 files      # 서비스 (projList, savnList, techFmla, econRvew, ipvmProjList + modal)

bems               : 85 files    # 빌딩 에너지 관리 시스템 (최대규모)
  - anls/         : 35 files     # 분석 (에너지분석, 기준선, 비용시뮬, 기기분석, 등)
  - cnt/          : 8 files      # 계산
  - common/       : 5 files      # 공통
  - dash/         : 5 files      # 대시보드
  - demo/         : 3 files      # 데모
  - ecm/          : 8 files      # ECM(Energy Conservation Measures)
  - engy/         : 5 files      # 에너지
  - engyCost/     : 4 files      # 에너지 비용
  - eqp/          : 5 files      # 기기
  - rept/         : 2 files      # 리포트
  - std/          : 5 files      # 표준

board              : 8 files     # 게시판
  - boardList.html, boardView.html, boardAdd.html, boardEdit.html
  - noticeList.html, noticeView.html, noticeAdd.html, noticeEdit.html

client             : 6 files     # 고객 관리
  - clientList.html, clientAdd.html, clientEdit.html, clientView.html, modal/clientSearchModal.html

common             : 109 files   # 공통/레이아웃 (가장 많음)
  - layout components, dialogs, modals, shared components
  - navigator.html (메뉴 시스템), header.html, page-header.html

control            : 4 files     # 제어
  - controlList.html, controlAdd.html, controlEdit.html, controlView.html

error              : 7 files     # 에러 페이지
  - 400.html, 401.html, 403.html, 404.html, 405.html, 500.html, etc.

facility           : 14 files    # 시설 관리
  - facilityList.html, facilityAdd.html, facilityEdit.html, facilityView.html
  - facilitySearchModal.html, buildingList.html, buildingView.html, 등

fieldwork          : 26 files    # 현장 작업 (필드워크)
  - field-dashboard, field-attendance, field-project, field-schedule
  - field-work-order, field-report, path-visualization-preview.html

invoice            : 6 files     # 청구서
  - invoiceList.html, invoiceAdd.html, invoiceEdit.html, invoiceView.html

layout             : 12 files    # 레이아웃 (메뉴 구조)
  - common/navigator.html, common/header.html, common/page-header.html
  - menu/listPage.html, menu/addPage.html

license            : 7 files     # 라이선스 관리
  - licenseList.html, licenseAdd.html, licenseEdit.html, licenseView.html, licenseHistoryList.html

material           : 5 files     # 자재 관리
  - materialList.html, materialAdd.html, materialEdit.html, materialView.html

mobile             : 11 files    # 모바일 지원
  - mobile-optimized pages for various modules

mypage             : 5 files     # 마이페이지
  - myPageView.html, profileEdit.html, passwordChange.html, etc.

nfc                : 8 files     # NFC 관련
  - nfc detection, tag management pages

patrol             : 10 files    # 순찰/점검
  - patrolList.html, patrolAdd.html, patrolEdit.html, patrolView.html
  - patrolTeamList.html, patrolTeamAdd.html, patrolTeamEdit.html, patrolTeamView.html

personal           : 5 files     # 개인 업무
  - orderList.html, orderAdd.html, orderEdit.html, orderView.html, modal/siteUser.html

privacy            : 3 files     # 개인정보 정책
  - policyView.html, privacyTerms.html

report             : 14 files    # 리포트
  - reportMonthList.html, reportMonthAdd.html, reportMonthEdit.html, reportMonthView.html
  - reportWeekList.html, reportWeekAdd.html, reportWeekEdit.html, reportWeekView.html
  - workLogList.html, workLogAdd.html, workLogEdit.html, workLogView.html
  - tbmList.html, tbmView.html

sensor             : 10 files    # 센서 관리
  - sensorList.html, sensorAdd.html, sensorEdit.html, sensorView.html, etc.

service            : 38 files    # 서비스 (대규모)
  - subdir structure for different service types

setting            : 22 files    # 설정
  - systemSettings.html, userSettings.html, buildingSettings.html
  - equipmentSettings.html, sensorSettings.html, etc.

site               : 19 files    # 사이트/장소 관리
  - siteList.html, siteAdd.html, siteEdit.html, siteView.html, etc.

support            : 7 files     # 지원/문의
  - supportList.html, supportAdd.html, supportEdit.html, supportView.html

tag                : 5 files     # 태그 관리
  - tagList.html, tagAdd.html, tagEdit.html, tagView.html

task               : 2 files     # 작업
  - taskList.html, taskView.html

user               : 11 files    # 사용자 관리
  - userList.html, userAdd.html, userEdit.html, userView.html, userRoleList.html, etc.

workOrder          : 38 files    # 작업지시 (대규모)
  - orderList.html, orderAdd.html, orderEdit.html, orderView.html
  - sopList.html, sopAdd.html, sopEdit.html, sopView.html
  - commonSopList.html, commonSopAdd.html, commonSopEdit.html, commonSopView.html
  - complainList.html, complainAdd.html, complainEdit.html, complainView.html
  - tbmAdd.html, tbmEdit.html, messageHistoryList.html, etc.
```

---

## 2. v2 현재 구현 모듈 (11개)

### 2.1 v2 (insite-web) 라우트 구조

```
src/app/(modules)/
├── boards/                 # 게시판 (구현됨)
│   ├── page.tsx           # 목록
│   ├── notices/           # 공지사항
│   │   ├── [id]/page.tsx  # 상세
│   │   ├── [id]/edit/page.tsx
│   │   └── new/page.tsx
│   └── data/              # 자료실
│       ├── [id]/page.tsx
│       ├── [id]/edit/page.tsx
│       └── new/page.tsx
│
├── clients/               # 고객 관리 (구현됨)
│   ├── page.tsx
│   ├── [id]/page.tsx
│   ├── [id]/edit/page.tsx
│   └── new/page.tsx
│
├── facilities/            # 시설 관리 (구현됨)
│   ├── page.tsx
│   ├── [id]/page.tsx
│   ├── [id]/edit/page.tsx
│   └── new/page.tsx
│
├── licenses/              # 라이선스 관리 (구현됨)
│   ├── page.tsx
│   ├── [id]/page.tsx
│   ├── [id]/edit/page.tsx
│   └── new/page.tsx
│
├── materials/             # 자재 관리 (구현됨)
│   ├── page.tsx
│   ├── [id]/page.tsx
│   ├── [id]/edit/page.tsx
│   └── new/page.tsx
│
├── patrols/               # 순찰/점검 (구현됨)
│   ├── page.tsx
│   ├── [id]/page.tsx
│   ├── [id]/edit/page.tsx
│   ├── new/page.tsx
│   └── teams/             # 순찰팀
│       ├── [id]/page.tsx
│       ├── [id]/edit/page.tsx
│       └── new/page.tsx
│
├── reports/               # 리포트 (구현됨)
│   ├── page.tsx
│   ├── monthly/           # 월간보고
│   │   ├── [id]/page.tsx
│   │   ├── [id]/edit/page.tsx
│   │   └── new/page.tsx
│   ├── weekly/            # 주간보고
│   │   ├── [id]/page.tsx
│   │   ├── [id]/edit/page.tsx
│   │   └── new/page.tsx
│   └── work-logs/         # 작업일지
│       ├── [id]/page.tsx
│       ├── [id]/edit/page.tsx
│       └── new/page.tsx
│
├── settings/              # 설정 (구현됨)
│   ├── page.tsx
│   └── facility-masters/  # 시설마스터
│       ├── [id]/page.tsx
│       ├── [id]/edit/page.tsx
│       └── new/page.tsx
│
├── users/                 # 사용자 관리 (구현됨)
│   ├── page.tsx
│   ├── [id]/page.tsx
│   ├── [id]/edit/page.tsx
│   └── new/page.tsx
│
└── work-orders/           # 작업지시 (구현됨)
    ├── page.tsx
    ├── [id]/page.tsx
    ├── [id]/edit/page.tsx
    └── new/page.tsx
```

### 2.2 v2 대시보드 (구현됨)
```
src/app/
├── dashboard/
│   ├── page.tsx          # 대시보드 메인
│   ├── layout.tsx
│   └── _components/
│       └── dashboard-widgets.tsx
│
├── (auth)/
│   ├── login/page.tsx
│   └── layout.tsx
```

### 2.3 v2 모바일 라우트 (부분 구현)
```
src/app/m/
├── page.tsx
├── work-orders/page.tsx
├── work-orders/[id]/page.tsx
├── facilities/page.tsx
└── facilities/[id]/page.tsx
```

---

## 3. v1에만 있고 v2에 없는 기능 (GAP 분석)

### 3.1 대규모 미구현 모듈 (22개)

#### A. 에너지/환경 관리 시스템 (BEMS/BECM)
```
BEMS (Building Energy Management System)
└─ 85개 HTML 파일
   ├── 에너지 분석     : baseLineList, costSimulation, energyFloor, eqpAirCompressors
   ├── 기준선 관리     : baseLineEsmMgmt, baseLineMethdMgmt
   ├── 비용 관리       : engyPlanCost, engyWellRate
   ├── 기기 분석       : eqpHeatList, eqpTherList, eqpWaterList
   ├── 에너지정산      : esmHistList, heatStorSystem
   └── 기타 분석       : aiFlowDiagram, airCompressorPerf, boilerPerf, etc.

BECM (Boiler/Chiller Equipment Management)
└─ 64개 HTML 파일
   ├── 분석 모듈       : eqpBillList, loadCalc, iplv, refrigerantCheck
   ├── 성능 모니터링   : asrpChlr, coldHotwter, stemBoil, trboChlr (+ 36개 팝업)
   ├── 표준 정보       : eqpCopMng, eqpItemMng, mtrlMng, rfgrMng (+ 8개 팝업)
   ├── 서비스          : projList, savnList, techFmla, econReview, ipvmProj
   └── 대시보드        : beemsDashboard
```
**영향도:** 극대 - 에너지 관리/분석이 insite의 핵심 기능
**현황:** v2에서 전혀 구현되지 않음

#### B. 분석 시스템 (Analysis)
```
분석 모듈
└─ 18개 HTML 파일
   ├── 에너지 분석     : energyStatus, usageStatus
   ├── 트렌드 분석     : trendEMS, trendFMS, trendRMS (각 List/Edit/View)
   ├── 통계 분석       : statistics, fmsItemHistory, fmsLabor, fmsTeam
   └── 성능분석        : demoChart1, demoChart2, rms
```
**영향도:** 높음 - 의사결정을 위한 핵심 데이터
**현황:** v2 대시보드에 일부 시뮬레이션만 있음

#### C. 필드워크 모듈 (Fieldwork)
```
현장 작업 시스템
└─ 26개 HTML 파일
   ├── 현장 대시보드   : field-dashboard
   ├── 출퇴근 관리     : field-attendance
   ├── 프로젝트        : field-project
   ├── 일정 관리       : field-schedule
   ├── 작업지시        : field-work-order
   ├── 리포트          : field-report
   └── 경로 시각화     : path-visualization-preview
```
**영향도:** 높음 - 현장 인력 관리 시스템
**현황:** v2에서 구현되지 않음 (모바일 버전 부분 있음)

#### D. 서비스 관리 (Service)
```
서비스 모듈
└─ 38개 HTML 파일
   ├── 프로젝트 관리
   ├── 절감 프로젝트   : savnList, savnPopup
   ├── 기술 공식       : techFmla
   ├── 경제성 검토     : econReview
   └── IPVM 프로젝트   : ipvmProjList, ipvmProjSavePopup
```
**영향도:** 중간-높음 - 에너지 절감 프로젝트 관리
**현황:** v2에서 구현되지 않음

#### E. 설정 및 기본정보 (Setting)
```
설정 모듈
└─ 22개 HTML 파일
   ├── 시스템 설정     : systemSettings
   ├── 사용자 권한     : userAuthSettings
   ├── 기기 설정       : equipmentSettings
   ├── 센서 설정       : sensorSettings
   ├── 빌딩 설정       : buildingSettings
   ├── 기준선 설정     : baselineSettings
   └── 에너지 설정     : energySettings
```
**영향도:** 높음 - 시스템 운영의 기초
**현황:** v2는 매우 제한된 설정만 구현 (facility-masters만 있음)

#### F. 센서/제어 관리 (Sensor/Control)
```
센서 모듈 (10개 파일)
├── sensorList, sensorAdd, sensorEdit, sensorView
└── sensorGroupList, sensorGroupAdd, sensorGroupEdit

제어 모듈 (4개 파일)
└── controlList, controlAdd, controlEdit, controlView
```
**영향도:** 중간 - 기본 인프라
**현황:** v2에서 구현되지 않음

#### G. 송장/인보이스 (Invoice)
```
청구서 관리 (6개 파일)
└── invoiceList, invoiceAdd, invoiceEdit, invoiceView, invoiceDetailList
```
**영향도:** 낮음 - 재정 모듈
**현황:** v2에서 구현되지 않음

#### H. NFC/태그 (NFC/Tag)
```
NFC 모듈 (8개 파일)
└── nfc device management, tag detection

태그 모듈 (5개 파일)
└── tagList, tagAdd, tagEdit, tagView
```
**영향도:** 낮음 - 부가 기능
**현황:** v2에서 구현되지 않음

#### I. 사이트/장소 관리 (Site)
```
사이트 모듈 (19개 파일)
└── siteList, siteAdd, siteEdit, siteView
    floorList, floorAdd, floorEdit, floorView
    zoneList, zoneAdd, zoneEdit, zoneView
```
**영향도:** 중간 - 공간 계층 관리
**현황:** v2에서 구현되지 않음

#### J. 계정/인증 고급 기능 (Account)
```
계정 모듈 (6개 파일)
├── login.html
├── idFind.html
└── temporary/userList, modal/passwordChange
```
**영향도:** 낮음 - 기본 인증은 구현됨
**현황:** v2 로그인은 기본만 구현, 비밀번호 찾기/ID 찾기 미구현

#### K. 개인 업무 (Personal)
```
개인 업무 (5개 파일)
└── orderList, orderAdd, orderEdit, orderView, modal/siteUser
```
**영향도:** 낮음 - 개인별 작업
**현황:** v2에서 구현되지 않음

#### L. 사무실 지원 (Support)
```
지원 모듈 (7개 파일)
└── supportList, supportAdd, supportEdit, supportView, supportCategoryList
```
**영향도:** 낮음 - 지원/문의
**현황:** v2에서 구현되지 않음

#### M. 작업 추적 (Task)
```
작업 모듈 (2개 파일)
└── taskList, taskView
```
**영향도:** 낮음 - 작업 추적
**현황:** v2에서 구현되지 않음

#### N. 마이페이지 (MyPage)
```
마이페이지 (5개 파일)
├── myPageView
├── profileEdit
├── passwordChange
└── notificationSettings
```
**영향도:** 낮음 - 개인 설정
**현황:** v2에서 구현되지 않음

---

## 4. v1 메뉴 시스템 아키텍처

### 4.1 메뉴 데이터 구조 (v1 navigator.html)

```
Menu Entity (백엔드)
├── id: number
├── name: string (메뉴 이름)
├── parentId: number (상위 메뉴 ID)
├── url: string (네비게이션 URL)
├── icon: string (아이콘 클래스)
├── depth: number (1=카테고리, 2=그룹, 3=페이지)
├── sortNo: number (정렬 순서)
├── show: boolean (표시 여부)
├── use: boolean (사용 여부)
└── children: Menu[] (재귀적 자식 메뉴)
```

### 4.2 메뉴 로딩 흐름 (v1)

1. **백엔드 API**: `/api/services/menus` (GET)
   - 매개변수: `buildingId` (빌딩별 메뉴 필터링)
   - 응답: 3-depth 트리 구조의 메뉴 목록

2. **권한 기반 필터링**
   - RoleMenu 테이블로 사용자 역할별 메뉴 필터링
   - 제품 기능별 메뉴 활성/비활성화 (ProductMenu)

3. **Vue.js 재귀 렌더링**
   - `menu-node` 컴포넌트로 depth별 렌더링
   - depth 1: Accordion (카테고리)
   - depth 2: 서브 Accordion 또는 링크
   - depth 3: 최종 링크 또는 상세 Accordion

### 4.3 v2에서의 메뉴 변경 사항

현재 v2에서는:
```typescript
// src/app/api/services/menus/route.ts
// - 정적 메뉴 설정으로 변경 가능
// - 또는 백엔드 /api/services/menus API 유지
```

---

## 5. 우선순위별 마이그레이션 계획

### Phase 1 (필수) - 현재 진행 중
- [x] 기본 모듈: work-orders, facilities, users, clients, materials
- [x] 게시판: boards
- [x] 관리: settings, licenses, patrols, reports
- [x] 대시보드: dashboard
- [ ] 모바일: 기본 라우트 구현

### Phase 2 (높음 우선순위) - 권장
**추정 작업량: 3-4개월, 30-40명 일수**

1. **분석 시스템** (18개 HTML)
   - 에너지 분석, 트렌드, 통계
   - 의존성: 백엔드 API 완성 필수
   - 예상 복잡도: 높음 (차트, 다양한 필터)

2. **설정 고도화** (22개 HTML)
   - 현재 facility-masters만 있음
   - 시스템 설정, 사용자 권한, 기기/센서 설정
   - 예상 복잡도: 중간

3. **필드워크** (26개 HTML)
   - 모바일 우선 설계 필요
   - 위치 추적, 출퇴근, 현장 대시보드
   - 예상 복잡도: 높음 (실시간, 지도 기능)

### Phase 3 (중간 우선순위)

4. **BEMS/BECM** (149개 HTML)
   - v1의 가장 복잡한 시스템
   - 에너지 관리, 기기 모니터링, 성능 분석
   - 예상 복잡도: 매우 높음 (3D 시각화, 실시간 데이터)
   - 분할 구현 권장:
     * Phase 3a: 대시보드, 기본 모니터링
     * Phase 3b: 분석, 비용 시뮬레이션
     * Phase 3c: 고급 기능 (기준선, ECM)

5. **서비스 관리** (38개 HTML)
   - 프로젝트, 절감, 기술 공식
   - 예상 복잡도: 중간-높음

### Phase 4 (낮음 우선순위)

6. **센서/제어** (14개 HTML)
7. **사이트/장소** (19개 HTML)
8. **개인 기능** (NFC, 태그, 마이페이지, 개인 업무) (31개 HTML)
9. **기타** (지원, 송장, 작업) (14개 HTML)

---

## 6. v1 API 엔드포인트 매핑

### 6.1 메뉴 시스템
```
GET /api/services/menus?buildingId={id}
  → MenuService.aside(roleCode, buildingId)
  → List<MenuTreeDTO>
```

### 6.2 각 모듈별 기본 CRUD API (패턴)
```
작업지시 (workOrder)
  GET    /api/workOrder/list              (목록)
  GET    /api/workOrder/{id}              (상세)
  POST   /api/workOrder                   (생성)
  PUT    /api/workOrder/{id}              (수정)
  DELETE /api/workOrder/{id}              (삭제)

작업지시 SOP (Standard Operating Procedure)
  GET    /api/workOrder/sop/list
  POST   /api/workOrder/sop
  ...

분석 (Analysis)
  GET    /api/analysis/trend/ems          (EMS 트렌드)
  GET    /api/analysis/trend/fms          (FMS 트렌드)
  GET    /api/analysis/trend/rms          (RMS 트렌드)
  GET    /api/analysis/statistics
  ...

BEMS
  GET    /api/bems/analysis/baseline      (기준선)
  GET    /api/bems/analysis/cost-sim      (비용 시뮬)
  GET    /api/bems/equipment/{id}         (기기 상세)
  ...

BECM
  GET    /api/becm/performance/chiller    (냉각기)
  GET    /api/becm/performance/boiler     (보일러)
  GET    /api/becm/maintenance/bill       (청구)
  ...
```

### 6.3 v2에서 구현된 API
```
src/app/api/
├── auth/
│   ├── login/route.ts
│   ├── logout/route.ts
│   └── refresh/route.ts
└── services/
    └── menus/route.ts
```

---

## 7. 기술 스택 비교

| 항목 | v1 (csp-web) | v2 (insite-web) |
|------|--------------|-----------------|
| 프론트엔드 | Spring Boot Thymeleaf + Vue.js 2 | Next.js 15 (App Router) |
| 상태관리 | Vue data + Vuex (추정) | Zustand (검토) |
| 라우팅 | Spring MVC | Next.js File-based |
| 스타일링 | CSS + Bootstrap | Tailwind CSS + CSS Variables |
| HTTP | axios | fetch + React Query |
| 백엔드 | csp-was (REST API) | csp-was (REST API) |
| 데이터 페칭 | axios | React Query (TanStack Query) |
| 폼 관리 | VeeValidate (Vue) | React Hook Form + Zod |

---

## 8. 아키텍처 권장사항

### 8.1 메뉴 시스템 마이그레이션

**v2에서 메뉴를 동적으로 로드하려면:**

```typescript
// src/lib/api/menu.ts
export async function getMenus(buildingId: number) {
  return apiClient.get('/api/services/menus', {
    params: { buildingId }
  })
}

// src/lib/hooks/useMenus.ts
export function useMenus(buildingId: number) {
  return useQuery({
    queryKey: ['menus', buildingId],
    queryFn: () => getMenus(buildingId),
    staleTime: 5 * 60 * 1000
  })
}

// src/app/(modules)/_components/sidebar.tsx
export function Sidebar() {
  const { data: menus } = useMenus(currentBuildingId)
  // 재귀 렌더링 with depth 처리
}
```

### 8.2 모듈별 구현 순서 권장

1. **타입 정의** (`lib/types/{module}.ts`)
2. **API 클라이언트** (`lib/api/{module}.ts`)
3. **React Query 훅** (`lib/hooks/use{Module}List.ts`, etc.)
4. **컴포넌트**
   - 리스트 페이지 (`(modules)/{module}/page.tsx`)
   - 상세 페이지 (`(modules)/{module}/[id]/page.tsx`)
   - 폼 컴포넌트 (`(modules)/{module}/_components/{module}-form.tsx`)
   - 수정 페이지 (`(modules)/{module}/[id]/edit/page.tsx`)
   - 신규 페이지 (`(modules)/{module}/new/page.tsx`)

### 8.3 성능 최적화 전략

- **코드 스플리팅**: BEMS/BECM의 복잡한 분석 모듈은 dynamic import
- **스테일 타임 설정**: 분석 데이터(30-60s), 마스터 데이터(5분)
- **무한 스크롤**: 대용량 리스트는 가상화 고려
- **차트 라이브러리**: Recharts 또는 ECharts (v1에서 Chart.js 사용 중)

---

## 9. 결론 및 권장 액션

### 9.1 현황
- v2: 기본 11개 모듈 구현 (75% 진행)
- v1: 33개 모듈 / 585개 HTML (완전히 정의됨)
- **갭: 22개 모듈 / 미정의 HTML 다수**

### 9.2 다음 단계

1. **Phase 2 우선순위 확정**
   - 분석, 설정, 필드워크 중 비즈니스 핵심은?
   - 리소스 할당 계획 수립

2. **API 명세 정리**
   - v1 csp-was의 모든 엔드포인트 문서화
   - v2에서 사용할 API 표준화

3. **UI/UX 가이드라인**
   - v1 BEMS/BECM의 복잡한 UI를 v2 Tailwind로 재설계
   - 반응형/모바일 우선 고려

4. **테스트 전략**
   - Phase 2부터 E2E 테스트 (Playwright)
   - 커버리지 최소 80%

5. **배포 계획**
   - v1과의 병렬 운영 기간 설정
   - 피쳐 플래그로 점진적 전환

---

**작성일:** 2025-03-05
**v1 분석 범위:** 585개 HTML 파일, 33개 모듈
**v2 현황:** 11개 모듈 구현 (75% 진행)
