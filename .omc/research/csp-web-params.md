# csp-web v1 API 호출 파라미터 분석

## 작업지시 (Work Order)

### orderList.html - /api/workOrder/workOrderList

| 파라미터 | 타입 | 필수여부 | 기본값 | 설명 |
|---------|------|--------|-------|------|
| searchCode | string | optional | "title" | 검색 구분 (title, writerAccountName, chargeAccountName, confirmAccountName) |
| companyId | number | required | 0 | 회사 ID |
| companyName | string | optional | "" | 회사명 |
| baseAreaId | number | optional | 0 | 기본 지역 ID |
| baseAreaName | string | optional | "" | 기본 지역명 |
| buildingId | number | required | 0 | 건물 ID |
| buildingName | string | optional | "" | 건물명 |
| buildingUserGroupId | number | optional | 0 | 건물 사용자 그룹 ID |
| accountId | number | optional | 0 | 계정 ID |
| accountName | string | optional | "" | 계정명 |
| termType | string | optional | "write_date" | 기간 검색 타입 (write_date, issue_date, approve_date) |
| termDateFrom | date | required | 1개월 전 | 기간 시작일 |
| termDateTo | date | required | 현재일 | 기간 종료일 |
| state | string | optional | "" | 상태 (WRITE, ISSUE, PROCESSING, REQ_COMPLETE, COMPLETE, CANCEL) |
| firstClassId | number | optional | 0 | 1차 분류 ID |
| secondClassId | number | optional | 0 | 2차 분류 ID |
| secondCategoryName | string | optional | "" | 2차 카테고리명 (TBM 타입용) |
| keyword | string | optional | "" | 검색 키워드 |
| type | string | optional | "" | 업무 타입 (GENERAL, TBM) |
| wideAreaId | number | optional | 0 | 광역 지역 ID |

**주요 검색 로직:**
- termDateFrom, termDateTo 필수 입력 (기간 검색은 필수)
- TBM 타입일 경우 secondCategoryName / secondClassId 사용
- GENERAL 타입일 경우 firstClassId / secondClassId 사용

---

### complainList.html - /api/workOrder/complainList

| 파라미터 | 타입 | 필수여부 | 기본값 | 설명 |
|---------|------|--------|-------|------|
| companyId | number | required | 0 | 회사 ID |
| companyName | string | optional | "" | 회사명 |
| baseAreaId | number | optional | 0 | 기본 지역 ID |
| buildingId | number | required | 0 | 건물 ID |
| buildingName | string | optional | "" | 건물명 |
| buildingFloorId | number | optional | 0 | 층 ID |
| buildingFloorZoneId | number | optional | 0 | 위치(존) ID |
| wideAreaId | number | optional | 0 | 광역 지역 ID |
| state | string | optional | "all" | 민원 상태 (전체, NEW, ASSIGNED, COMPLETED, CLOSED) |
| writeDateFrom | date | required | 1개월 전 | 등록 시작일 |
| writeDateTo | date | required | 현재일 | 등록 종료일 |
| searchCode | string | optional | "title" | 검색 구분 (title, content, phone) |
| searchKeyword | string | optional | "" | 검색 키워드 |
| locationKeyword | string | optional | "" | 위치 검색 키워드 |

---

## 시설 (Facility)

### facilityList.html - /api/facility/facilityList

| 파라미터 | 타입 | 필수여부 | 기본값 | 설명 |
|---------|------|--------|-------|------|
| companyId | number | required | 0 | 회사 ID |
| companyName | string | optional | "" | 회사명 |
| baseAreaId | number | optional | 0 | 기본 지역 ID |
| buildingId | number | required | 0 | 건물 ID |
| buildingFloorId | number | optional | 0 | 층 ID |
| buildingFloorZoneId | number | optional | 0 | 위치(존) ID |
| firstFacilityCategoryId | number | optional | 0 | 1차 설비 카테고리 ID |
| secondFacilityCategoryId | number | optional | 0 | 2차 설비 카테고리 ID |
| thirdFacilityCategoryId | number | optional | 0 | 3차 설비 카테고리 ID |
| hasHistory | boolean | optional | false | 설비이력 유무 필터 |
| searchCode | string | optional | "facilityName" | 검색 구분 (facilityName, facilityNo, sellCompany, modelName) |
| searchKeyword | string | optional | "" | 검색 키워드 |
| locationCode | string | optional | "floorName" | 위치 검색 코드 (floorName, zoneName) |
| locationKeyword | string | optional | "" | 위치 검색 키워드 |
| state | string | optional | "" | 운영상태 필터 |
| categoryName | string | optional | "" | 설비 분류명 |

---

## 순찰/점검 (Patrol)

### patrolList.html - /api/patrol/patrolList

| 파라미터 | 타입 | 필수여부 | 기본값 | 설명 |
|---------|------|--------|-------|------|
| searchCode | string | optional | "all" | 검색 구분 (all, carNo, teamName) |
| searchKeyword | string | optional | "" | 검색 키워드 |
| teamId | number | optional | 0 | 소속팀 ID |
| teamName | string | optional | "소속팀" | 팀명 |
| companyId | number | required | 0 | 회사 ID |
| companyName | string | optional | "" | 회사명 |
| baseAreaId | number | optional | 0 | 기본 지역 ID |
| buildingId | number | required | 0 | 건물 ID |
| wideAreaId | number | optional | 0 | 광역 지역 ID |
| planType | string | optional | "all" | 유형 (all, NONSCHEDULED, SCHEDULED) |

---

## 자재 (Material)

### materialInfoList.html - /api/material/materialList

| 파라미터 | 타입 | 필수여부 | 기본값 | 설명 |
|---------|------|--------|-------|------|
| companyId | number | required | 0 | 회사 ID |
| companyName | string | optional | "" | 회사명 |
| baseAreaId | number | optional | 0 | 기본 지역 ID |
| buildingId | number | required | 0 | 건물 ID |
| wideAreaId | number | optional | 0 | 광역 지역 ID |
| buildingState | string | optional | "" | 건물 상태 |
| buildingName | string | optional | "" | 건물명 |
| name | string | optional | "" | 자재명 |
| suitableStock | string | optional | "all" | 적정재고 필터 (all, less, more) |
| userGroupId | number | optional | 0 | 사용자 그룹 ID |
| materialType | string | optional | "ALL" | 자재타입 (ALL, RAW, PARTS, SUPPLIES, TOOL, FUEL, STORED, PROCESS, HALF_FINISHED, PRODUCT, GOODS) |

---

## 공지사항 (Board - Notice)

### noticeList.html - /api/board/noticeList

| 파라미터 | 타입 | 필수여부 | 기본값 | 설명 |
|---------|------|--------|-------|------|
| companyId | number | required | 0 | 회사 ID |
| companyName | string | optional | "" | 회사명 |
| wideAreaId | number | optional | 0 | 광역 지역 ID |
| baseAreaId | number | optional | 0 | 기본 지역 ID |
| buildingId | number | required | 0 | 건물 ID |
| writeDateFrom | date | required | 36개월 전 | 등록 시작일 |
| writeDateTo | date | required | 현재일 | 등록 종료일 |
| searchCode | string | optional | "title_contents" | 검색 구분 (title_contents, writer) |
| searchKeyword | string | optional | "" | 검색 키워드 |
| accountId | number | optional | 0 | 계정 ID |
| accountName | string | optional | "작성자 명" | 작성자명 |
| noticeType | string | optional | "NOTICE" | 유형 (NOTICE, NORMAL, ALL) |
| publishState | string | optional | "NOW_PUBLISH" | 게시 상태 (NOW_PUBLISH, BEFORE_PUBLISH, AFTER_PUBLISH, all) |
| isAllCompany | boolean | optional | null | 전체 공지만 필터 |

---

## 자료실 (Board - Reference Data)

### dataList.html - /api/board/dataList

| 파라미터 | 타입 | 필수여부 | 기본값 | 설명 |
|---------|------|--------|-------|------|
| companyId | number | required | 0 | 회사 ID |
| companyName | string | optional | "" | 회사명 |
| wideAreaId | number | optional | 0 | 광역 지역 ID |
| baseAreaId | number | optional | 0 | 기본 지역 ID |
| buildingId | number | required | 0 | 건물 ID |
| writeDateFrom | date | required | 36개월 전 | 등록 시작일 |
| writeDateTo | date | required | 현재일 | 등록 종료일 |
| searchCode | string | optional | "title_contents" | 검색 구분 (title_contents, writer) |
| searchKeyword | string | optional | "" | 검색 키워드 |
| accountId | number | optional | 0 | 계정 ID |
| accountName | string | optional | "작성자 명" | 작성자명 |

---

## 사용자 (User)

### userList.html - /api/user/userList

| 파라미터 | 타입 | 필수여부 | 기본값 | 설명 |
|---------|------|--------|-------|------|
| companyId | number | required | 0 | 회사 ID |
| companyName | string | optional | "" | 회사명 |
| wideAreaId | number | optional | 0 | 광역 지역 ID |
| baseAreaId | number | optional | 0 | 기본 지역 ID |
| buildingId | number | required | 0 | 건물 ID |
| writeDateFrom | date | required | 3년 전 | 기간 시작일 |
| writeDateTo | date | required | 현재일 | 기간 종료일 |
| searchCode | string | optional | "name" | 검색 구분 (name, id, mobile) |
| searchKeyword | string | optional | "" | 검색 키워드 |
| roleId | number | optional | 0 | 역할 ID |
| idle | boolean | optional | false | 미배정자 필터 |
| assigned | boolean | optional | false | 배정자 필터 |
| onlyErpUsers | boolean | optional | false | ERP 사용자만 필터 |
| accountState | string | optional | "HIRED" | 계정 상태 (HIRED, LEAVE, RETIRED) |
| dateType | string | optional | "writeDate" | 기간 검색 타입 (writeDate, hireDate, retireDate) |

---

## 업무일지 (Report - Work Log)

### workLogList.html - /api/report/workLogList

| 파라미터 | 타입 | 필수여부 | 기본값 | 설명 |
|---------|------|--------|-------|------|
| companyId | number | required | 0 | 회사 ID |
| companyName | string | optional | "" | 회사명 |
| baseAreaId | number | optional | 0 | 기본 지역 ID |
| buildingId | number | required | 0 | 건물 ID |
| writerId | number | optional | 0 | 작성자 ID |
| writerName | string | optional | "" | 작성자명 |
| dateFrom | date | required | 1개월 전 | 기간 시작일 |
| dateTo | date | required | 현재일 | 기간 종료일 |
| state | string | optional | "ALL" | 상태 (ALL, WRITE, DISCARD, REPORT) |
| searchCode | string | optional | "writerAccountName" | 검색 구분 (writerAccountName, weeklyReceptAccounts) |
| searchKeyword | string | optional | "" | 검색 키워드 |
| dateType | string | optional | "lastModifiedDate" | 기간 검색 타입 (lastModifiedDate, reportDate) |

---

## 주요 발견 사항

### 1. 공통 필터 필드
모든 목록 페이지에서 다음 필드들이 공통으로 사용됨:
- `companyId` (필수): 회사 ID 항상 필요
- `buildingId` (필수): 대부분 건물 ID 필요 (notification, dataList 제외 - wideAreaId/baseAreaId로 광역 검색)
- 기간 필터: `writeDateFrom`, `writeDateTo` 또는 `dateFrom`, `dateTo`
- 검색: `searchCode`, `searchKeyword` (선택사항)

### 2. 기본값 패턴
- 기간 필터는 백엔드 API 호출 시 **필수** (비어있으면 에러)
- 날짜 기본값:
  - 업무/민원/작업: 1개월 전 ~ 현재
  - 공지/자료: 36개월 전 ~ 현재
  - 사용자: 3년 전 ~ 현재
  - 업무일지: 1개월 전 ~ 현재

### 3. 페이지네이션
Vue 데이터에는 `p` 객체 사용 (pageData):
- `p.content`: 데이터 배열
- `p.number`: 현재 페이지
- `p.size`: 페이지 크기
- `p.totalElements`: 전체 개수

### 4. 검색 로직 검증
executeSearch/searchList 메서드에서 대부분:
1. 기간 필터 필수 확인
2. 기간 유효성 검증 (fromDate <= toDate)
3. 최소 1개 이상의 검색 조건 필수

### 5. buildingId 주입
**모든 API 요청에 buildingId가 쿼리 파라미터로 자동 추가됨** (CLAUDE.md 규칙):
- buildingId = "0" 또는 null이면 생략
- buildingId > 0이면 `?buildingId={id}` 추가

### 6. 주의사항
- 작업 조회는 권한에 따라 상태 옵션이 달라짐 (ROLE_SYSTEM_ADMIN만 WRITE 상태 볼 수 있음)
- TBM 작업은 별도 파라미터 분기 (secondCategoryName + secondClassId)
- 순찰 목록은 차량 상태 조회를 위해 외부 API 호출 (`/api/external/reqCarInfo`, 15초 간격)

---

## 미분석 항목
report 폴더의 다른 목록들 (reportMonthList, reportWeekList, tbmList) 미분석
→ 필요 시 추가 분석 가능
