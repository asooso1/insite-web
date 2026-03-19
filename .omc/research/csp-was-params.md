# csp-was API 파라미터 조사 보고서

> 작성일: 2026-03-19
> 대상: Next.js 마이그레이션 프로젝트 (insite-web)
> 목적: 각 모듈의 API 엔드포인트와 필수 파라미터 식별

---

## 조사 방법

1. `/Volumes/jinseok-SSD-1tb/00_insite/csp-was/src/main/java/hdclabs/cspwas/controller/` 내 컨트롤러 파일 분석
2. `@GetMapping` 메서드 및 `@RequestParam`, `@ModelAttribute` 파라미터 확인
3. VO 클래스 (`SearchDefaultVO` 상속 구조) 필드 검증
4. `required=true` 또는 기본값이 `required` (명시 없음 = true)인 파라미터 식별

---

## 모듈별 API 분석

### 1. 작업지시 (Work Order)

**컨트롤러:** `WorkOrderController.java`
**기본 경로:** `/api/workorder` 또는 `/api/workOrder`

| 엔드포인트 | HTTP | VO/파라미터 | 필수 파라미터 | 비고 |
|----------|------|-----------|------------|------|
| `/api/workOrder/workOrderList` | GET | `SearchWorkOrderVO` | VO 필드 전체 optional | 페이지네이션 포함 (`Pageable`) |
| `/api/workOrder/workOrderStatePerCount` | GET | `SearchWorkOrderVO` | VO 필드 전체 optional | 상태별 건수만 반환 |
| `/api/workOrder/updateMultiApprove` | PUT | `SearchWorkOrderVO` (Body) | `selectedWorkOrderIds` (필수로 추정) | 다중 완료 승인 |
| `/api/workOrder/updateMultiCancel` | PUT | `SearchWorkOrderVO` (Body) | `selectedWorkOrderIds` (필수로 추정) | 다중 작업 취소 |

**SearchWorkOrderVO 필드:**
```java
private long buildingUserGroupId;      // optional
private long accountId;                 // optional
private String termType;                // optional
private String termDateFrom;            // optional
private String termDateTo;              // optional
private String state;                   // optional
private long firstClassId;              // optional (기본값: 0)
private long secondClassId;             // optional (기본값: 0)
private String secondCategoryName;      // optional
private List<Long> selectedWorkOrderIds = new ArrayList<>();  // **다중 작업용 필수**
private String cancelReason;            // optional
private String type = "all";            // optional (기본값: "all")
private String templateId = "all";      // optional (기본값: "all")
private String keyword;                 // optional
private Boolean hasTemplate;            // optional
```

**SearchDefaultVO 상속 필드:**
```java
private long companyId;                 // optional
private long baseAreaId;                // optional
private long buildingId;                // optional (매우 중요!)
private long buildingFloorId;           // optional
private long buildingFloorZoneId;       // optional
private long wideAreaId;                // optional
private String searchCode;              // optional
private String searchKeyword;           // optional
```

**⚠️ 500 에러 위험:**
- `buildingId = 0`일 때 동작 확인 필요
- 목록 조회 시 `buildingId` 미전달 시 데이터 반환 가능성 (건물 미지정)

---

### 2. 시설 (Facility)

**컨트롤러:** `FacilityController.java`

| 엔드포인트 | HTTP | 파라미터 | 필수 | 비고 |
|----------|------|---------|------|------|
| `/api/facility/facilityList/{buildingId}` | GET | PathVariable | `buildingId` | 경로 변수 필수 |
| `/api/facility/facilityList` | GET | `SearchFacilityVO` | buildingId (VO 상속) | 페이지네이션 포함 |
| `/api/facility/facilityNos/{buildingId}` | GET | PathVariable | `buildingId` | 경로 변수 필수 |
| `/api/facility/controlPointList` | GET | `SearchControlPointVO` | optional | 페이지네이션 포함 |
| `/api/facility/controlPointList/{buildingId}` | GET | PathVariable | `buildingId` | 경로 변수 필수 |
| `/api/facility/workOrderList` | GET | `SearchFacilityWorkOrderListVO` | optional | 페이지네이션 포함 |

**SearchFacilityVO:**
```java
extends SearchDefaultVO
private long facilityCategory1Id;   // optional
private long facilityCategory2Id;   // optional
private long facilityCategory3Id;   // optional
```

**⚠️ 500 에러 위험:**
- `/facilityList/{buildingId}` 에서 `buildingId=0` → `ResponseCode.FAIL_E00400` 반환 (명시적 체크 있음)
- `/facilityNos/{buildingId}` 동일

---

### 3. 공지사항 & 자료실 (Board)

**컨트롤러:** `BoardController.java`

| 엔드포인트 | HTTP | VO/파라미터 | 필수 파라미터 | 비고 |
|----------|------|-----------|------------|------|
| `/api/board/noticeList` | GET | `SearchNoticeVO` | optional | 페이지네이션 포함 |
| `/api/board/dataList` | GET | `SearchReferenceDataVO` | optional | 페이지네이션 포함 |

**SearchNoticeVO:**
```java
extends SearchDefaultVO
private String writeDateFrom;      // optional
private String writeDateTo;        // optional
private long accountId;             // optional (기본값: 0)
private String noticeType;          // optional
private String publishState;        // optional
private Boolean isAllCompany;       // optional
```

**SearchReferenceDataVO:**
- `SearchDefaultVO` 상속 (필드 동일)

---

### 4. 고객사 (Client)

**컨트롤러:** `ClientController.java`

| 엔드포인트 | HTTP | 파라미터 | 필수 | 비고 |
|----------|------|---------|------|------|
| `/api/client/clientList` | GET | `SearchClientVO` | optional | 페이지네이션 포함 |
| `/api/client/clientView/{id}` | GET | PathVariable | `id` | 경로 변수 필수 |
| `/api/client/clientAdd/isBusinessNo` | GET | @RequestParam | `businessNo` (required=기본) | 중복 체크용 |

**SearchClientVO:**
```java
private long companyId;             // optional (기본값: 0)
private long accountId;             // optional (기본값: 0)
private String writeDateFrom;       // optional
private String writeDateTo;         // optional
private String searchCode;          // optional
private String searchKeyword;       // optional
```

---

### 5. 사용자 (User)

**컨트롤러:** `UserController.java`
*(세부 내용은 아래 별도 조사 필요)*

**SearchUserVO:**
```java
private long companyId;             // optional
private long wideAreaId;            // optional
private long baseAreaId;            // optional
private long buildingId;            // optional
private String writeDateFrom;       // optional
private String writeDateTo;         // optional
private String searchCode;          // optional
private String searchKeyword;       // optional
private long roleId;                // optional
private boolean idle;               // optional (기본값: false)
private boolean assigned;           // optional (기본값: false)
private boolean onlyErpUsers;       // optional (기본값: false)
private AccountState accountState;  // optional
private String mobile;              // optional
```

---

### 6. 순찰 (Patrol)

**컨트롤러:** `PatrolController.java`

| 엔드포인트 | HTTP | 파라미터 | 필수 | 비고 |
|----------|------|---------|------|------|
| `/api/patrol/patrolList` | GET | `SearchPatrolPlanVO` | optional | 페이지네이션 포함 |
| `/api/patrol/patrolTeamList` | GET | `SearchPatrolTeamVO` | optional | 페이지네이션 포함 |
| `/api/patrol/getPatrolTeam/{teamId}` | GET | PathVariable | `teamId` | 경로 변수 필수 |

**SearchPatrolPlanVO:**
```java
extends SearchDefaultVO
private long teamId;                // optional (기본값: 0)
private String planType;            // optional
```

**SearchPatrolTeamVO:**
```java
extends SearchDefaultVO
// 검색 필터 필드 없음 (기본 필드만 상속)
```

---

### 7. 분석 (Analysis)

**컨트롤러:** `AnalysisController.java`

| 엔드포인트 | HTTP | 파라미터 | 필수 | 비고 |
|----------|------|---------|------|------|
| `/api/analysis/fmsTeam` | GET | `SearchAnalysisVO` | optional | 분석 데이터 반환 |
| `/api/analysis/floors` | GET | @RequestParam | `buildingId` ✅ | **required=true** |
| `/api/analysis/rooms` | GET | @RequestParam | `floorId` ✅ | **required=true** |
| `/api/analysis/hasRoomData` | GET | @RequestParam | `buildingId` ✅ | **required=true** |

**⚠️ 500 에러 위험 (CRITICAL):**
```
GET /api/analysis/floors          → buildingId 필수
GET /api/analysis/rooms           → floorId 필수
GET /api/analysis/hasRoomData     → buildingId 필수
```

누락 시 `@RequestParam` 검증 오류 → **400 Bad Request** 또는 **500 Internal Server Error**

---

### 8. 보고서 (Report)

**컨트롤러:** `ReportController.java`

| 엔드포인트 | HTTP | VO/파라미터 | 필수 파라미터 | 비고 |
|----------|------|-----------|------------|------|
| `/api/report/reportMonthList` | GET | `SearchReportVO` | optional | 페이지네이션 포함 |
| `/api/report/reportWeekList` | GET | `SearchReportVO` | optional | 페이지네이션 포함 |
| `/api/report/workLogList` | GET | `SearchReportVO` | optional | 페이지네이션 포함 |

**SearchReportVO:**
```java
private long companyId;             // optional (기본값: 0)
private long baseAreaId;            // optional (기본값: 0)
private long buildingId;            // optional (기본값: 0)
private long writerId;              // optional (기본값: 0)
private String dateFrom;            // optional
private String dateTo;              // optional
private String workYear;            // optional
private String workMonth;           // optional
private String dateType;            // optional
private String state;               // optional
private String searchCode;          // optional
private String searchKeyword;       // optional
```

---

### 9. 요청 배정 (Task Assignment)

**컨트롤러:** `AssignmentController.java`

| 엔드포인트 | HTTP | 파라미터 | 필수 | 비고 |
|----------|------|---------|------|------|
| `/api/task-assignments/unassigned` | GET | `SearchAssignedTaskVO` | optional | `@Valid` 검증 |
| `/api/task-assignments/assigned` | GET | `SearchAssignedTaskBaseVO` | optional | `@Valid` 검증 |

---

### 10. 의무/당직 (Duty)

**컨트롤러:** `DutyController.java`

| 엔드포인트 | HTTP | 파라미터 | 필수 | 비고 |
|----------|------|---------|------|------|
| `/api/duties` | GET | `DutyTypeQueryDTO` | optional | 페이지네이션 포함 |
| `/api/duties/accounts` | GET | `AccountDutyMonthRequestDTO` | `@Valid` | 월별 근무 조회 |
| `/api/duties/accounts?type=table` | GET | `AccountDutyDailyRequestDTO` + cursor | cursor fields optional | Keyset pagination |

**⚠️ 커서 파라미터 (Keyset Pagination):**
```
@RequestParam(required = false) @DateTimeFormat LocalDate cursorDutyDate
@RequestParam(required = false) String cursorName
@RequestParam(required = false) Long cursorId
@RequestParam(required = false, defaultValue = "20") Integer size
```

---

## SearchDefaultVO 공통 구조

모든 SearchVO는 `SearchDefaultVO`를 상속하며, 다음 필드는 **모든 목록 API에 존재:**

```java
// 기본 필터
private long companyId;                 // 고객사 ID (기본값: 0)
private long baseAreaId;                // 거점 ID (기본값: 0)
private long buildingId;                // 건물 ID (기본값: 0) ⭐⭐⭐
private long buildingFloorId;           // 층 ID (기본값: 0)
private long buildingFloorZoneId;       // 구역 ID (기본값: 0)
private long wideAreaId;                // 광역 ID (기본값: 0)

// 검색
private String searchCode;              // 검색 코드 (optional)
private String searchKeyword;           // 검색어 (optional)

// 서비스 필터
private Boolean serviceFMS = null;      // null: 무시, true: 사용중, false: 미사용
private Boolean serviceRMS = null;
private Boolean serviceSMS = null;
private Boolean serviceEMS = null;
private Boolean servicePAT = null;
private Boolean serviceBIM = null;
private Boolean serviceNCP = null;

// 건물 상태
private String buildingStateApplyType = "";  // "" | "IN" | "NOTIN"
private String buildingStates = "";          // comma-separated
```

---

## 500 에러 발생 메커니즘

### 원인 분석

#### 1. required=true 파라미터 누락 (가장 흔함)
```
GET /api/analysis/floors          → buildingId 누락 → 400/500
GET /api/analysis/rooms           → floorId 누락 → 400/500
GET /api/analysis/hasRoomData     → buildingId 누락 → 400/500
```

#### 2. PathVariable ID=0 검증 실패
```
GET /api/facility/facilityList/0    → buildingId == 0 → FAIL_E00400 (명시적 체크)
GET /api/facility/facilityNos/0     → buildingId == 0 → FAIL_E00400
```

#### 3. null 체크 누락 (서비스 레이어)
- SearchVO 필드가 `0` 또는 `null`일 때 서비스에서 SQL 생성 실패
- 예: `buildingId = 0` → WHERE buildingId = 0 → 예상치 못한 결과 또는 NullPointerException

#### 4. @Valid 검증 실패 (DTO)
```java
@Valid @ModelAttribute SearchWorkOrderVO searchWorkOrderVO
@Valid @RequestBody DutyTypeRegisterDTO registerDTO
```
- 필수 필드 미충족 → 400 Bad Request (또는 글로벌 예외 핸들러가 500으로 전환)

---

## insite-web 구현 체크리스트

### API 호출 시 필수 확인

- [ ] **buildingId** 항상 포함 (가장 중요!)
  - `SearchDefaultVO` 상속 모든 목록 API에서 `buildingId`는 **반드시** 전달
  - 현재 선택 건물이 없으면 API 호출 금지

- [ ] **required=true 파라미터 명시적 처리**
  ```typescript
  // ❌ 위험
  GET /api/analysis/floors?buildingId=  // 빈 값

  // ✅ 안전
  if (buildingId > 0) {
    GET /api/analysis/floors?buildingId=${buildingId}
  }
  ```

- [ ] **PathVariable 검증**
  ```typescript
  // ❌ 위험
  GET /api/facility/facilityList/0

  // ✅ 안전
  if (buildingId > 0) {
    GET /api/facility/facilityList/${buildingId}
  }
  ```

- [ ] **선택적 파라미터 (Optional)**
  ```typescript
  const params = new URLSearchParams({
    buildingId: buildingId.toString(),
    // optional
    ...(keyword && { keyword }),
    ...(state && { state }),
  });
  ```

---

## 추가 발견사항

### 1. 페이지네이션 표준
- 모든 목록 API는 `Pageable pageable` 파라미터 수용
- Spring Data Web 자동 변환: `?page=0&size=20&sort=id,desc`
- `@PageableDefault(size=20)` 기본값

### 2. 날짜 형식
- `SearchNoticeVO`, `SearchClientVO` 등에서 `dateFrom`, `dateTo` 사용
- 형식 명시 필요 (ISO 8601 또는 `yyyy-MM-dd` 추정)

### 3. 상태 코드 매핑
- `@PathVariable` ID가 0이면 `ResponseCode.FAIL_E00400` 반환
- 서비스 레이어 검증 확인 필수

### 4. ModelAttribute vs RequestBody
- `@ModelAttribute` → 쿼리스트링 또는 form-urlencoded
- `@RequestBody` → JSON body (POST/PUT)

---

## 권장사항

### insite-web API 호출 안정성 강화

1. **buildingId 검증 wrapper**
   ```typescript
   export async function getWorkOrderList(params: SearchVO) {
     if (!params.buildingId || params.buildingId === 0) {
       throw new Error("buildingId가 필수입니다");
     }
     return apiClient.get("/api/workorder/workOrderList", { params });
   }
   ```

2. **required=true 파라미터 조기 검증**
   ```typescript
   export async function getFloors(buildingId: number) {
     if (!buildingId) throw new Error("buildingId 필수");
     return apiClient.get("/api/analysis/floors", {
       params: { buildingId },
     });
   }
   ```

3. **에러 재시도 로직**
   - 400 Bad Request → 파라미터 재검증 후 중단
   - 500 Internal Server Error → 로그 기록 + 재시도 고려
   - 401/403 → 인증 갱신

---

## 조사 범위 (완료)

- ✅ WorkOrderController
- ✅ FacilityController
- ✅ BoardController (Notice, ReferenceData)
- ✅ ClientController
- ✅ PatrolController
- ✅ AnalysisController
- ✅ ReportController
- ✅ DutyController
- ✅ AssignmentController
- ✅ SearchDefaultVO 상속 구조

---

## 미완료 항목

- [ ] MaterialController 세부 분석
- [ ] UserController 세부 분석
- [ ] ServiceInfoController (`@Parameter(required=true)` 사용)
- [ ] SettingController
- [ ] TemplateController
- [ ] 각 VO의 @Valid 필드 검증 규칙 상세 분석

---

**작성자:** worker-3
**최종 수정:** 2026-03-19
