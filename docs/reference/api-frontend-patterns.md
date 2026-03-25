# v1 프론트엔드 API 호출 패턴

> 목적: 새 모듈 구현 시 v1(csp-web)이 API를 어떻게 호출했는지 참조
> 출처: csp-web HTML 템플릿의 axios/fetch 호출 분석
> 최종 업데이트: 2026-03-24

---

## 이 문서 사용법

### api-backend-spec.md와의 차이

| 문서 | 관점 | 용도 |
|------|------|------|
| `api-backend-spec.md` | 백엔드 (도메인별 컨트롤러/엔드포인트) | "이 API가 존재하나?" |
| `api-frontend-patterns.md` (이 문서) | 프론트엔드 (호출 방식) | "v1은 이 API를 어떻게 호출했나?" |

### 사용 시나리오

1. **새 모듈 구현** -> 이 문서에서 v1 호출 패턴 확인
2. **파라미터 확인** -> 테이블에서 HTTP, URL, 파라미터 확인
3. **insite-web 구현** -> `.claude/rules/component-patterns.md` 참조

---

## 공통 호출 패턴

### v1 -> v2 패턴 매핑

| v1 패턴 (csp-web) | v2 패턴 (insite-web) | 비고 |
|-------------------|---------------------|------|
| `axios.get('/api/...', { params })` | `apiClient.get('/api/...', { params })` | buildingId 자동 주입 |
| `axios.post('/api/...', jsonBody)` | `apiClient.post('/api/...', jsonBody)` | Authorization 자동 주입 |
| `axios.post('/api/...', formData)` | `apiClient.postForm('/api/...', formData)` | 파일 업로드 시 |
| `axios.put('/api/...', jsonBody)` | `apiClient.put('/api/...', jsonBody)` | |
| `axios.delete('/api/...')` | `apiClient.delete('/api/...')` | |

### URL 네이밍 컨벤션

| 접두사 | 인증 | 설명 |
|--------|------|------|
| `/api/` | 필요 (Bearer 토큰) | 인증 필요 API |
| `/open/` | 불필요 | 공개 API |

### 파라미터 전달 방식

| HTTP 메서드 | 전달 방식 |
|------------|----------|
| GET | 쿼리 파라미터 (`?key=value`) 또는 경로 파라미터 (`/{id}`) |
| POST/PUT | JSON Body (기본) 또는 FormData (파일 포함 시) |
| DELETE | 경로 파라미터 (`/{id}`) |

---

## 모듈별 호출 패턴 (구현 완료)

> 아래 모듈은 insite-web에 이미 구현됨. 상세 구현은 `src/lib/api/` 참조.

### 1. WorkOrder (작업지시) - ✅ Phase 3+8 완료

| HTTP | URL | 비고 |
|------|-----|------|
| GET | `/api/workOrder/sopList` | SOP 목록 (companyId, buildingId, facilityCategoryId, sopState, searchKeyword, page, size) |
| GET | `/api/workOrder/sopWorkOrderList` | SOP 작업지시 목록 |
| GET | `/api/workOrder/sopView/{id}` | SOP 상세 |
| POST | `/api/workOrder/v2/addTbm` | SOP 추가 |
| GET | `/api/workOrder/commonSopList` | 공통 SOP 목록 |
| GET | `/api/workOrder/complainList` | 민원 목록 |
| GET | `/api/workOrder/viewComplain/{id}` | 민원 상세 |
| GET | `/api/workOrder/tbmList` | TBM 목록 |
| GET | `/api/workOrder/tbmExecutePlanList` | TBM 실행 계획 목록 |
| POST | `/api/workOrder/editTbm` | TBM 수정 |
| GET | `/api/workOrder/workOrderList` | 작업지시 목록 |
| GET | `/api/workOrder/orderView/view/{id}` | 작업지시 상세 (조회) |
| GET | `/api/workOrder/orderView/edit/{id}` | 작업지시 상세 (편집) |
| GET | `/api/workOrder/getOrderItemList/{id}` | 작업항목 목록 |
| GET | `/api/workOrder/getOrderItemListDTO/{id}` | 작업항목 DTO |
| GET | `/api/workOrder/messageHistoryList` | 메시지 이력 |
| GET | `/api/workOrder/modal/workOrderItemSearch` | 작업항목 검색 (모달) |
| GET | `/open/workOrder/getAnalogUnit` | 아날로그 단위 (공개) |
| GET | `/open/workOrder/getFirstClassDTOs` | 1차 분류 (공개) |
| GET | `/open/workOrder/getSecondClassDTOs` | 2차 분류 (공개) |

### 2. Facility (시설) - ✅ Phase 4 완료

| HTTP | URL | 비고 |
|------|-----|------|
| GET | `/api/facility/facilityList` | 목록 (buildingId, facilityCategoryId) |
| GET | `/api/facility/facilityView/{id}` | 상세 |
| GET | `/api/facility/facilityHistoryList` | 이력 (facilityId) |
| GET | `/api/facility/controlPointList` | 제어점 목록 |
| GET | `/api/facility/controlPointListAtOrderView/{id}` | 작업지시 화면 제어점 |
| GET | `/api/facility/workOrderList` | 시설별 작업지시 (facilityId) |
| GET | `/api/facility/getFacilityTreeForControlPoint` | 제어점용 시설 트리 |
| GET | `/api/facility-histories/work-orders/{id}` | 작업지시별 시설 이력 |
| GET | `/open/facilityCategory/firstFacilityCategoryList` | 설비 1차 분류 (공개) |
| GET | `/open/facilityCategory/secondFacilityCategoryList/{id}` | 설비 2차 분류 (공개) |
| GET | `/open/facilityCategory/thirdFacilityCategoryList/{id}` | 설비 3차 분류 (공개) |
| GET | `/open/facilityHistory/getFistClassDTOs` | 시설 이력 1차 분류 (공개) |

### 3. User (사용자) - ✅ Phase 4 완료

| HTTP | URL | 비고 |
|------|-----|------|
| GET | `/api/user/userList` | 목록 (companyId, buildingId) |
| GET | `/api/user/userEdit` | 사용자 편집 조회 (userId) |
| PUT | `/api/user/userEdit` | 사용자 수정 (JSON) |
| PUT | `/api/user/userEdit/password` | 비밀번호 변경 (JSON) |
| GET | `/api/user/userRoleList` | 역할 목록 (userId) |
| GET | `/api/user/roleDTOList` | 역할 DTO 목록 |
| GET | `/api/account/audit` | 감사 로그 |
| GET | `/open/user/roleList` | 역할 목록 (공개) |

### 4. Setting (설정) - ✅ Phase 4+9 완료

| HTTP | URL | 비고 |
|------|-----|------|
| GET | `/api/setting/configGroupList` | 설정 그룹 목록 |
| GET | `/api/setting/config` | 설정값 |
| GET | `/api/setting/facilityList` | 시설 목록 (설정용) |
| GET | `/api/setting/cleaningCoefficientList` | 청소 계수 |
| GET | `/open/setting/facilityCategoryList/{id}` | 설비 분류 (공개) |

### 5. Board (게시판) - ✅ Phase 4 완료

| HTTP | URL | 비고 |
|------|-----|------|
| GET | `/api/board/noticeList` | 공지 목록 (buildingId, page, size) |
| GET | `/api/board/noticeView/{id}` | 공지 상세 |
| POST | `/api/board/noticeAdd` | 공지 등록 (JSON) |
| DELETE | `/api/board/deleteNotice/{id}` | 공지 삭제 |
| GET | `/api/board/dataList` | 자료실 목록 (buildingId, page, size) |
| GET | `/api/board/dataView/{id}` | 자료실 상세 |
| DELETE | `/api/board/deleteData/{id}` | 자료실 삭제 |
| POST | `/api/board/addComment/{id}` | 댓글 추가 (JSON) |
| DELETE | `/api/board/deleteComment/{id}` | 댓글 삭제 |

### 6. Report (보고서) - ✅ Phase 6 완료

| HTTP | URL | 비고 |
|------|-----|------|
| GET | `/api/report/workLogList` | 작업기록 목록 (buildingId, startDate, endDate) |
| GET | `/api/report/workLog/{id}` | 작업기록 상세 |
| POST | `/api/report/workLog` | 작업기록 등록 (JSON) |
| GET | `/api/report/reportWeekList` | 주간보고서 목록 (buildingId, year, week) |
| GET | `/api/report/reportWeek/{id}` | 주간보고서 상세 |
| GET | `/api/report/reportWeekInfo/{id}` | 주간보고서 정보 |
| POST | `/api/report/reportWeek` | 주간보고서 등록 (JSON) |
| GET | `/api/report/reportMonthList` | 월간보고서 목록 (buildingId, year, month) |
| GET | `/api/report/reportMonth/{id}` | 월간보고서 상세 |
| GET | `/api/report/reportMonthInfo/{id}` | 월간보고서 정보 |
| POST | `/api/report/reportMonth` | 월간보고서 등록 (JSON) |
| GET | `/api/report/reportWorkLogInfo/{id}` | 작업기록 보고서 정보 |
| GET | `/api/report/tbmList` | TBM 보고서 목록 |
| GET | `/api/nfc-round/categories` | NFC 라운드 카테고리 |

### 7. Analysis (분석) - ✅ Phase 9 완료

| HTTP | URL | 비고 |
|------|-----|------|
| GET | `/api/analysis/energyStatus` | 에너지 상태 (buildingId, date) |
| GET | `/api/analysis/energyComparison` | 에너지 비교 (buildingId, year, month) |
| GET | `/api/analysis/floors` | 층 목록 (buildingId) |
| GET | `/api/analysis/rooms` | 호실 목록 (buildingId, floorId) |
| GET | `/api/analysis/rms` | RMS 데이터 (buildingId) |
| GET | `/api/analysis/fmsTeam` | FMS 팀 (buildingId) |
| GET | `/api/analysis/fmsItemHistory` | FMS 항목 이력 (facilityCategoryId) |
| GET | `/api/analysis/fmsTrendList` | FMS 트렌드 목록 (buildingId, facilityCategoryId) |
| GET | `/api/analysis/trendFMS` | FMS 트렌드 데이터 |
| POST | `/api/analysis/saveTrendFMS` | FMS 트렌드 저장 (JSON) |
| DELETE | `/api/analysis/deleteTrendFMS` | FMS 트렌드 삭제 |
| GET | `/api/analysis/rmsTrendList` | RMS 트렌드 목록 (buildingId) |
| GET | `/api/analysis/trendRMS` | RMS 트렌드 데이터 |
| POST | `/api/analysis/saveTrendRMS` | RMS 트렌드 저장 (JSON) |
| DELETE | `/api/analysis/deleteTrendRMS` | RMS 트렌드 삭제 |
| GET | `/api/analysis/trendControlPoint/{id}` | 제어점 트렌드 |
| GET | `/api/analysis/emsTrendList` | EMS 트렌드 목록 (buildingId) |
| GET | `/api/analysis/workOrderUsage/list` | 작업지시 사용량 (buildingId, startDate, endDate) |

### 8. Service (서비스/근태) - ✅ Phase 9 완료

**근태:** `/api/service/attendanceUser` (userId, year, month), `/api/service/attendanceMonth` (buildingId, year, month), `/api/service/attendanceDay` (buildingId, date), `/api/service/attendanceDayAdmin` (companyId, buildingId, date)

**일정:** `/api/service/workCalendar` (buildingId, year, month), `/api/service/getMonthSchedule` (buildingId, year, month)

**기타:** `/api/service/rmsList` (GET, buildingId), `/api/service/viewRms/{id}` (GET), `/api/service/setLogInOutManual` (POST, JSON), `/api/service/cleanInfoList` (GET, buildingId)

**근무 CRUD:** `/api/duties` (GET/POST), `/api/duties/{id}` (GET/PUT/DELETE), `/api/duties/accounts` (GET)

**근무 조정:** `/api/duties/adjustments` (GET), `/api/duties/adjustments/{id}` (GET), `/api/duties/adjustments/{id}/approve` (POST), `/api/duties/adjustments/{id}/reject` (POST), `/api/duties/anomalies` (GET)

**디바이스:** `/api/devices` (GET)

### 9. Patrol (순찰) - ✅ Phase 6 완료

**순찰 계획:** `/api/patrol/patrolList` (GET, buildingId/startDate/endDate), `/api/patrol/patrolPlan/{id}` (GET), `/api/patrol/postPatrolPlan` (POST, JSON), `/api/patrol/putPatrolPlan` (PUT, JSON), `/api/patrol/deletePatrolPlan/{id}` (DELETE), `/api/patrol/completePatrol/{id}` (POST)

**순찰팀:** `/api/patrol/patrolTeamList` (GET, buildingId), `/api/patrol/getPatrolTeam/{id}` (GET), `/api/patrol/postPatrolTeam` (POST, JSON), `/api/patrol/putPatrolTeam` (PUT, JSON), `/api/patrol/getPatrolTeamBuilding/{id}` (GET), `/api/patrol/modal/patrolTeamList` (GET)

**삭제 액션 (POST):** `deletePatrolTeamBuilding`, `deletePatrolTeamAccount`, `deletePatrolPlanBuilding`, `deletePatrolPlanAccount` (모두 `/api/patrol/` 접두사)

### 10. Material (자재) - ✅ Phase 4 완료

| HTTP | URL | 비고 |
|------|-----|------|
| GET | `/api/material/materialList` | 목록 (buildingId, categoryId) |
| GET | `/api/material/materialView/{id}` | 상세 |

### 11. Client (고객사) - ✅ Phase 4 완료

| HTTP | URL | 비고 |
|------|-----|------|
| GET | `/api/client/clientList` | 고객사 목록 |
| GET | `/api/client/clientView/{id}` | 고객사 상세 |
| GET | `/api/organizations` | 조직 목록 |

### 12. License (라이선스) - ✅ Phase 6 완료

| HTTP | URL | 비고 |
|------|-----|------|
| GET | `/api/license/licenseList` | 라이선스 목록 |

### 13. Sensor (센서) - ✅ Phase 9 완료 (controls 모듈)

| HTTP | URL | 비고 |
|------|-----|------|
| GET | `/api/sensor/sensorList` | 목록 (buildingId, facilityCategoryId) |
| GET | `/api/sensor/sensorManufacturerList` | 제조사 목록 |
| GET | `/api/sensor/network/list` | 네트워크 목록 |

### 14. Site (사이트/건물) - ✅ Phase 4 완료 (buildings 모듈)

**건물 CRUD:** `/api/site/buildingList` (GET, companyId/wideAreaId), `/api/site/buildingView/{id}` (GET), `/api/site/buildingEdit?type=range` (GET/PUT)

**층 CRUD:** `/api/site/buildingFloor` (GET/POST/PUT), `/api/site/buildingFloor/{id}` (GET/DELETE)

**구역 CRUD:** `/api/site/buildingFloorZone` (GET/POST/PUT, buildingId/floorId), `/api/site/buildingFloorZone/{id}` (GET/DELETE)

**사용자 그룹 CRUD:** `/api/site/buildingUserGroup` (GET/POST/PUT, buildingId), `/api/site/buildingUserGroup/{id}` (GET/DELETE), `/api/site/buildingUserGroups/{id}` (GET)

**건물 계정:** `/api/site/buildingAccount` (GET, buildingId), `/api/site/buildingAccount/{id}` (GET), `/api/site/buildingAccount/v2` (PUT, JSON), `/api/site/buildingAccount/buildings` (GET)

**기타 인증 API:** `/api/site/userGroupList`, `/api/site/configUserList`, `/api/services`, `/api/user/erp-sync`

**공개 API:** `/open/building/building/{id}`, `/open/building/buildingFloorList/{id}`, `/open/building/buildingFloorZoneList/{id}`, `/open/building/porduct`, `/open/building/useType1Id`, `/open/building/useType2Id/{id}`, `/open/file/building/{id}`, `/open/weather/xy/{lat}/{lng}`, `/open/user/roleList/v2`

### 15. FieldWork (현장작업) - ✅ Phase 9 완료

**프로젝트 CRUD:** `/api/field/projects` (GET/POST, companyId/buildingId), `/api/field/projects/{id}` (GET/PUT), `/api/field/projects/by-status` (GET, status)

**작업지시:** `/api/field/work-orders` (GET, projectId), `/api/field/work-orders/search` (GET, keyword/status), `/api/field/search/work-orders/aggregations` (GET)

**일정:** `/api/field/schedules/by-worker` (GET, workerId), `/api/field/search/schedules/daily` (GET, date), `/api/field/search/schedules/monthly` (GET, year/month)

**근태:** `/api/field/attendance/by-project` (GET, projectId), `/api/field/attendance/by-worker` (GET, workerId), `/api/field/attendances/stats` (GET)

**보고서:** `/api/field/reports/daily` (GET, date), `/api/field/reports/worker` (GET, workerId), `/api/field/reports/monthly/summary` (GET, year/month)

**기타:** `/api/field/notifications` (GET), `/api/accounts/workers` (GET), `/members` (POST)

### 16. NFC (NFC 라운드) - ✅ Phase 9 완료

| HTTP | URL | 비고 |
|------|-----|------|
| GET | `/api/nfc-round/` | 목록 (buildingId) |
| GET | `/api/nfc-round/{id}` | 상세 |
| POST | `/api/nfc-round/` | 등록 (JSON) |
| GET | `/api/nfc-round/categories` | 카테고리 목록 |
| GET | `/api/nfc-round/categories/items` | 카테고리별 항목 (categoryId) |
| GET | `/api/nfc-round/category-items/{id}` | 항목 상세 |
| POST | `/api/nfc-round/category-items/{id}` | 항목 등록 (JSON) |
| GET | `/api/nfc-round/forms` | 폼 목록 |
| GET | `/api/nfc-round/tbm` | NFC TBM (buildingId) |
| GET | `/api/nfc-round/tbm/` | NFC TBM 목록 (buildingId) |
| GET | `/api/nfc-round/tbm/execute-plans` | TBM 실행 계획 |
| GET | `/api/nfc-round/issues` | 이슈 목록 |

### 17. Tag (태그) - ✅ Phase 9 완료

| HTTP | URL | 비고 |
|------|-----|------|
| GET | `/api/tag/tagList` | 목록 (buildingId) |
| GET | `/api/tag/tagView` | 상세 (tagId, 조회 전용) |
| GET | `/api/tag/tagView/{id}` | 상세 |
| POST | `/api/tag/tagCreateNFCQR` | NFC/QR 태그 생성 (JSON) |

### 18. Invoice (청구서) - ✅ Phase 9 완료 (invoices/rentals 모듈)

| HTTP | URL | 비고 |
|------|-----|------|
| GET | `/api/invoice-bills` | 목록 |
| GET | `/api/invoice-bills/{id}` | 상세 |
| POST | `/api/invoice-bills` | 등록 (**FormData**) |
| PUT | `/api/invoice-bills` | 수정 (**FormData**) |
| DELETE | `/api/invoice-bills/{id}` | 삭제 |
| GET | `/api/invoice-bills/level-data-check` | 레벨 데이터 확인 |
| GET | `/api/invoice-bills/trgt-yy-list` | 대상 연도 목록 |
| GET | `/api/site/room/{floorId}/available` | 가용 호실 목록 |

### 19. Account (계정) - ✅ Phase 8 완료 (mypage 모듈)

| HTTP | URL | 비고 |
|------|-----|------|
| GET | `/api/account/temporary` | 임시 계정 목록 |
| POST | `/api/account/temporary` | 임시 계정 등록 (JSON) |
| GET | `/api/account/temporary/duty` | 임시 계정 근무 |

---

## 모듈별 호출 패턴 (미구현 - 구현 시 필수 참조)

> Phase 10-11 대상. 구현 시 아래 파라미터를 반드시 확인할 것.

### 20. BEMS (건물에너지관리시스템) - ❌ Phase 10

| HTTP | URL | 파라미터/Body | 비고 |
|------|-----|--------------|------|
| GET | `/api/bems/` | - | BEMS 목록 |
| GET | `/api/bems/eqpVirtPrmtList` | - | 설비 가상 파라미터 목록 |
| GET | `/api/v1/eqp/NodeTreeList` | buildingId | 장비 노드 트리 |
| GET | `/api/v1/eqp/nodePrmtTreeList` | buildingId | 노드 파라미터 트리 |
| GET | `/api/v1/eqp/eqpVirtPrmtList` | buildingId | 설비 가상 파라미터 목록 |
| GET | `/api/v1/eqp/eqpVirtPrmtPopList` | buildingId | 설비 가상 파라미터 팝업 목록 |
| GET | `/api/v1/eqp/eqpFmlaList` | buildingId | 설비 공식 목록 |
| GET | `/api/v1/eqp/eqpChrtSetupList` | buildingId | 설비 차트 설정 목록 |
| GET | `/api/v1/engy/dataList` | buildingId, date | 에너지 데이터 목록 |
| GET | `/api/v1/engy/engyUseDataList` | buildingId, date | 에너지 사용 데이터 목록 |
| GET | `/api/v1/engy/prdtDataList` | buildingId, date | 생산 데이터 목록 |
| GET | `/api/v1/engy/engyPrmtDataLineList` | buildingId, date | 에너지 파라미터 데이터 라인 |
| GET | `/api/v1/engy/alamEqpStatusList` | buildingId | 알람 설비 상태 목록 |
| GET | `/api/v1/engy/alamHistList` | buildingId, date | 알람 이력 목록 |
| GET | `/api/v1/cnt/autoCntList` | buildingId | 자동 제어 목록 |
| GET | `/api/v1/cnt/ctrlOsvtList` | buildingId | 제어 관찰 목록 |
| GET | `/api/v1/cnt/alamPrmtList` | buildingId | 알람 파라미터 목록 |
| GET | `/api/v1/anls/anlsEqpAirCprsList` | buildingId | 분석: 공기압축기 |
| GET | `/api/v1/anls/anlsEqpHeatList` | buildingId | 분석: 열 |
| GET | `/api/v1/anls/anlsEqpTherList` | buildingId | 분석: 온도 |
| GET | `/api/v1/anls/anlsEqpWaterList` | buildingId | 분석: 물 |
| GET | `/api/v1/anls/anlsBaselineModlList` | buildingId | 분석: 기준선 모델 |
| GET | `/api/v1/anls/anlsHeatStorSystemList` | buildingId | 분석: 축열 시스템 |
| GET | `/api/v1/anls/anlsOperSchdMgmtList` | buildingId | 분석: 운영 스케줄 관리 |
| GET | `/api/v1/anls/anlsPrpitToPlanList` | buildingId | 분석: 실적-계획 |
| GET | `/api/v1/anls/baseLineMethdMgmtList` | buildingId | 기준선 방법 관리 |
| GET | `/api/v1/anls/engyFloorList` | buildingId | 에너지 층 목록 |
| GET | `/api/v1/anls/engyWellRateList` | buildingId | 에너지 우물 비율 |
| GET | `/api/v1/anls/planDataMgmtList` | buildingId | 계획 데이터 관리 |
| GET | `/api/v1/engycost/engyCostPlanList` | buildingId | 에너지 비용 계획 |
| GET | `/api/v1/goal/baseLineEsmMgmtList` | buildingId | 목표: 기준선 ESM 관리 |
| GET | `/api/v1/invoice/billList` | buildingId, year | 청구서 목록 |
| GET | `/api/v1/rept/reptDataList` | buildingId, date | 보고서 데이터 |
| GET | `/api/v1/std/stdCdGrpList` | - | 표준 코드 그룹 목록 |
| GET | `/api/v1/std/stdEqpList` | - | 표준 설비 목록 |
| GET | `/api/v1/std/eqpList` | - | 설비 목록 |
| GET | `/api/v1/demo/demoList` | buildingId | 데모 목록 |

### 21. BECM (건물설비성능진단) - ❌ Phase 11

| HTTP | URL | 파라미터/Body | 비고 |
|------|-----|--------------|------|
| GET | `/api/v1/std/eqpCatMngList` | buildingId | 설비 분류 관리 목록 |
| GET | `/api/v1/std/eqpMngList` | buildingId | 설비 관리 목록 |
| GET | `/api/v1/std/mtrlMngList` | buildingId | 재료 관리 목록 |
| GET | `/api/v1/std/rfgrMngList` | buildingId | 냉매 관리 목록 |
| GET | `/api/v1/std/steamDataMngList` | buildingId | 증기 데이터 관리 목록 |
| GET | `/api/v1/engy/eqpNodeList` | buildingId | 설비 노드 목록 |
| GET | `/api/v1/engy/eqpEditList` | buildingId | 설비 편집 목록 |
| GET | `/api/v1/engy/engyEffDriveList` | buildingId | 에너지 효율 드라이브 목록 |
| GET | `/api/v1/pfmc/getPfmcList` | buildingId | 성능 관리 목록 |
| GET | `/api/v1/svc/projList` | buildingId | 프로젝트 목록 |
| GET | `/api/v1/svc/savnMethList` | buildingId | 절감 방법 목록 |
| GET | `/api/v1/svc/econRvewList` | buildingId | 경제성 검토 목록 |
| GET | `/api/v1/svc/ipvmProjList` | buildingId | IPVM 프로젝트 목록 |
| GET | `/api/v1/serv/servTechList` | buildingId | 서비스 기술 목록 |
| GET | `/api/v1/anls/billList` | buildingId, year | 청구서 목록 |
| GET | `/api/v1/anls/billUpdtList` | buildingId, year | 청구서 업데이트 목록 |
| GET | `/api/eqp/eqpVirtPrmtPopList` | buildingId | 설비 가상 파라미터 팝업 목록 |

---

## 마이그레이션 참고사항

1. **URL 패턴**: 반드시 csp-was 컨트롤러에서 실제 URL 확인 (v1 템플릿과 다를 수 있음)
2. **파라미터 검증**: 요청/응답 VO 클래스 확인 필수
3. **FormData**: Invoice 등 파일 업로드 모듈은 `apiClient.postForm/putForm` 사용
4. **buildingId**: `apiClient`가 자동 주입 -> 수동 추가 금지 (`.claude/rules/building-context.md` 참조)
5. **페이지네이션**: page, size 파라미터 포함 여부는 컨트롤러 확인

### 참조 경로

| 구분 | 경로 |
|------|------|
| 백엔드 컨트롤러 | `/Volumes/jinseok-SSD-1tb/00_insite/csp-was/src/main/java/hdclabs/cspwas/controller/` |
| 백엔드 엔티티/VO | `/Volumes/jinseok-SSD-1tb/00_insite/csp-was/src/main/java/hdclabs/cspwas/model/` |
| v1 템플릿 | `/Volumes/jinseok-SSD-1tb/00_insite/csp-web/src/main/resources/templates/` |
| insite-web API 클라이언트 | `src/lib/api/client.ts` |
| insite-web API 함수 | `src/lib/api/*.ts` |
