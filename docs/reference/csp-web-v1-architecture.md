# csp-web (v1) 아키텍처 상세 분석

> **목적**: csp-web 전체 구조의 단일 참조 문서 (마이그레이션, 디버깅, API 매핑용)
> **대상**: AI 에이전트, 개발자
> **분석일**: 2026-03-25
> **소스**: `/Volumes/jinseok-SSD-1tb/00_insite/csp-web/`

---

## 이 문서 사용법 (AI 에이전트 가이드)

```
필요한 정보                            → 참조 섹션
────────────────────────────────────────────────────
v1 전체 구조 파악                      → "1. 프로젝트 개요"
특정 모듈의 컨트롤러/URL 확인          → "4. 컨트롤러 전체 목록"
API 호출 패턴 이해                     → "8. API 호출 패턴"
인증/보안 로직 확인                    → "7. 인증 & 보안"
Vue 컴포넌트 목록                      → "6. Vue.js 프론트엔드"
CSS/SCSS 구조                          → "10. CSS/SCSS 구조"
Thymeleaf 템플릿 매핑                  → "5. Thymeleaf 템플릿"
실시간 기능 (SSE/WebSocket)            → "11. 실시간 기능"
v1→v2 패턴 매핑                        → v1-migration-reference.md
```

---

## 1. 프로젝트 개요

| 항목 | 값 |
|------|-----|
| 프로젝트명 | csp-web (BEMS/FMS 빌딩 관리 시스템 v1) |
| 아키텍처 | BFF (Backend For Frontend) |
| 백엔드 | Spring Boot 2.6.2 + Spring Security + JPA |
| 템플릿 | Thymeleaf (SSR) |
| 프론트엔드 | Vue.js 2.x + jQuery + Bootstrap 4.x |
| 빌드 | Gradle |
| DB | PostgreSQL (JPA + QueryDSL 5.0.0) |
| 인증 | JWT (JJWT 0.11.5, httpOnly 쿠키) |
| 메시징 | RabbitMQ (분산 캐시 동기화) |
| 실시간 | STOMP over SockJS (WebSocket) |
| 배포 | Docker (OpenJDK 11) |

### 프로젝트 디렉토리 구조

```
csp-web/
├── build.gradle                       # Spring Boot 2.6.2
├── Dockerfile                         # OpenJDK 11
├── src/main/
│   ├── java/hdclabs/cspweb/
│   │   ├── CspWebApplication.java
│   │   ├── controller/                # 34개 컨트롤러
│   │   ├── service/                   # 7개 서비스
│   │   ├── component/                 # TokenProvider, Utils
│   │   ├── config/                    # Security, WebClient, Cache
│   │   ├── filter/                    # JwtFilter, RequestHeader
│   │   ├── handler/                   # 예외 처리
│   │   ├── model/                     # Entity, DTO, VO, Enum (36개)
│   │   ├── event/                     # RabbitMQ 이벤트
│   │   └── exception/
│   └── resources/
│       ├── templates/                 # 33개 모듈, 595개 HTML
│       ├── static/
│       │   ├── dist/js/               # Vue.js, 공통 JS
│       │   ├── dist/stylesheet/       # CSS/SCSS (154개)
│       │   ├── dist/image/            # 이미지 (118개)
│       │   └── plugins/               # 21개 외부 라이브러리
│       └── application*.properties    # 8개 환경별 설정
├── field/                             # 현장작업 API 스펙 문서
└── docs/                              # 스케줄/분석 문서
```

---

## 2. 환경별 설정

### application.properties 프로파일

| 환경 | 파일 | 포트 | DB | JWT 만료 | 백엔드 |
|------|------|------|-----|---------|--------|
| local | application-local.properties | 8080 | localhost:5432 | 3600초 | localhost:8081 |
| dev | application-dev.properties | 8080 | 192.168.20.71:5432 | 1800초 | 121.133.17.22:8081 |
| stg | application-stg.properties | 8080 | (스테이징 DB) | - | (스테이징 API) |
| prd | application-prd.properties | 8080 | RDS Aurora | 900초 | hdc-insite.com:8081 |
| ecosian | application-ecosian.properties | 8080 | (에코시안 DB) | - | (에코시안 API) |

### 도메인 구성 (application.properties)

| 키 | 용도 | dev 값 |
|----|------|--------|
| `front.domain` | csp-web 자체 | http://localhost:8080 |
| `backend.domain` | csp-was REST API | http://121.133.17.22:8081 |
| `api.bems.domain` | BEMS 에너지 API | http://121.133.17.22:8086 |
| `api.insite.domain` | insite-web API | http://121.133.17.22:8085 |
| `api.report.domain` | 보고서 서비스 | http://121.133.17.22:8084 |

### JWT 설정

```properties
jwt.header=Authorization
jwt.secret=nbolyvkwmnwipmqkbrnhgmspkwaxza3snemqxbg6tgahhakmyfvovxhtpzzgtdgryfhofiguw
jwt.token-validity-in-seconds=3600
jwt.cookie.name=jwt-token
```

---

## 3. Gradle 의존성

### 핵심 의존성

| 라이브러리 | 버전 | 용도 |
|-----------|------|------|
| spring-boot-starter-web | 2.6.2 | MVC |
| spring-boot-starter-thymeleaf | 2.6.2 | SSR 템플릿 |
| spring-boot-starter-security | 2.6.2 | 보안 |
| spring-boot-starter-data-jpa | 2.6.2 | ORM |
| spring-boot-starter-webflux | 2.6.2 | 비동기 HTTP (WebClient) |
| spring-boot-starter-actuator | 2.6.2 | 모니터링 |
| spring-boot-starter-amqp | 2.6.2 | RabbitMQ |
| querydsl-jpa | 5.0.0 | 타입 안전 쿼리 |
| jjwt-api/impl/jackson | 0.11.5 | JWT 토큰 |
| postgresql | (런타임) | DB |
| apache-poi | 5.0.0 | Excel |

---

## 4. 컨트롤러 전체 목록

### 4.1 페이지 렌더링 컨트롤러 (@Controller)

| 컨트롤러 | 패키지 | URL 매핑 | 주요 페이지 |
|----------|--------|---------|------------|
| **AccountController** | controller | `/account/*` | login, idFind, passwordChange 모달 |
| **MainController** | controller | `/` | → redirect:/main/index |
| **CommonController** | controller | `/common/*` | index, searchMenu, editorPreview, error/{code} |
| **WorkOrderController** | controller | `/workOrder/*` | orderList, orderAdd, orderEdit, orderView, orderResult |
| **FacilityController** | controller | `/facility/*` | facilityList, facilityView, facilityAdd, facilityEdit |
| **FieldWorkController** | controller | `/fieldwork/*` | projectList, taskList, workerList |
| **DashboardController** | controller | `/dashboard/*` | MAIN, FMS, NCP, RMS, BIM, SENSOR 대시보드 |
| **BoardController** | controller | `/board/*` | noticeList, noticeView, dataList, dataView |
| **SiteController** | controller | `/site/*` | buildingList, buildingView, buildingAdd, buildingEdit |
| **UserController** | controller | `/user/*` | userList, userView, roleList, roleView |
| **SettingController** | controller | `/setting/*` | baseCodeList, facilityCategoryList, 설정 |
| **PatrolController** | controller | `/patrol/*` | patrolList, patrolView, patrolTeamList |
| **ReportController** | controller | `/report/*` | reportWeekList, reportMonthList |
| **AnalysisController** | controller | `/analysis/*` | fmsTeam, fmsLabor, trendRMSView |
| **ServiceController** | controller | `/service/*` | rmsList, cleaningBimView, cleaningDataList |
| **SensorController** | controller | `/sensor/*` | sensorList, sensorView, sensorEdit, manufacturerList |
| **ClientController** | controller | `/client/*` | clientList, clientView, clientAdd, clientEdit |
| **MaterialController** | controller | `/material/*` | materialInfoList, materialInfoAdd |
| **InvoiceController** | controller | `/invoice/*` | serviceChargeList, billList |
| **LicenseController** | controller | `/license/*` | licenseList, licenseView, licenseAdd |
| **TagController** | controller | `/tag/*` | tagList, tagView, tagCreateNFCQR |
| **NfcRoundController** | controller | `/nfc/*` | nfcRoundList, nfcRoundAdd |
| **TaskController** | controller | `/task/*` | taskList, confirmTaskList |
| **MobileController** | controller | `/m/*` | mobileFieldworkHome, mobileWorkOrderList |
| **PersonalWorkOrderController** | controller | `/personal/*` | orderList, orderView, orderEdit |
| **MypageController** | controller | `/mypage/*` | 마이페이지 |
| **DutyTypeController** | controller | `/duty/*` | 근무 유형 |
| **ControlController** | controller | `/control/*` | 제어 |
| **TemporaryWorkerController** | controller | `/temporary/*` | 임시 근로자 |
| **SupportController** | controller | `/support/*` | 지원 |
| **PrivacyController** | controller | `/privacy/*` | policyView |

### 4.2 REST 컨트롤러 (@RestController)

| 컨트롤러 | URL | 용도 |
|----------|-----|------|
| **GuestController** | `/guest` | GET → 302 리다이렉트 |
| **CacheAdminController** | `/admin/caches?type=evict` | POST → 캐시 무효화 |
| **ExcelDownloadController** | (동적) | Excel 파일 다운로드 |
| **FieldWorkController** | `/fieldwork/api/*` | RESTful CRUD (프로젝트/작업) |

### 4.3 컨트롤러 코드 패턴

```java
@Controller
@Slf4j
@RequiredArgsConstructor
public class WorkOrderController {

    @GetMapping("/workOrder/orderList")
    public String orderList(Model model) {
        // Enum 목록을 Model에 주입 → Thymeleaf에서 Vue data로 전달
        model.addAttribute("workOrderStateList",
            new ArrayList<>(EnumSet.allOf(WorkOrderState.class)));
        return "workOrder/orderList";  // → templates/workOrder/orderList.html
    }

    @GetMapping("/workOrder/orderView/{id}")
    public String orderView(@PathVariable Long id, Model model) {
        model.addAttribute("id", id);
        return "workOrder/orderView";
    }
}
```

---

## 5. Thymeleaf 템플릿 (33개 모듈, 595개 HTML)

### 5.1 레이아웃 구조

```
templates/layout/
├── common/
│   ├── head.html              # <head> — CSS, 메타태그
│   ├── script.html            # JS 라이브러리 로드, GA4, Clarity 추적
│   ├── header.html            # 상단 네비게이션 바
│   ├── navigator.html         # 좌측 사이드바 네비게이션
│   ├── page-header.html       # 페이지 제목 영역
│   ├── modal.html             # 공용 모달 정의
│   ├── bottom.html            # 푸터 영역
│   ├── loader.html            # 로딩 스피너
│   └── preloader.html         # 전체 페이지 프리로더
├── menu/
│   ├── listPage.html          # 목록 페이지 레이아웃
│   └── addPage.html           # 등록/수정 페이지 레이아웃
└── modal.html
```

### 5.2 페이지 템플릿 구조

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head th:replace="layout/common/head :: load()"></head>
<body>
  <nav th:replace="layout/common/header :: load()"></nav>
  <aside th:replace="layout/common/navigator :: load()"></aside>
  <main id="app">
    <div th:replace="layout/common/page-header :: load()"></div>
    <div class="content-list">
      <!-- Vue.js 컴포넌트 영역 -->
    </div>
  </main>
  <script th:replace="layout/common/script :: load()"></script>
  <script>
    // Vue 인스턴스 생성
    new Vue({
      el: '#app',
      data: Object.assign({}, vueData, { /* 페이지 고유 데이터 */ }),
      methods: Object.assign({}, vueMethods, { /* 페이지 고유 메서드 */ }),
      mounted() { this.goPaging(); }
    });
  </script>
</body>
</html>
```

### 5.3 모듈별 템플릿 파일 수

| 모듈 | 파일 수 | 주요 페이지 |
|------|--------|------------|
| common (공용 위젯) | 110 | widget1~105, pagination, imageUploader |
| bems | 85 | 에너지 계획, 설비, 기준선, 냉각 분석 |
| becm | 64 | 대시보드, 에너지 장비, 노드 편집 |
| workOrder | 46 | orderList/Add/Edit/View, 청구, SOP, 템플릿 |
| service | 38 | 청소, 근무, 달력, 장치 관리 |
| fieldwork | 26 | 프로젝트, 작업, 작업자 |
| setting | 22 | 기초코드, 카테고리, 설정 |
| site | 19 | 건물, 층, 구역 |
| analysis | 18 | FMS/RMS 분석, 트렌드 |
| facility | 15 | 시설 CRUD, 이력, 제어점, 신호, Excel |
| report | 14 | 주간/월간 보고서 |
| layout | 12 | 공통 레이아웃 |
| user | 11 | 사용자, 역할, 권한 |
| mobile | 11 | 모바일 랜딩, 홈, 작업 |
| sensor | 10 | 센서, 제조사 |
| patrol | 10 | 순찰 계획, 팀 |
| nfc | 8 | NFC 순찰 라운드 |
| board | 8 | 공지사항, 자료실 |
| 기타 (15개 모듈) | ~60 | 태그, 재료, 클라이언트, 송장, 라이선스 등 |

---

## 6. Vue.js 프론트엔드

### 6.1 프론트엔드 라이브러리 목록

| 라이브러리 | 버전 | 용도 |
|-----------|------|------|
| Vue.js | 2.x | 클라이언트 프레임워크 |
| jQuery | - | DOM 조작, 이전 호환성 |
| jQuery UI | 1.11.4 | datepicker, sortable |
| Bootstrap | 4.x | CSS 프레임워크 |
| Axios | - | HTTP 클라이언트 |
| Moment.js | - | 날짜/시간 |
| Chart.js | - | 차트 |
| ApexCharts | - | 고급 차트 |
| DOMPurify | - | HTML 새니타이제이션 |
| Summernote (bs4) | - | WYSIWYG 에디터 |
| Toastr | - | 토스트 알림 |
| Vee-Validate | - | Vue 폼 검증 |
| dhtmlx Suite | 7.2.3 | 그리드, 스케줄러, 계산기 |
| dhtmlx Spreadsheet | 4.1.2 | 스프레드시트 |
| dhtmlx Scheduler | 6.0.0 Ultimate | 일정 관리 |
| Hoops (BIM Viewer) | - | 3D BIM 모델 뷰어 |
| Kakao Maps API | v2 | 지도 (클러스터링) |
| Lodash | - | 유틸리티 |
| jsPDF | 2.5.1 | PDF 생성 |
| XLSX | - | Excel 처리 |
| printThis | - | 인쇄 |
| jQuery minicolors | - | 컬러 피커 |

### 6.2 주요 JS 파일

| 파일 | 경로 | 역할 |
|------|------|------|
| vueCommon.js | static/dist/js/ | 공통 데이터/메서드 (페이징, 검색, 정렬) |
| vueBemsCommon.js | static/dist/js/ | BEMS 모듈 공통 |
| vueWidget.js | static/dist/js/ | 대시보드 위젯 초기화 |
| eModal.js | static/dist/js/ | 모달 라이브러리 |
| guestApiHelper.js | static/dist/js/ | 게스트 API 헬퍼 |
| websocketClient.js | static/dist/js/fieldwork/ | STOMP WebSocket 클라이언트 |
| fieldworkCommon.js | static/dist/js/fieldwork/ | 현장작업 공통 |
| ajax.js | static/plugins/common/ | Axios HTTP 래퍼 (일반 API) |
| ajaxBems.js | static/plugins/common/ | BEMS 전용 Ajax 래퍼 |

### 6.3 vueCommon.js — 공통 데이터/메서드

```javascript
// 공유 데이터 (모든 페이지에서 상속)
const vueData = {
  p: {                          // 페이지네이션 정보
    content: [],
    pageable: { pageNumber: 0, pageSize: 20 },
    totalElements: 0,
    totalPages: 1
  },
  searchListUri: "",            // API 엔드포인트
  searchVo: {},                 // 검색 조건
  searchVoForReset: {},         // 초기화용 복사본
  pageSearchVo: {},             // 페이지별 검색 조건
  pageSizeList: [10, 20, 50, 100]
};

// 공유 메서드
const vueMethods = {
  goPaging()           // 목록 API 호출 → 페이지 렌더링
  goSearch()           // 검색 실행 (1페이지로 이동)
  searchPagingList(uri)        // 검색+페이징 조합 호출
  searchForSort(sortField)     // 정렬 변경
  goFirstPage() / goNextPage() / goLastPage()
  cloneSearchVo()              // 검색 조건 복제 (리셋용)
  restoreSearchVo()            // sessionStorage에서 복원
  setCompanyByIdAndName()      // 회사 정보 설정
};
```

### 6.4 Vue 마운트 패턴

```javascript
// 각 Thymeleaf 페이지 하단에서 Vue 인스턴스 생성
new Vue({
  el: '#app',
  data: Object.assign({}, vueData, {
    // 페이지 고유 데이터
    workOrderStateList: /*[[${workOrderStateList}]]*/ [],  // Thymeleaf → Vue
    selectedId: 0
  }),
  methods: Object.assign({}, vueMethods, {
    // 페이지 고유 메서드
    onRowClick(item) { /* ... */ }
  }),
  mounted() {
    this.searchListUri = backendUrl('/api/workorder/v1/list');
    this.goPaging();
  }
});
```

---

## 7. 인증 & 보안

### 7.1 SecurityConfig.java

```
세션 정책: STATELESS (JWT 기반)
CSRF: /admin/** POST 제외
CORS: CorsFilterConfig 별도 적용

허용 경로 (permitAll):
  /error/**, /dist/**, /plugins/**, /templates/error/**
  /account/login, /account/idFind, /privacy/policyView
  /m/** (모바일)
  /guest/**
  /fieldwork/**

관리자 전용:
  /admin/** (GET/POST) → ROLE_SYSTEM_ADMIN
  /actuator/** (GET) → ROLE_SYSTEM_ADMIN

나머지: authenticated()
```

### 7.2 JwtFilter.java — 토큰 검증 흐름

```
1. 요청 URI 확인
2. 인증 제외 경로 스킵: /dist/, /account/login, /plugins/, /error, /fieldwork, /m/
3. /actuator → Authorization 헤더에서 토큰 추출 (쿠키 fallback)
4. 나머지 → jwt-token 쿠키에서 추출
5. validateToken() → getAuthentication() → SecurityContext 저장
```

### 7.3 TokenProvider.java — JWT 유틸리티

```java
// AuthVO 구조 (JWT Claims에서 추출)
@Data
public class AuthVO {
    long accountId;              // 계정 ID
    String userId;               // 사용자명
    String accountName;          // 사용자명
    long currentBuildingId;      // 현재 빌딩 ID
    String currentBuildingName;  // 현재 빌딩명
    List<String> userRoles;      // 역할 (ROLE_SYSTEM_ADMIN 등)
    List<Integer> userBuildingIds; // 할당된 빌딩 목록
    boolean viewAllBuildings;    // 전체 건물 보기 권한
}

// 주요 메서드
getAuthentication(token)    // JWT → Spring Security Authentication
validateToken(token)        // 토큰 유효성 검증
getCookieValue(request)     // 쿠키에서 jwt-token 추출
getAuthVO(token)            // 토큰 → AuthVO 변환
extendExpiration(token)     // 토큰 만료 연장
createGuestToken()          // 게스트 토큰 생성
```

### 7.4 역할 체계

| 역할 코드 | 설명 |
|-----------|------|
| ROLE_SYSTEM_ADMIN | 시스템 관리자 |
| ROLE_LABS_SYSTEM_ADMIN | 본사 관리자 |
| ROLE_LABS_SITE_ADMIN | 사이트 관리자 |
| 기타 업무 역할 | RMS, BIM, FMS 등 |

---

## 8. API 호출 패턴

### 8.1 URL 생성 (Thymeleaf → JavaScript)

```javascript
// layout/common/script.html에서 선언
const backend = /*[[${@environment.getProperty('backend.domain')}]]*/ "";
const apiBems = /*[[${@environment.getProperty('api.bems.domain')}]]*/ "";
const apiInsite = /*[[${@environment.getProperty('api.insite.domain')}]]*/ "";

const backendUrl = function(uri) { return backend + uri; };
const apiBemsUrl = function(uri) { return apiBems + uri; };
const apiInsiteUrl = function(uri) { return apiInsite + uri; };
```

### 8.2 Axios 래퍼 함수 (ajax.js)

```javascript
// 일반 API (csp-was 경유)
axiosApiGet(url, params, doneFn, failFn, isShowLoader, isShowMessage)
axiosApiPost(url, jsonData, doneFn, failFn, isShowLoader, isShowMessage)
axiosApiPut(url, jsonData, doneFn, failFn, isShowLoader, isShowMessage)
axiosApiDelete(url, params, doneFn, failFn, isShowLoader, isShowMessage)
axiosApiFormData(url, formData, doneFn, failFn, isShowLoader, isShowMessage)
axiosApiGetWithHeader(url, params, headers, doneFn, failFn)

// BEMS API (직접 호출)
axiosBemsApiGet(url, params, doneFn, failFn, isShowLoader, isShowMessage)
axiosBemsApiPost(url, jsonData, doneFn, failFn, isShowLoader, isShowMessage)
axiosBemsApiPut(url, jsonData, doneFn, failFn, isShowLoader, isShowMessage)
axiosBemsApiDelete(url, params, doneFn, failFn, isShowLoader, isShowMessage)

// Insite API (직접 호출)
axiosInsiteApiGet(url, params, doneFn, failFn, isShowLoader, isShowMessage)
axiosInsiteApiPost(url, jsonData, doneFn, failFn, isShowLoader, isShowMessage)
axiosInsiteApiPut(url, jsonData, doneFn, failFn, isShowLoader, isShowMessage)
```

### 8.3 요청 헤더 자동 주입

```javascript
const axiosHeaders = function() {
  let authToken = getCookie("jwt-token");
  let headers = {};
  if (authToken != "") {
    headers["Authorization"] = "Bearer " + authToken;
  }
  headers["pageInfoId"] = currentPageInfoId || 0;
  return headers;
};
```

**자동 주입 헤더:**
- `Authorization: Bearer {jwt-token}` — 인증
- `pageInfoId: {currentPageInfoId}` — 페이지 권한 추적

### 8.4 응답 처리 (axiosApiDone)

```javascript
// authToken 갱신
if (res.data.authToken) {
  setCookie("jwt-token", res.data.authToken, accessTokenValidityInSeconds);
}

// 응답 코드별 처리
switch(res.data.code) {
  case "success": toastr.success(res.data.message); break;
  case "E00401": logout(); break;  // 토큰 만료
  case "E00403": logout(); break;  // 권한 부족
  default: toastr.error(res.data.message);
}
```

### 8.5 HTTP 상태 코드별 처리

| 상태코드 | 처리 |
|---------|------|
| 401 | 로그인 페이지 리다이렉트 (3초 후) |
| 403 | /error/403 리다이렉트 |
| 404 | "유효하지 않은 URL입니다" 에러 |
| 412 | "사용자 정보가 없습니다" + 로그아웃 |
| 500 | 서버 에러 알림 |

### 8.6 주요 API 엔드포인트 패턴

**작업지시 (WorkOrder)**:
```
GET  /api/workorder/v1/list?buildingId=123&page=0&size=20
GET  /api/workorder/v1/view/{id}
POST /api/workorder/v1/add
PUT  /api/workorder/v1/update
DELETE /api/workorder/v1/{id}
```

**시설 (Facility)**:
```
GET  /api/facility/v1/list
GET  /api/facility/v1/{id}
POST /api/facility/v1/add
PUT  /api/facility/v1/update
```

**현장작업 (FieldWork, RESTful)**:
```
GET    /api/field/projects
GET    /api/field/projects/{id}
POST   /api/field/projects
PUT    /api/field/projects/{id}
DELETE /api/field/projects/{id}
GET    /api/field/work-orders/search
```

**건물 (Building)**:
```
GET  /api/building/v1/list
GET  /api/building/v1/{id}
```

---

## 9. 백엔드 내부 구조

### 9.1 서비스 레이어

| 서비스 | 역할 |
|--------|------|
| DashboardService | 대시보드 위젯 데이터 |
| MenuService | 메뉴 캐싱 & 제공 |
| PageInfoService | 페이지 정보 조회 |
| RoleService | 역할 & 권한 |
| SettingService | 기초코드, 설정값 |
| CachingService | 캐시 관리 |

### 9.2 WebClient (비동기 HTTP → csp-was)

```java
// WebClientConfig.java
WebClient webClient(ReactorResourceFactory resourceFactory) {
    HttpClient httpClient = HttpClient.create()
        .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 5000)
        .responseTimeout(Duration.ofMillis(10000));

    return WebClient.builder()
        .filter(errorHandlingFilter())
        .filter(addRequestHeadersFromContext())  // ThreadLocal 헤더 자동 주입
        .build();
}
```

### 9.3 RequestHeaderContextHolder (ThreadLocal 헤더)

```java
// buildingId, JWT 토큰 등을 ThreadLocal로 자동 주입
public class RequestHeaderContextHolder {
    private static final ThreadLocal<Map<String, String>> contextMap = ...
    // WebClient 필터에서 자동으로 헤더에 추가
}
```

### 9.4 주요 Enum (36개)

| Enum | 값 | 용도 |
|------|-----|------|
| WorkOrderState | WRITE, ISSUE, PROCESSING, REQ_COMPLETE, COMPLETE, CANCEL | 주문 상태 |
| WorkOrderType | SPOT, PERIOD | 주문 타입 |
| FacilityState | BEFORE_CONSTRUCT, ONGOING_CONSTRUCT, END_CONSTRUCT, BEFORE_OPERATING, ONGOING_OPERATING, END_OPERATING, DISCARD, NOW_CHECK | 시설 상태 |
| AccountState | NORMAL, SUSPENDED | 계정 상태 |
| SensorStatus | (센서 상태값) | 센서 |
| DashboardType | MAIN, FMS, NCP, RMS, BIM, SENSOR | 대시보드 타입 |
| NfcRoundState | (NFC 순찰 상태) | NFC |
| CleanWorkType | (청소 작업 타입) | 청소 |
| ApprovalType | (승인 타입) | 승인 |
| (기타 27개) | ... | ... |

### 9.5 Entity 구조

**핵심 테이블:**
- Menu, RoleMenu, PageInfo, Role — 메뉴/권한
- Account, User — 사용자
- Building, Facility, Zone — 건물/시설
- WorkOrder, WorkOrderItem — 작업지시
- Dashboard, DashboardWidget — 대시보드
- ProjectInfo, JobType, FloorType — 프로젝트

---

## 10. CSS/SCSS 구조 (154개 파일)

### 10.1 메인 스타일

| 파일 | 크기 | 용도 |
|------|------|------|
| style.css | 418KB | 컴파일된 메인 CSS |
| style.scss | 2KB | SCSS 진입점 |
| style-duty.css | 59KB | 근무 관리 전용 |
| style-ecosian.css | 12KB | 에코시안 테마 오버라이드 |
| style-menu.css | 9KB | 메뉴 커스텀 |
| style-sensor.css | 1.5KB | 센서 표시 |

### 10.2 SCSS 컴포넌트 분류

```
dist/stylesheet/
├── component/ (23개)        # 아코디언, 배지, 버튼, 차트, 칩, 날짜피커,
│   │                        # dhx 리셋, 드롭다운, 이미지, 리스트, 로더,
│   │                        # 맵, 페이지네이션, 롤링, 탭, 테이블, 토스트
│   └── modals/ (9개)        # 기본/청소/사용자설정/위젯/에디터/이미지/인쇄 모달
├── customize/ (4개)          # 색상변수, 리셋, 스크롤, 타이포그래피
│   └── icons/               # 아이콘 폰트 (icon-base, icon-bim, icon-support)
│       └── fonts/           # Pretendard, Rajdhani, SpoqaHanSansNeo, SUIT
├── dashboard/widget/ (38개)  # widget1~38 위젯별 스타일
├── form/ (6개)              # 파일, 폼컴포넌트, 입력, 셀렉트
├── layout/ (9개)            # 브레이크포인트, 컨테이너, 그림자, 헤더, 네비, 패널
├── page/ (9개)              # 계정, 콘텐츠, 대시보드설정, 에러, 정보, 검색
└── utilities/ (13개)         # 배경, 테두리, 커서, display, opacity, overflow,
                              # position, sizing, spacing, vertical-align, z-index
```

### 10.3 폰트

| 폰트 | 용도 |
|------|------|
| Pretendard | 한글 기본 |
| SpoqaHanSansNeo | 한글 대안 |
| SUIT | SUIT 폰트 |
| Rajdhani | 숫자/영문 |
| Material Icons (CDN) | 아이콘 |

---

## 11. 실시간 기능

### 11.1 WebSocket (STOMP over SockJS)

**websocketClient.js:**
```javascript
class FieldWorkWebSocketClient {
  connect(projectId, onConnectCallback, onErrorCallback) {
    this.socket = new SockJS('/ws');
    this.stompClient = Stomp.over(this.socket);
    this.stompClient.connect({}, onConnect, onError);
  }

  subscribe(destination, callback) {
    this.subscriptions[destination] =
      this.stompClient.subscribe(destination, callback);
  }
}
```

**특징:**
- STOMP 프로토콜 + SockJS 폴백
- 5회 재연결 시도 (3초 간격)
- Heartbeat 유지
- 용도: 현장 프로젝트 실시간 업데이트, 작업 상태 변경 알림

### 11.2 RabbitMQ 메시징

```java
// 캐시 무효화 메시지 발행/구독
RabbitCacheEvictionProducer  // 캐시 무효화 메시지 발행
RabbitMessageListener        // 메시지 수신 & 처리
```

**용도:** 여러 인스턴스 간 캐시 동기화 (메뉴, 권한)

---

## 12. 파일 업로드/다운로드

### 12.1 Excel 다운로드

- ExcelDownloadController (@RestController)
- ExcelDownloadService (Apache POI 5.0.0)
- ExcelDTO, ExcelColumn 기반 동적 시트

### 12.2 파일 업로드

```properties
spring.servlet.multipart.maxFileSize=10MB
system.path.upload=/var/opt/admin-upload
cloud.aws.s3.baseUrl.image=https://s3-bucket.amazonaws.com/images/
```

### 12.3 이미지 업로더

- `templates/common/imageUploader3.html` — 이미지 업로드 컴포넌트
- AWS S3 저장소 연동

---

## 13. 분석/추적 시스템

### 13.1 Google Analytics 4

- 추적 ID: `G-N76FD7Z42G`
- 커스텀 속성: accountId, userId, userRole, buildingId, buildingName
- 이벤트: page_view, page_exit (체류시간), scroll_depth (25/50/75/100%)
- IP 추적 (쿠키 저장)

### 13.2 Microsoft Clarity

- 조건부 활성화 (`clarity.enabled`)
- 사용자 행동 세션 기록/재생, 힛맵

---

## 14. 외부 CDN 리소스

| 리소스 | 용도 |
|--------|------|
| `fonts.googleapis.com/icon?family=Material+Icons` | Material Icons |
| `dapi.kakao.com/v2/maps/sdk.js` | 카카오 지도 |
| `cdn.jsdelivr.net/npm/event-source-polyfill` | EventSource 폴리필 |
| `cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js` | PDF |
| `api.ipify.org?format=json` | IP 주소 조회 |

---

## 15. 캐시 & 성능

### 캐시 설정

- Spring Cache (메모리)
- @Cacheable / @CacheEvict
- RabbitMQ 분산 무효화
- 캐시 대상: Menu, RoleMenu, ConfigGroup

### QueryDSL

```java
QWorkOrder workOrder = QWorkOrder.workOrder;
queryFactory
    .selectFrom(workOrder)
    .where(workOrder.buildingId.eq(buildingId))
    .orderBy(workOrder.id.desc())
    .fetch();
```

---

## 16. v1 → v2 주요 매핑 요약

| v1 (csp-web) | v2 (insite-web) |
|-------------|-----------------|
| Spring Boot BFF | Next.js 15 App Router |
| Thymeleaf SSR | React Server/Client Components |
| Vue.js 2.x | React 18 + Hooks |
| jQuery + Bootstrap 4 | shadcn/ui + Tailwind CSS |
| vueCommon.js (데이터/메서드) | React Query + Zustand |
| axiosApiGet/Post | apiClient (자동 buildingId 주입) |
| jwt-token 쿠키 | auth-token httpOnly 쿠키 |
| sessionStorage 검색 상태 | nuqs URL 상태 관리 |
| Toastr | Sonner toast |
| eModal.js | AlertDialog (shadcn/ui) |
| Summernote WYSIWYG | TipTap 또는 유사 라이브러리 |
| dhtmlx Scheduler | FullCalendar 또는 React 대안 |
| Chart.js + ApexCharts | Recharts |
| STOMP WebSocket | EventSource (SSE) 또는 native WebSocket |
| jQuery UI datepicker | DatePicker (shadcn/ui) |
| Bootstrap 페이지네이션 | DataTable 내장 페이지네이션 |

---

## 17. 주요 파일 경로 (절대)

| 파일 | 경로 |
|------|------|
| Spring Security | `csp-web/src/main/java/hdclabs/cspweb/config/SecurityConfig.java` |
| JWT 필터 | `csp-web/src/main/java/hdclabs/cspweb/filter/JwtFilter.java` |
| 토큰 프로바이더 | `csp-web/src/main/java/hdclabs/cspweb/component/TokenProvider.java` |
| Axios 래퍼 | `csp-web/src/main/resources/static/plugins/common/ajax.js` |
| BEMS Axios | `csp-web/src/main/resources/static/plugins/common/ajaxBems.js` |
| Vue 공통 | `csp-web/src/main/resources/static/dist/js/vueCommon.js` |
| 레이아웃 스크립트 | `csp-web/src/main/resources/templates/layout/common/script.html` |
| WebSocket | `csp-web/src/main/resources/static/dist/js/fieldwork/websocketClient.js` |
| 개발 설정 | `csp-web/src/main/resources/application-dev.properties` |
| 운영 설정 | `csp-web/src/main/resources/application-prd.properties` |
| 메인 CSS | `csp-web/src/main/resources/static/dist/stylesheet/style.css` |

---

## 부록: 모듈별 전체 기능 목록

### A. 작업지시 (WorkOrder) — 46개 파일

- 주문 목록/추가/수정/상세/결과
- 주문 항목 추가/수정
- SOP (표준작업절차)
- 템플릿 관리
- 메시지 히스토리
- 청구 관리

### B. 시설 (Facility) — 15개 파일

- 시설 목록/상세/등록/수정
- 이력 관리
- 제어점 관리
- 신호 관리
- RMS 인식 설정
- Excel 업로드

### C. BEMS — 85개 파일

- 에너지 계획/분석
- 설비 빌 관리
- 기준선 설정
- 부하 계산
- 냉각수 성능 분석
- 냉동기 성능 추적
- 예측 모델 (IPLV, 응축기)
- 에너지 장비 노드 편집

### D. BECM — 64개 파일

- 분석/성능 모니터링
- 대시보드
- 에너지 장비 관리

### E. 서비스 (Service) — 38개 파일

- 청소 관리 (데이터, 비교, 상수, 유틸)
- 근무 관리 (일일, 월별)
- 근무 매핑/조정
- 달력 기반 일정
- 장치 관리

### F. 현장작업 (FieldWork) — 26개 파일

- 프로젝트 CRUD
- 작업 CRUD
- 작업자 관리
- WebSocket 실시간 업데이트

### G. 설정 (Setting) — 22개 파일

- 기초코드 관리
- 시설 카테고리
- 시스템 설정값

### H. 건물 (Site) — 19개 파일

- 건물 목록/상세/등록/수정
- 층/구역 관리

### I. 분석 (Analysis) — 18개 파일

- FMS 분석 (팀, 노동)
- RMS 분석
- 트렌드 분석

### J. 대시보드 — 110개 위젯

- MAIN 대시보드
- FMS 대시보드
- NCP 대시보드
- RMS 대시보드
- BIM 대시보드
- SENSOR 대시보드
- widget1 ~ widget105

### K. 기타 모듈

- **순찰 (Patrol)**: 계획, 팀, 라운드 (10개)
- **사용자 (User)**: 사용자, 역할, 권한 (11개)
- **게시판 (Board)**: 공지사항, 자료실 (8개)
- **센서 (Sensor)**: 센서, 제조사 (10개)
- **모바일 (Mobile)**: 랜딩, 홈, 작업 (11개)
- **보고서 (Report)**: 주간/월간 (14개)
- **태그 (Tag)**: NFC/QR (4개)
- **NFC 순찰 (NfcRound)**: 라운드 (8개)
- **재료 (Material)**: 재료 정보 (5개)
- **클라이언트 (Client)**: 고객 회사 (4개)
- **송장 (Invoice)**: 요금, 청구 (4개)
- **라이선스 (License)**: 라이선스 관리 (5개)
- **작업 (Task)**: 개인 작업, 확인 (2개)
- **개인 작업지시 (Personal)**: 개인 주문 (4개)
