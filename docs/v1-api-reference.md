# v1 API 명세 (csp-web 기준)

> 추출 일시: 2026-03-05
> 출처: csp-web HTML 템플릿 axios/fetch 호출 분석
> 목적: insite-web 마이그레이션 시 백엔드 API 호출 패턴 참조

---

## 1. workOrder 모듈 (작업지시)

### SOP (표준운영절차)
| HTTP | URL | 파라미터/Body | 비고 |
|------|-----|--------------|------|
| GET | `/api/workOrder/sopList` | companyId, buildingId, facilityCategoryId, sopState, searchKeyword, page, size | 표준 SOP 목록 조회 |
| GET | `/api/workOrder/sopWorkOrderList` | - | SOP 작업지시 목록 |
| GET | `/api/workOrder/sopView/{id}` | - | SOP 상세 조회 |
| POST | `/api/workOrder/v2/addTbm` | - | SOP 추가 |
| GET | `/api/workOrder/commonSopList` | - | 공통 SOP 목록 |

### 민원 (VOC/Complain)
| HTTP | URL | 파라미터/Body | 비고 |
|------|-----|--------------|------|
| GET | `/api/workOrder/complainList` | - | 민원 목록 조회 |
| GET | `/api/workOrder/viewComplain/{id}` | - | 민원 상세 조회 |

### TBM (예방보전 작업)
| HTTP | URL | 파라미터/Body | 비고 |
|------|-----|--------------|------|
| GET | `/api/workOrder/tbmList` | - | TBM 목록 조회 |
| GET | `/api/workOrder/tbmExecutePlanList` | - | TBM 실행 계획 목록 |
| POST | `/api/workOrder/editTbm` | - | TBM 수정 |

### 작업지시 (WorkOrder)
| HTTP | URL | 파라미터/Body | 비고 |
|------|-----|--------------|------|
| GET | `/api/workOrder/workOrderList` | - | 작업지시 목록 조회 |
| GET | `/api/workOrder/orderView/view/{id}` | - | 작업지시 상세 조회 (조회) |
| GET | `/api/workOrder/orderView/edit/{id}` | - | 작업지시 상세 조회 (편집) |
| GET | `/api/workOrder/getOrderItemList/{id}` | - | 작업항목 목록 |
| GET | `/api/workOrder/getOrderItemListDTO/{id}` | - | 작업항목 DTO 조회 |

### 메시지/알림
| HTTP | URL | 파라미터/Body | 비고 |
|------|-----|--------------|------|
| GET | `/api/workOrder/messageHistoryList` | - | 메시지 이력 조회 |

### 기타
| HTTP | URL | 파라미터/Body | 비고 |
|------|-----|--------------|------|
| GET | `/api/workOrder/modal/workOrderItemSearch` | - | 작업항목 검색 (모달) |
| GET | `/open/workOrder/getAnalogUnit` | - | 아날로그 단위 조회 |
| GET | `/open/workOrder/getFirstClassDTOs` | - | 1차 분류 조회 |
| GET | `/open/workOrder/getSecondClassDTOs` | - | 2차 분류 조회 |

---

## 2. Facility 모듈 (시설)

| HTTP | URL | 파라미터/Body | 비고 |
|------|-----|--------------|------|
| GET | `/api/facility/facilityList` | buildingId, facilityCategoryId | 시설 목록 조회 |
| GET | `/api/facility/facilityView/{id}` | - | 시설 상세 조회 |
| GET | `/api/facility/facilityHistoryList` | facilityId | 시설 이력 조회 |
| GET | `/api/facility/controlPointList` | - | 제어점 목록 |
| GET | `/api/facility/controlPointListAtOrderView/{id}` | - | 작업지시 화면의 제어점 목록 |
| GET | `/api/facility/workOrderList` | facilityId | 시설별 작업지시 목록 |
| GET | `/api/facility/getFacilityTreeForControlPoint` | - | 제어점용 시설 트리 |
| GET | `/api/facility-histories/work-orders/{id}` | - | 작업지시별 시설 이력 |
| GET | `/open/facilityCategory/firstFacilityCategoryList` | - | 설비 1차 분류 목록 |
| GET | `/open/facilityCategory/secondFacilityCategoryList/{id}` | - | 설비 2차 분류 목록 |
| GET | `/open/facilityCategory/thirdFacilityCategoryList/{id}` | - | 설비 3차 분류 목록 |
| GET | `/open/facilityHistory/getFistClassDTOs` | - | 시설 이력 1차 분류 |

---

## 3. User 모듈 (사용자)

| HTTP | URL | 파라미터/Body | 비고 |
|------|-----|--------------|------|
| GET | `/api/user/userList` | companyId, buildingId | 사용자 목록 조회 |
| GET | `/api/user/userEdit` | userId | 사용자 정보 편집 조회 |
| PUT | `/api/user/userEdit` | JSON: 사용자 정보 | 사용자 정보 수정 |
| PUT | `/api/user/userEdit/password` | JSON: 비밀번호 | 사용자 비밀번호 변경 |
| GET | `/api/user/userRoleList` | userId | 사용자 역할 목록 |
| GET | `/api/user/roleDTOList` | - | 역할 DTO 목록 |
| GET | `/api/account/audit` | - | 감사 로그 조회 |
| GET | `/open/user/roleList` | - | 역할 목록 (공개) |

---

## 4. Setting 모듈 (설정)

| HTTP | URL | 파라미터/Body | 비고 |
|------|-----|--------------|------|
| GET | `/api/setting/configGroupList` | - | 설정 그룹 목록 |
| GET | `/api/setting/config` | - | 설정값 조회 |
| GET | `/api/setting/facilityList` | - | 시설 목록 (설정용) |
| GET | `/api/setting/cleaningCoefficientList` | - | 청소 계수 목록 |
| GET | `/open/setting/facilityCategoryList/{id}` | - | 설비 분류 목록 (공개) |

---

## 5. Board 모듈 (게시판)

| HTTP | URL | 파라미터/Body | 비고 |
|------|-----|--------------|------|
| GET | `/api/board/noticeList` | buildingId, page, size | 공지사항 목록 조회 |
| GET | `/api/board/noticeView/{id}` | - | 공지사항 상세 조회 |
| POST | `/api/board/noticeAdd` | JSON: 제목, 내용 | 공지사항 등록 |
| DELETE | `/api/board/deleteNotice/{id}` | - | 공지사항 삭제 |
| GET | `/api/board/dataList` | buildingId, page, size | 자료실 목록 조회 |
| GET | `/api/board/dataView/{id}` | - | 자료실 상세 조회 |
| DELETE | `/api/board/deleteData/{id}` | - | 자료실 삭제 |
| POST | `/api/board/addComment/{id}` | JSON: 댓글 내용 | 댓글 추가 |
| DELETE | `/api/board/deleteComment/{id}` | - | 댓글 삭제 |

---

## 6. Report 모듈 (보고서)

| HTTP | URL | 파라미터/Body | 비고 |
|------|-----|--------------|------|
| GET | `/api/report/workLogList` | buildingId, startDate, endDate | 작업 기록 목록 |
| GET | `/api/report/workLog/{id}` | - | 작업 기록 상세 |
| POST | `/api/report/workLog` | JSON: 작업 정보 | 작업 기록 등록 |
| GET | `/api/report/reportWeekList` | buildingId, year, week | 주간 보고서 목록 |
| GET | `/api/report/reportWeek/{id}` | - | 주간 보고서 상세 |
| GET | `/api/report/reportWeekInfo/{id}` | - | 주간 보고서 정보 |
| POST | `/api/report/reportWeek` | JSON: 보고서 데이터 | 주간 보고서 등록 |
| GET | `/api/report/reportMonthList` | buildingId, year, month | 월간 보고서 목록 |
| GET | `/api/report/reportMonth/{id}` | - | 월간 보고서 상세 |
| GET | `/api/report/reportMonthInfo/{id}` | - | 월간 보고서 정보 |
| POST | `/api/report/reportMonth` | JSON: 보고서 데이터 | 월간 보고서 등록 |
| GET | `/api/report/reportWorkLogInfo/{id}` | - | 작업기록 보고서 정보 |
| GET | `/api/report/tbmList` | - | TBM 보고서 목록 |
| GET | `/api/nfc-round/categories` | - | NFC 라운드 카테고리 |

---

## 7. Analysis 모듈 (분석)

| HTTP | URL | 파라미터/Body | 비고 |
|------|-----|--------------|------|
| GET | `/api/analysis/energyStatus` | buildingId, date | 에너지 상태 조회 |
| GET | `/api/analysis/energyComparison` | buildingId, year, month | 에너지 비교 분석 |
| GET | `/api/analysis/floors` | buildingId | 건물 층수 조회 |
| GET | `/api/analysis/rooms` | buildingId, floorId | 호실 목록 조회 |
| GET | `/api/analysis/rms` | buildingId | RMS 데이터 조회 |
| GET | `/api/analysis/fmsTeam` | buildingId | FMS 팀 조회 |
| GET | `/api/analysis/fmsItemHistory` | facilityCategoryId | FMS 항목 이력 |
| GET | `/api/analysis/fmsTrendList` | buildingId, facilityCategoryId | FMS 트렌드 목록 |
| GET | `/api/analysis/trendFMS` | - | FMS 트렌드 데이터 |
| POST | `/api/analysis/saveTrendFMS` | JSON: 트렌드 정보 | FMS 트렌드 저장 |
| DELETE | `/api/analysis/deleteTrendFMS` | - | FMS 트렌드 삭제 |
| GET | `/api/analysis/rmsTrendList` | buildingId | RMS 트렌드 목록 |
| GET | `/api/analysis/trendRMS` | - | RMS 트렌드 데이터 |
| POST | `/api/analysis/saveTrendRMS` | JSON: 트렌드 정보 | RMS 트렌드 저장 |
| DELETE | `/api/analysis/deleteTrendRMS` | - | RMS 트렌드 삭제 |
| GET | `/api/analysis/trendControlPoint/{id}` | - | 제어점 트렌드 |
| GET | `/api/analysis/emsTrendList` | buildingId | EMS 트렌드 목록 |
| GET | `/api/analysis/workOrderUsage/list` | buildingId, startDate, endDate | 작업지시 사용량 목록 |

---

## 8. Service 모듈 (서비스/근태)

| HTTP | URL | 파라미터/Body | 비고 |
|------|-----|--------------|------|
| GET | `/api/service/attendanceUser` | userId, year, month | 사용자별 근태 조회 |
| GET | `/api/service/attendanceMonth` | buildingId, year, month | 월별 근태 현황 |
| GET | `/api/service/attendanceDay` | buildingId, date | 일별 근태 현황 |
| GET | `/api/service/attendanceDayAdmin` | companyId, buildingId, date | 관리자용 일별 근태 |
| GET | `/api/service/workCalendar` | buildingId, year, month | 근무 달력 |
| GET | `/api/service/getMonthSchedule` | buildingId, year, month | 월간 일정 조회 |
| GET | `/api/service/rmsList` | buildingId | RMS 목록 |
| GET | `/api/service/viewRms/{id}` | - | RMS 상세 조회 |
| POST | `/api/service/setLogInOutManual` | JSON: 출입기록 | 출입기록 수동 설정 |
| GET | `/api/service/cleanInfoList` | buildingId | 청소 정보 목록 |
| GET | `/api/duties` | - | 근무 목록 |
| GET | `/api/duties/{id}` | - | 근무 상세 |
| POST | `/api/duties` | JSON: 근무 정보 | 근무 등록 |
| PUT | `/api/duties/{id}` | JSON: 근무 정보 | 근무 수정 |
| DELETE | `/api/duties/{id}` | - | 근무 삭제 |
| GET | `/api/duties/accounts` | - | 근무 계정 목록 |
| GET | `/api/duties/adjustments` | - | 근무 조정 목록 |
| GET | `/api/duties/adjustments/{id}` | - | 근무 조정 상세 |
| POST | `/api/duties/adjustments/{id}/approve` | - | 근무 조정 승인 |
| POST | `/api/duties/adjustments/{id}/reject` | - | 근무 조정 반려 |
| GET | `/api/duties/anomalies` | - | 근무 이상 항목 |
| GET | `/api/devices` | - | 디바이스 목록 |

---

## 9. Patrol 모듈 (순찰)

| HTTP | URL | 파라미터/Body | 비고 |
|------|-----|--------------|------|
| GET | `/api/patrol/patrolList` | buildingId, startDate, endDate | 순찰 목록 조회 |
| GET | `/api/patrol/patrolPlan/{id}` | - | 순찰 계획 상세 |
| POST | `/api/patrol/postPatrolPlan` | JSON: 순찰 계획 | 순찰 계획 등록 |
| PUT | `/api/patrol/putPatrolPlan` | JSON: 순찰 계획 | 순찰 계획 수정 |
| DELETE | `/api/patrol/deletePatrolPlan/{id}` | - | 순찰 계획 삭제 |
| POST | `/api/patrol/completePatrol/{id}` | - | 순찰 완료 |
| GET | `/api/patrol/patrolTeamList` | buildingId | 순찰팀 목록 |
| GET | `/api/patrol/getPatrolTeam/{id}` | - | 순찰팀 상세 조회 |
| POST | `/api/patrol/postPatrolTeam` | JSON: 순찰팀 정보 | 순찰팀 등록 |
| PUT | `/api/patrol/putPatrolTeam` | JSON: 순찰팀 정보 | 순찰팀 수정 |
| POST | `/api/patrol/deletePatrolTeamBuilding` | - | 순찰팀 건물 삭제 |
| POST | `/api/patrol/deletePatrolTeamAccount` | - | 순찰팀 계정 삭제 |
| GET | `/api/patrol/getPatrolTeamBuilding/{id}` | - | 순찰팀 건물 조회 |
| POST | `/api/patrol/deletePatrolPlanBuilding` | - | 순찰 계획 건물 삭제 |
| POST | `/api/patrol/deletePatrolPlanAccount` | - | 순찰 계획 계정 삭제 |
| GET | `/api/patrol/modal/patrolTeamList` | - | 순찰팀 목록 (모달) |

---

## 10. Material 모듈 (자재)

| HTTP | URL | 파라미터/Body | 비고 |
|------|-----|--------------|------|
| GET | `/api/material/materialList` | buildingId, categoryId | 자재 목록 조회 |
| GET | `/api/material/materialView/{id}` | - | 자재 상세 조회 |

---

## 11. Client 모듈 (고객사)

| HTTP | URL | 파라미터/Body | 비고 |
|------|-----|--------------|------|
| GET | `/api/client/clientList` | - | 고객사 목록 조회 |
| GET | `/api/client/clientView/{id}` | - | 고객사 상세 조회 |
| GET | `/api/organizations` | - | 조직 목록 (공개) |

---

## 12. License 모듈 (라이선스)

| HTTP | URL | 파라미터/Body | 비고 |
|------|-----|--------------|------|
| GET | `/api/license/licenseList` | - | 라이선스 목록 조회 |

---

## 13. Sensor 모듈 (센서)

| HTTP | URL | 파라미터/Body | 비고 |
|------|-----|--------------|------|
| GET | `/api/sensor/sensorList` | buildingId, facilityCategoryId | 센서 목록 조회 |
| GET | `/api/sensor/sensorManufacturerList` | - | 센서 제조사 목록 |
| GET | `/api/sensor/network/list` | - | 센서 네트워크 목록 |

---

## 14. Site 모듈 (사이트/건물)

| HTTP | URL | 파라미터/Body | 비고 |
|------|-----|--------------|------|
| GET | `/api/site/buildingList` | companyId, wideAreaId | 건물 목록 조회 |
| GET | `/api/site/buildingView/{id}` | - | 건물 상세 조회 |
| GET | `/api/site/buildingEdit?type=range` | - | 건물 편집 정보 조회 |
| PUT | `/api/site/buildingEdit?type=range` | JSON: 건물 정보 | 건물 정보 수정 |
| GET | `/api/site/buildingFloor` | - | 건물 층 목록 |
| GET | `/api/site/buildingFloor/{id}` | - | 건물 층 상세 |
| POST | `/api/site/buildingFloor` | JSON: 층 정보 | 건물 층 등록 |
| PUT | `/api/site/buildingFloor` | JSON: 층 정보 | 건물 층 수정 |
| DELETE | `/api/site/buildingFloor/{id}` | - | 건물 층 삭제 |
| GET | `/api/site/buildingFloorZone` | buildingId, floorId | 구역 목록 |
| GET | `/api/site/buildingFloorZone/{id}` | - | 구역 상세 |
| POST | `/api/site/buildingFloorZone` | JSON: 구역 정보 | 구역 등록 |
| PUT | `/api/site/buildingFloorZone` | JSON: 구역 정보 | 구역 수정 |
| DELETE | `/api/site/buildingFloorZone/{id}` | - | 구역 삭제 |
| GET | `/api/site/buildingUserGroup` | buildingId | 사용자 그룹 목록 |
| GET | `/api/site/buildingUserGroup/{id}` | - | 사용자 그룹 상세 |
| POST | `/api/site/buildingUserGroup` | JSON: 그룹 정보 | 사용자 그룹 등록 |
| PUT | `/api/site/buildingUserGroup` | JSON: 그룹 정보 | 사용자 그룹 수정 |
| DELETE | `/api/site/buildingUserGroup/{id}` | - | 사용자 그룹 삭제 |
| GET | `/api/site/buildingUserGroups/{id}` | - | 건물 사용자 그룹 목록 |
| GET | `/api/site/buildingAccount` | buildingId | 건물 계정 조회 |
| GET | `/api/site/buildingAccount/{id}` | - | 건물 계정 상세 |
| PUT | `/api/site/buildingAccount/v2` | JSON: 계정 정보 | 건물 계정 수정 (v2) |
| GET | `/api/site/buildingAccount/buildings` | - | 계정의 건물 목록 |
| GET | `/api/site/userGroupList` | buildingId | 사용자 그룹 목록 |
| GET | `/api/site/configUserList` | buildingId | 설정 사용자 목록 |
| GET | `/api/services` | buildingId | 서비스 목록 |
| GET | `/api/user/erp-sync` | - | ERP 동기화 조회 |
| GET | `/open/building/building/{id}` | - | 건물 정보 (공개) |
| GET | `/open/building/buildingFloorList/{id}` | - | 건물 층 목록 (공개) |
| GET | `/open/building/buildingFloorZoneList/{id}` | - | 건물 구역 목록 (공개) |
| GET | `/open/building/porduct` | - | 건물 제품 조회 |
| GET | `/open/building/useType1Id` | - | 건물 사용 유형 1 |
| GET | `/open/building/useType2Id/{id}` | - | 건물 사용 유형 2 |
| GET | `/open/file/building/{id}` | - | 건물 파일 조회 |
| GET | `/open/weather/xy/{latitude}/{longitude}` | - | 날씨 조회 |
| GET | `/open/user/roleList/v2` | - | 역할 목록 (v2) |

---

## 15. FieldWork 모듈 (현장 작업)

| HTTP | URL | 파라미터/Body | 비고 |
|------|-----|--------------|------|
| GET | `/api/field/projects` | companyId, buildingId | 현장 프로젝트 목록 |
| GET | `/api/field/projects/{id}` | - | 현장 프로젝트 상세 |
| GET | `/api/field/projects/by-status` | status | 상태별 프로젝트 |
| POST | `/api/field/projects` | JSON: 프로젝트 정보 | 프로젝트 등록 |
| PUT | `/api/field/projects/{id}` | JSON: 프로젝트 정보 | 프로젝트 수정 |
| GET | `/api/field/work-orders` | projectId | 작업 지시 목록 |
| GET | `/api/field/work-orders/search` | keyword, status | 작업 지시 검색 |
| GET | `/api/field/schedules/by-worker` | workerId | 작업자별 일정 |
| GET | `/api/field/search/schedules/daily` | date | 일일 일정 검색 |
| GET | `/api/field/search/schedules/monthly` | year, month | 월간 일정 검색 |
| GET | `/api/field/search/work-orders/aggregations` | - | 작업 지시 집계 |
| GET | `/api/field/attendance/by-project` | projectId | 프로젝트별 근태 |
| GET | `/api/field/attendance/by-worker` | workerId | 작업자별 근태 |
| GET | `/api/field/attendances/stats` | - | 근태 통계 |
| GET | `/api/field/reports/daily` | date | 일일 보고서 |
| GET | `/api/field/reports/worker` | workerId | 작업자 보고서 |
| GET | `/api/field/reports/monthly/summary` | year, month | 월간 보고서 요약 |
| GET | `/api/field/notifications` | - | 알림 목록 |
| GET | `/api/accounts/workers` | - | 작업자 계정 목록 |
| POST | `/members` | - | 회원 등록 |

---

## 16. NFC 모듈 (NFC 라운드)

| HTTP | URL | 파라미터/Body | 비고 |
|------|-----|--------------|------|
| GET | `/api/nfc-round/` | buildingId | NFC 라운드 목록 |
| GET | `/api/nfc-round/{id}` | - | NFC 라운드 상세 |
| POST | `/api/nfc-round/` | JSON: 라운드 정보 | NFC 라운드 등록 |
| GET | `/api/nfc-round/categories` | - | NFC 카테고리 목록 |
| GET | `/api/nfc-round/categories/items` | categoryId | 카테고리별 항목 |
| GET | `/api/nfc-round/category-items/{id}` | - | 카테고리 항목 상세 |
| POST | `/api/nfc-round/category-items/{id}` | JSON: 항목 정보 | 카테고리 항목 등록 |
| GET | `/api/nfc-round/forms` | - | NFC 폼 목록 |
| GET | `/api/nfc-round/tbm` | buildingId | NFC TBM 조회 |
| GET | `/api/nfc-round/tbm/` | buildingId | NFC TBM 목록 |
| GET | `/api/nfc-round/tbm/execute-plans` | - | NFC TBM 실행 계획 |
| GET | `/api/nfc-round/issues` | - | NFC 이슈 목록 |

---

## 17. Tag 모듈 (태그)

| HTTP | URL | 파라미터/Body | 비고 |
|------|-----|--------------|------|
| GET | `/api/tag/tagList` | buildingId | 태그 목록 조회 |
| GET | `/api/tag/tagView` | tagId | 태그 상세 조회 (조회 전용) |
| GET | `/api/tag/tagView/{id}` | - | 태그 상세 조회 |
| POST | `/api/tag/tagCreateNFCQR` | JSON: NFC/QR 코드 정보 | NFC/QR 코드 태그 생성 |

---

## 18. Invoice 모듈 (청구서)

| HTTP | URL | 파라미터/Body | 비고 |
|------|-----|--------------|------|
| GET | `/api/invoice-bills` | - | 청구서 목록 조회 |
| GET | `/api/invoice-bills/{id}` | - | 청구서 상세 조회 |
| POST | `/api/invoice-bills` | FormData: 청구서 정보 | 청구서 등록 |
| PUT | `/api/invoice-bills` | FormData: 청구서 정보 | 청구서 수정 |
| DELETE | `/api/invoice-bills/{id}` | - | 청구서 삭제 |
| GET | `/api/invoice-bills/level-data-check` | - | 청구서 레벨 데이터 확인 |
| GET | `/api/invoice-bills/trgt-yy-list` | - | 청구서 대상 연도 목록 |
| GET | `/api/site/room/{floorId}/available` | - | 가용 호실 목록 |

---

## 19. Account 모듈 (계정)

| HTTP | URL | 파라미터/Body | 비고 |
|------|-----|--------------|------|
| GET | `/api/account/temporary` | - | 임시 계정 목록 |
| POST | `/api/account/temporary` | JSON: 계정 정보 | 임시 계정 등록 |
| GET | `/api/account/temporary/duty` | - | 임시 계정 근무 조회 |

---

## 20. BEMS 모듈 (건물에너지관리시스템)

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
| GET | `/api/v1/anls/anlsEqpAirCprsList` | buildingId | 분석 설비 공기압축기 |
| GET | `/api/v1/anls/anlsEqpHeatList` | buildingId | 분석 설비 열 목록 |
| GET | `/api/v1/anls/anlsEqpTherList` | buildingId | 분석 설비 온도 목록 |
| GET | `/api/v1/anls/anlsEqpWaterList` | buildingId | 분석 설비 물 목록 |
| GET | `/api/v1/anls/anlsBaselineModlList` | buildingId | 분석 기준선 모델 목록 |
| GET | `/api/v1/anls/anlsHeatStorSystemList` | buildingId | 분석 축열 시스템 목록 |
| GET | `/api/v1/anls/anlsOperSchdMgmtList` | buildingId | 분석 운영 스케줄 관리 |
| GET | `/api/v1/anls/anlsPrpitToPlanList` | buildingId | 분석 실적-계획 목록 |
| GET | `/api/v1/anls/baseLineMethdMgmtList` | buildingId | 기준선 방법 관리 목록 |
| GET | `/api/v1/anls/engyFloorList` | buildingId | 에너지 층 목록 |
| GET | `/api/v1/anls/engyWellRateList` | buildingId | 에너지 우물 비율 목록 |
| GET | `/api/v1/anls/planDataMgmtList` | buildingId | 계획 데이터 관리 목록 |
| GET | `/api/v1/engycost/engyCostPlanList` | buildingId | 에너지 비용 계획 목록 |
| GET | `/api/v1/goal/baseLineEsmMgmtList` | buildingId | 목표 기준선 ESM 관리 |
| GET | `/api/v1/invoice/billList` | buildingId, year | 청구서 목록 |
| GET | `/api/v1/rept/reptDataList` | buildingId, date | 보고서 데이터 목록 |
| GET | `/api/v1/std/stdCdGrpList` | - | 표준 코드 그룹 목록 |
| GET | `/api/v1/std/stdEqpList` | - | 표준 설비 목록 |
| GET | `/api/v1/std/eqpList` | - | 설비 목록 |
| GET | `/api/v1/demo/demoList` | buildingId | 데모 목록 |

---

## 21. BECM 모듈 (건물설비성능진단)

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

## 주요 패턴

### HTTP 메서드별 분류
- **GET**: 목록 조회, 상세 조회, 데이터 조회
- **POST**: 데이터 등록, 파일 업로드, 액션 실행
- **PUT**: 데이터 수정, 상태 변경
- **DELETE**: 데이터 삭제

### URL 네이밍 컨벤션
- `/api/` - 인증 필요한 API
- `/open/` - 공개 API (로그인 불필요)
- 복수형 사용: `/api/{module}/{resource}List` (목록)
- 단수형 사용: `/api/{module}/{resource}/{id}` (상세)
- 액션: `/api/{module}/{action}` (POST/PUT)

### 파라미터 전달 방식
- **GET**: 쿼리 문자열 또는 URL 경로 파라미터
- **POST/PUT**: JSON Body 또는 FormData (파일 포함 시)
- **DELETE**: URL 경로 파라미터

---

## 마이그레이션 주의사항

1. **URL 패턴 확인**: 백엔드 컨트롤러에서 실제 구현된 URL 패턴 확인 필수
2. **파라미터 검증**: 요청/응답 VO 클래스 확인 필수
3. **파일 업로드**: FormData 사용 여부 확인 필수
4. **인증**: `/api/` vs `/open/` 구분 필수
5. **페이지네이션**: page, size 파라미터 포함 여부 확인

---

## 참조 경로

**백엔드 (csp-was):**
- 컨트롤러: `/Volumes/jinseok-SSD-1tb/00_insite/csp-was/src/main/java/hdclabs/cspwas/controller/`
- 엔티티/VO: `/Volumes/jinseok-SSD-1tb/00_insite/csp-was/src/main/java/hdclabs/cspwas/model/`

**기존 프론트엔드 (csp-web):**
- 템플릿: `/Volumes/jinseok-SSD-1tb/00_insite/csp-web/src/main/resources/templates/`
