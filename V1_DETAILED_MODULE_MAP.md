# v1 상세 모듈 매핑 (HTML 파일별)

## 목차

1. **v2 구현됨** (11개 모듈 - ✅)
2. **v1에만 있음** (22개 모듈 - 미구현)
3. **모듈별 페이지 패턴**
4. **의존성 및 통합 포인트**

---

## Part 1: v2 구현 완료 모듈 (11개)

### 1. Work Orders (작업지시)

**v1 경로:** `/templates/workOrder/`
**v2 경로:** `/src/app/(modules)/work-orders/`
**HTML 파일 (38개):**

```
주요 페이지:
├─ orderList.html        → page.tsx
├─ orderAdd.html         → new/page.tsx
├─ orderEdit.html        → [id]/edit/page.tsx
├─ orderView.html        → [id]/page.tsx
│
SOP (Standard Operating Procedure):
├─ sopList.html
├─ sopAdd.html
├─ sopEdit.html
├─ sopView.html
│
공통 SOP:
├─ commonSopList.html
├─ commonSopAdd.html
├─ commonSopEdit.html
├─ commonSopView.html
│
민원 처리:
├─ complainList.html
├─ complainAdd.html
├─ complainEdit.html
├─ complainView.html
│
TBM (Trouble Booking Management):
├─ tbmAdd.html
├─ tbmEdit.html
│
기타:
└─ messageHistoryList.html

v2 구현 상태: ✅ 완전 구현
```

### 2. Facilities (시설관리)

**v1 경로:** `/templates/facility/`
**v2 경로:** `/src/app/(modules)/facilities/`
**HTML 파일 (14개):**

```
시설:
├─ facilityList.html     → page.tsx
├─ facilityAdd.html      → new/page.tsx
├─ facilityEdit.html     → [id]/edit/page.tsx
├─ facilityView.html     → [id]/page.tsx
│
빌딩:
├─ buildingList.html
├─ buildingAdd.html
├─ buildingEdit.html
├─ buildingView.html
│
기타:
├─ facilitySearchModal.html
├─ floorList.html
├─ zoneList.html
└─ ...

v2 구현 상태: ✅ 완전 구현
```

### 3. Users (사용자관리)

**v1 경로:** `/templates/user/`
**v2 경로:** `/src/app/(modules)/users/`
**HTML 파일 (11개):**

```
사용자:
├─ userList.html         → page.tsx
├─ userAdd.html          → new/page.tsx
├─ userEdit.html         → [id]/edit/page.tsx
├─ userView.html         → [id]/page.tsx
│
역할/권한:
├─ userRoleList.html
├─ userRoleAdd.html
├─ userRoleEdit.html
└─ ...

v2 구현 상태: ✅ 완전 구현
```

### 4. Clients (고객관리)

**v1 경로:** `/templates/client/`
**v2 경로:** `/src/app/(modules)/clients/`
**HTML 파일 (6개):**

```
고객:
├─ clientList.html       → page.tsx
├─ clientAdd.html        → new/page.tsx
├─ clientEdit.html       → [id]/edit/page.tsx
├─ clientView.html       → [id]/page.tsx
└─ clientSearchModal.html

v2 구현 상태: ✅ 완전 구현
```

### 5. Materials (자재관리)

**v1 경로:** `/templates/material/`
**v2 경로:** `/src/app/(modules)/materials/`
**HTML 파일 (5개):**

```
자재:
├─ materialList.html     → page.tsx
├─ materialAdd.html      → new/page.tsx
├─ materialEdit.html     → [id]/edit/page.tsx
└─ materialView.html     → [id]/page.tsx

v2 구현 상태: ✅ 완전 구현
```

### 6. Boards (게시판)

**v1 경로:** `/templates/board/`
**v2 경로:** `/src/app/(modules)/boards/`
**HTML 파일 (8개):**

```
공지사항:
├─ noticeList.html       → notices/page.tsx
├─ noticeAdd.html        → notices/new/page.tsx
├─ noticeEdit.html       → notices/[id]/edit/page.tsx
├─ noticeView.html       → notices/[id]/page.tsx
│
자료실:
├─ boardList.html        → data/page.tsx
├─ boardAdd.html         → data/new/page.tsx
├─ boardEdit.html        → data/[id]/edit/page.tsx
└─ boardView.html        → data/[id]/page.tsx

v2 구현 상태: ✅ 완전 구현
```

### 7. Settings (설정)

**v1 경로:** `/templates/setting/`
**v2 경로:** `/src/app/(modules)/settings/`
**HTML 파일 (22개):**

```
v1 전체 설정:
├─ systemSettings.html
├─ userAuthSettings.html
├─ equipmentSettings.html
├─ sensorSettings.html
├─ buildingSettings.html
├─ baselineSettings.html
├─ energySettings.html
├─ reportTemplates.html
├─ alarmSettings.html
├─ thresholdSettings.html
├─ notificationSettings.html
├─ profileSettings.html
├─ licenseSettings.html
├─ integrationSettings.html
├─ apiKeyManagement.html
├─ dataRetentionSettings.html
├─ systemLog.html
├─ auditLog.html
├─ backupSettings.html
├─ userGroupSettings.html
├─ departmentSettings.html
└─ ...

v2 구현 상태: ⚠️ 부분 구현
- ✅ facility-masters만 구현됨
- ❌ 나머지 21개 설정 미구현
- 🔴 우선순위: 높음 (시스템 운영 필수)
```

### 8. Licenses (라이선스관리)

**v1 경로:** `/templates/license/`
**v2 경로:** `/src/app/(modules)/licenses/`
**HTML 파일 (7개):**

```
라이선스:
├─ licenseList.html      → page.tsx
├─ licenseAdd.html       → new/page.tsx
├─ licenseEdit.html      → [id]/edit/page.tsx
├─ licenseView.html      → [id]/page.tsx
│
라이선스 이력:
├─ licenseHistoryList.html
├─ licenseAuditLog.html
└─ licenseRenewalNotice.html

v2 구현 상태: ✅ 완전 구현
```

### 9. Patrols (순찰/점검)

**v1 경로:** `/templates/patrol/`
**v2 경로:** `/src/app/(modules)/patrols/`
**HTML 파일 (10개):**

```
점검:
├─ patrolList.html       → page.tsx
├─ patrolAdd.html        → new/page.tsx
├─ patrolEdit.html       → [id]/edit/page.tsx
├─ patrolView.html       → [id]/page.tsx
│
순찰팀:
├─ patrolTeamList.html   → teams/page.tsx
├─ patrolTeamAdd.html    → teams/new/page.tsx
├─ patrolTeamEdit.html   → teams/[id]/edit/page.tsx
├─ patrolTeamView.html   → teams/[id]/page.tsx
└─ patrolTeamModal.html

v2 구현 상태: ✅ 완전 구현
```

### 10. Reports (리포트)

**v1 경로:** `/templates/report/`
**v2 경로:** `/src/app/(modules)/reports/`
**HTML 파일 (14개):**

```
월간보고:
├─ reportMonthList.html  → monthly/page.tsx
├─ reportMonthAdd.html   → monthly/new/page.tsx
├─ reportMonthEdit.html  → monthly/[id]/edit/page.tsx
├─ reportMonthView.html  → monthly/[id]/page.tsx
│
주간보고:
├─ reportWeekList.html   → weekly/page.tsx
├─ reportWeekAdd.html    → weekly/new/page.tsx
├─ reportWeekEdit.html   → weekly/[id]/edit/page.tsx
├─ reportWeekView.html   → weekly/[id]/page.tsx
│
작업일지:
├─ workLogList.html      → work-logs/page.tsx
├─ workLogAdd.html       → work-logs/new/page.tsx
├─ workLogEdit.html      → work-logs/[id]/edit/page.tsx
├─ workLogView.html      → work-logs/[id]/page.tsx
│
TBM:
├─ tbmList.html
└─ tbmView.html

v2 구현 상태: ✅ 완전 구현
```

### 11. Dashboard (대시보드)

**v1 경로:** `/templates/` (메인)
**v2 경로:** `/src/app/dashboard/`
**구조:**

```
v1:
├─ index.html (메인 대시보드)
└─ 모듈별 대시보드

v2:
├─ page.tsx (메인)
├─ layout.tsx
└─ _components/dashboard-widgets.tsx

v2 구현 상태: ✅ 기본 구현됨
```

---

## Part 2: v1에만 있는 미구현 모듈 (22개)

### A. 에너지 관리 시스템 (🔴 매우 높은 우선순위)

#### A1. BEMS (Building Energy Management System) - 85개 HTML

**v1 경로:** `/templates/bems/`
**복잡도:** ⭐⭐⭐⭐⭐ (최대)

```
분석 모듈 (anls/) - 35개 파일:
├─ baseLineList.html
├─ baseLineEsmMgmt.html          # 에너지절감목표 관리
├─ baseLineMethdMgmt.html        # 기준선 방법론
├─ costSimlMgmt.html             # 비용 시뮬레이션
├─ engyFloorList.html            # 층별 에너지
├─ engyPlanCostList.html         # 에너지계획 비용
├─ engyWellRateList.html         # 에너지 요금
├─ eqpAirCprsList.html           # 공기압축기
├─ eqpHeatList.html              # 열펌프
├─ eqpTherList.html              # 냉각탑
├─ eqpWaterList.html             # 냉수기
├─ esmHistList.html              # 에너지절감 이력
├─ heatStorSystem.html           # 열저장 시스템
├─ aiFlowDiagram.html            # 기류 다이어그램
├─ airCompressorPerf.html        # 공기압축 성능
├─ boilerPerf.html               # 보일러 성능
├─ chilledWaterPerf.html         # 냉수 성능
├─ coolingTowerPerf.html         # 냉각탑 성능
├─ heatExchangerPerf.html        # 열교환기 성능
├─ pipelineLossAnalysis.html     # 배관손실 분석
├─ powerQuality.html             # 전력품질
├─ steamConsumption.html         # 증기 소비
├─ systemEfficiency.html         # 시스템 효율
├─ virtualMeterAnalysis.html     # 가상계량 분석
├─ waterConsumption.html         # 수소비 분석
└─ ... (15개 추가)

대시보드 (dash/) - 5개 파일:
├─ bems-dashboard.html
├─ real-time-monitoring.html
├─ energy-trend.html
├─ cost-analysis.html
└─ performance-metrics.html

계산 모듈 (cnt/) - 8개 파일:
├─ energyCalc.html
├─ costCalc.html
├─ emissionCalc.html
└─ ...

ECM (Energy Conservation Measures) - 8개 파일:
├─ ecmList.html
├─ ecmAdd.html
├─ ecmEdit.html
├─ ecmView.html
└─ ecmAnalysis.html

에너지 비용 (engyCost/) - 4개 파일:
├─ costList.html
├─ costAnalysis.html
└─ ...

기기 관리 (eqp/) - 5개 파일:
├─ equipmentList.html
├─ equipmentDetails.html
└─ ...

리포트 (rept/) - 2개 파일:
└─ energyReport.html

표준정보 (std/) - 5개 파일:
└─ standardData.html

기타 (common/, demo/) - 10개 파일

필요한 기술:
- 실시간 데이터 (WebSocket)
- 고급 차트 (ECharts, Recharts)
- 데이터 필터링
- 다중 기간 비교
- 예측 알고리즘
```

#### A2. BECM (Boiler/Chiller Equipment Management) - 64개 HTML

**v1 경로:** `/templates/becm/`
**복잡도:** ⭐⭐⭐⭐⭐ (최대)

```
분석 모듈 (anls/) - 6개 파일:
├─ eqpBillList.html             # 장비 청구 목록
├─ eqpBillUpdt.html             # 장비 청구 수정
├─ iplv.html                    # IPLV (성능 평가)
├─ loadCalc.html                # 부하 계산
├─ refrigerantChek.html         # 냉매 확인
└─ scatchVol.html               # 스크래치 볼륨

성능 모니터링 (pfmc/) - 28개 파일:
├─ asrpChlr.html + 3개 팝업     # 흡수식 냉각기
├─ coldHotwterChlr.html + 3개   # 냉온수 냉각기
├─ stemBoil.html + 3개          # 증기 보일러
├─ trboChlr.html + 3개          # 터보 냉각기
└─ vcumHotwterBoil.html + 3개   # 진공 온수 보일러

대시보드 (dash/) - 1개 파일:
└─ becmDashboard.html

에너지 (engy/) - 4개 파일:
├─ eqpNodeEdit.html
├─ eqpNodeCnnc.html
├─ eqpEqpPrmtEdit.html
└─ eqpNodeCnncRealTime.html

표준정보 (std/) - 9개 파일:
├─ eqpCopMng.html + popup
├─ eqpItemMng.html + popup
├─ mtrlMng.html + popup
├─ rfgrMng.html + popup
└─ stemDataMng.html + popup

서비스 (svc/) - 7개 파일:
├─ projList.html
├─ savnList.html
├─ techFmla.html
├─ econRvew.html
├─ ipvmProjList.html
└─ modalPopups

리포트 (rept/) - 1개 파일:
└─ dataList.html

필요한 기술:
- 실시간 장비 모니터링
- 3D 시각화 (Three.js)
- 알람 시스템
- 센서 데이터 통합
- 유지보수 일정 관리
```

#### A3. Analysis (분석) - 18개 HTML

**v1 경로:** `/templates/analysis/`
**복잡도:** ⭐⭐⭐⭐

```
기본 분석:
├─ energyStatus.html            # 에너지 상태
├─ usageStatus.html             # 사용 상태
├─ statistics.html              # 통계

EMS 트렌드 (3개):
├─ trendEMSList.html
├─ trendEMSView.html
└─ trendEMSEdit.html

FMS 트렌드 (3개):
├─ trendFMSList.html
├─ trendFMSView.html
└─ trendFMSEdit.html

RMS 트렌드 (3개):
├─ trendRMSList.html
├─ trendRMSView.html
└─ trendRMSEdit.html

기타:
├─ fmsItemHistory.html          # FMS 항목 이력
├─ fmsLabor.html                # FMS 노동력
├─ fmsTeam.html                 # FMS 팀
├─ rms.html                     # RMS
├─ demoChart1.html
└─ demoChart2.html

필요한 기술:
- 트렌드 분석 알고리즘
- 비교 분석 UI
- 기간별 필터링
- 다양한 차트 유형
```

---

### B. 현장 작업 시스템 (🟠 높은 우선순위)

#### B1. Fieldwork (현장작업) - 26개 HTML

**v1 경로:** `/templates/fieldwork/`
**복잡도:** ⭐⭐⭐⭐

```
현장 대시보드:
├─ field-dashboard/              # 현장 데이터 대시보드

출퇴근 관리:
├─ field-attendance/
│  ├─ attendanceList.html
│  ├─ attendanceMap.html         # 위치 지도
│  └─ attendanceTimeline.html

프로젝트:
├─ field-project/
│  ├─ projectList.html
│  ├─ projectDetail.html
│  └─ projectTimeline.html

일정 관리:
├─ field-schedule/
│  ├─ scheduleCalendar.html
│  ├─ scheduleList.html
│  └─ scheduleAssignment.html

작업지시:
├─ field-work-order/
│  ├─ taskList.html
│  ├─ taskDetail.html
│  └─ taskProgress.html

리포트:
├─ field-report/
│  ├─ reportList.html
│  ├─ reportForm.html
│  └─ reportView.html

기타:
├─ attendance-tooltip-preview.html
├─ path-visualization-preview.html  # 경로 시각화
└─ modal/

필요한 기술:
- 지도 API (Google Maps, Naver, Kakao)
- 위치 추적 (GPS)
- 실시간 업데이트
- 모바일 최적화 필수
- 오프라인 모드
```

---

### C. 서비스 관리 (🟠 높은 우선순위)

#### C1. Service (서비스) - 38개 HTML

**v1 경로:** `/templates/service/`
**복잡도:** ⭐⭐⭐

```
프로젝트 관리:
├─ projList.html                # 프로젝트 목록
├─ projAdd.html
├─ projEdit.html
├─ projView.html
├─ projDetailList.html          # 세부 프로젝트

절감 프로젝트:
├─ savnList.html                # 절감액 목록
├─ savnPopup.html               # 절감 팝업
├─ savnListPopup.html

기술 공식:
├─ techFmla.html                # 기술 공식 관리
├─ rgstTechFmlaPopup.html       # 공식 등록
├─ rgstTechFmlaItemPopup.html   # 공식 항목

경제성 검토:
├─ econRvew.html                # 경제성 검토

IPVM 프로젝트:
├─ ipvmProjList.html            # IPVM 프로젝트
├─ ipvmProjSavePopup.html

매개변수 관리:
├─ techFmlaItemPrmtPopup.html   # 기술 공식 매개변수

기타:
├─ projListPopup.html
├─ savnListPopup.html
└─ ... (다양한 모달)

필요한 기술:
- 프로젝트 일정 관리
- 절감액 계산
- ROI 분석
- 수식 엔진
```

---

### D. 설정 고도화 (🟠 높은 우선순위)

#### D1. Setting (설정) - 22개 HTML (기존 facility-masters 제외)

**v1 경로:** `/templates/setting/`
**현황:** v2는 facility-masters만 구현
**복잡도:** ⭐⭐⭐

```
시스템 설정:
├─ systemSettings.html          # 시스템 기본설정
├─ systemLog.html               # 시스템 로그
└─ auditLog.html                # 감사 로그

사용자/권한:
├─ userAuthSettings.html        # 사용자 권한 설정
├─ userGroupSettings.html       # 사용자 그룹
├─ departmentSettings.html      # 부서 설정

장비/센서:
├─ equipmentSettings.html       # 장비 설정
├─ sensorSettings.html          # 센서 설정

건물 설정:
├─ buildingSettings.html        # 건물 설정

에너지:
├─ baselineSettings.html        # 기준선 설정
├─ energySettings.html          # 에너지 설정
├─ thresholdSettings.html       # 알람 임계값

리포트/알림:
├─ reportTemplates.html         # 리포트 템플릿
├─ alarmSettings.html           # 알람 설정
├─ notificationSettings.html    # 알림 설정

라이선스/통합:
├─ licenseSettings.html         # 라이선스 설정
├─ integrationSettings.html     # 통합 설정
├─ apiKeyManagement.html        # API 키 관리

데이터:
├─ dataRetentionSettings.html   # 데이터 보관 정책
└─ backupSettings.html          # 백업 설정

필요한 기술:
- 권한 관리 UI
- 설정 검증
- 실시간 설정 적용
- 로깅/감사 추적
```

---

### E. 센서 & 제어 (🟡 중간 우선순위)

#### E1. Sensor (센서) - 10개 HTML

**v1 경로:** `/templates/sensor/`
**복잡도:** ⭐⭐⭐

```
센서 관리:
├─ sensorList.html              # 센서 목록
├─ sensorAdd.html
├─ sensorEdit.html
├─ sensorView.html
├─ sensorDetailList.html        # 센서 상세

센서 그룹:
├─ sensorGroupList.html
├─ sensorGroupAdd.html
├─ sensorGroupEdit.html
└─ sensorGroupView.html

필요한 기술:
- 센서 상태 모니터링
- 실시간 데이터
- 알람 관리
```

#### E2. Control (제어) - 4개 HTML

**v1 경로:** `/templates/control/`
**복잡도:** ⭐⭐

```
제어 관리:
├─ controlList.html
├─ controlAdd.html
├─ controlEdit.html
└─ controlView.html

필요한 기술:
- 원격 제어 인터페이스
- 명령 실행 로깅
- 안전 메커니즘
```

---

### F. 사이트/장소 관리 (🟡 중간 우선순위)

#### F1. Site (사이트) - 19개 HTML

**v1 경로:** `/templates/site/`
**복잡도:** ⭐⭐⭐

```
사이트:
├─ siteList.html                # 사이트 목록
├─ siteAdd.html
├─ siteEdit.html
├─ siteView.html
├─ siteSearchModal.html

층:
├─ floorList.html               # 층 목록
├─ floorAdd.html
├─ floorEdit.html
├─ floorView.html

구역:
├─ zoneList.html                # 구역 목록
├─ zoneAdd.html
├─ zoneEdit.html
├─ zoneView.html

공간:
├─ spaceList.html
├─ spaceView.html
└─ spaceModal.html

필요한 기술:
- 계층적 구조 표현
- 공간 시각화 (평면도)
- 검색/필터링
```

---

### G. 개인 기능 (🟢 낮은 우선순위)

#### G1. Personal (개인업무) - 5개 HTML

**v1 경로:** `/templates/personal/`

```
개인 작업:
├─ orderList.html
├─ orderAdd.html
├─ orderEdit.html
├─ orderView.html
└─ modal/siteUser.html
```

#### G2. Account (계정) - 6개 HTML

**v1 경로:** `/templates/account/`

```
인증:
├─ login.html                   # v2에 있음
├─ idFind.html                  # 아이디 찾기
└─ temporary/userList.html      # 임시 사용자

모달:
├─ modal/passwordChange.html    # 비밀번호 변경
└─ modal/userViewModal.html     # 사용자 보기
```

#### G3. MyPage (마이페이지) - 5개 HTML

**v1 경로:** `/templates/mypage/`

```
개인 페이지:
├─ myPageView.html
├─ profileEdit.html
├─ passwordChange.html
├─ notificationSettings.html
└─ myActivities.html
```

#### G4. NFC (NFC) - 8개 HTML

**v1 경로:** `/templates/nfc/`

```
NFC 관리:
├─ nfcDeviceList.html
├─ nfcDeviceAdd.html
├─ nfcDeviceEdit.html
├─ nfcTagScan.html
├─ nfcTagList.html
├─ nfcTagAdd.html
├─ nfcTagEdit.html
└─ nfcTagRead.html
```

#### G5. Tag (태그) - 5개 HTML

**v1 경로:** `/templates/tag/`

```
태그 관리:
├─ tagList.html
├─ tagAdd.html
├─ tagEdit.html
├─ tagView.html
└─ tagCategoryList.html
```

#### G6. Task (작업추적) - 2개 HTML

**v1 경로:** `/templates/task/`

```
작업:
├─ taskList.html
└─ taskView.html
```

#### G7. Invoice (청구서) - 6개 HTML

**v1 경로:** `/templates/invoice/`

```
청구서:
├─ invoiceList.html
├─ invoiceAdd.html
├─ invoiceEdit.html
├─ invoiceView.html
├─ invoiceDetailList.html
└─ invoiceSchedule.html
```

#### G8. Support (지원) - 7개 HTML

**v1 경로:** `/templates/support/`

```
지원 요청:
├─ supportList.html
├─ supportAdd.html
├─ supportEdit.html
├─ supportView.html
├─ supportCategoryList.html
├─ supportCommentList.html
└─ components/menuModal.html
```

#### G9. Privacy (개인정보) - 3개 HTML

**v1 경로:** `/templates/privacy/`

```
정책:
├─ policyView.html
├─ privacyTerms.html
└─ termsAcceptance.html
```

---

## Part 3: v1 주요 설계 패턴

### 3.1 페이지 라우팅 패턴

```
v1 (Spring MVC + Thymeleaf)
├─ GET  /module/list            → moduleList.html
├─ GET  /module/add             → moduleAdd.html
├─ GET  /module/{id}            → moduleView.html
├─ GET  /module/{id}/edit       → moduleEdit.html
├─ POST /api/module             → JSON (AJAX)
├─ PUT  /api/module/{id}        → JSON (AJAX)
└─ DELETE /api/module/{id}      → JSON (AJAX)

v2 (Next.js App Router)
├─ /module                      → page.tsx (목록)
├─ /module/new                  → page.tsx (신규)
├─ /module/[id]                 → page.tsx (상세)
├─ /module/[id]/edit            → page.tsx (수정)
├─ API Routes                   → /api/... routes (선택적)
└─ Server Actions               → actions.ts
```

### 3.2 공통 CRUD 패턴

```
v1:
1. List: 테이블 + 페이지네이션 + 필터
2. Add: 폼 + 검증 + 제출
3. View: 읽기전용 상세보기
4. Edit: 폼 + 검증 + 제출
5. Delete: 버튼 + 확인 + API 호출

v2:
1. page.tsx: DataTable + 검색 + 필터
2. new/page.tsx: 폼 (useFormContext)
3. [id]/page.tsx: 상세 + 탭 + InfoPanel
4. [id]/edit/page.tsx: 폼 (useFormContext)
5. Delete: 테이블 액션 또는 상세 페이지 버튼
```

### 3.3 모달/팝업 패턴

```
v1:
├─ Bootstrap Modal (v1 common/modals/)
├─ 각 페이지에서 inline 정의
├─ jQuery로 트리거
└─ 폼 또는 읽기 콘텐츠

v2:
├─ Dialog 컴포넌트 (shadcn/ui)
├─ 상태 관리 (Zustand)
├─ 조건부 렌더링
└─ 중첩 가능 (DialogProvider)
```

---

## Part 4: 통합 포인트 및 의존성

### 4.1 백엔드 API 의존성

```
모두 공통으로 사용: /Volumes/jinseok-SSD-1tb/00_insite/csp-was/

필수 API:
- /api/auth/*              (인증)
- /api/services/menus      (메뉴)

모듈별 API:
- /api/workOrder/*         (작업지시)
- /api/facility/*          (시설)
- /api/user/*              (사용자)
- /api/analysis/*          (분석)
- /api/bems/*              (BEMS)
- /api/becm/*              (BECM)
- ... (각 모듈마다)
```

### 4.2 공유 컴포넌트

```
v1 (common/):
├─ 레이아웃: header, navigator, footer
├─ 공통 컴포넌트: 버튼, 폼, 테이블
├─ 공통 모달: 확인, 검색, 기간 선택
└─ 공통 필터: 건물, 기간, 상태

v2 (필요 구현):
├─ components/ui/: shadcn/ui 컴포넌트
├─ components/shared/: 커스텀 공유 컴포넌트
├─ lib/hooks/: React Query 훅들
├─ lib/api/: API 클라이언트들
└─ lib/types/: 타입 정의들
```

### 4.3 권한/인증

```
v1:
- ROLE_SYSTEM_ADMIN
- ROLE_LABS_SYSTEM_ADMIN
- ROLE_COMPANY_ADMIN
- ... (역할 기반)

메뉴 필터링:
- RoleMenu (권한별 메뉴)
- ProductMenu (제품 기능별 메뉴)

v2 (예상):
- ROLE_* 동일 유지
- useAuth 훅으로 접근 제어
- middleware.ts로 라우트 보호
```

---

## Part 5: 마이그레이션 체크리스트 (상세)

### Phase 2: 분석 & 설정 (3-4개월)

```
[ ] Analysis 모듈
    [ ] 타입 정의 (lib/types/analysis.ts)
    [ ] API 클라이언트 (lib/api/analysis.ts)
    [ ] React Query 훅들
    [ ] 페이지들 (list, view, add, edit)
    [ ] 차트 컴포넌트

[ ] Settings 고도화
    [ ] 시스템 설정
    [ ] 사용자/권한 설정
    [ ] 장비/센서 설정
    [ ] ... (22개 설정)

[ ] Fieldwork 기초
    [ ] 모바일 라우트
    [ ] 현장 대시보드
    [ ] 위치 추적
```

### Phase 3: BEMS/BECM (6개월)

```
[ ] BEMS 3a단계
    [ ] 대시보드
    [ ] 기본 분석
    [ ] 실시간 모니터링

[ ] BECM 기초
    [ ] 성능 모니터링
    [ ] 장비 상태

[ ] 통합 테스트
```

---

**생성 날짜:** 2025-03-05
**분석 범위:** v1 585개 HTML (33개 모듈) | v2 11개 모듈
**다음 리뷰:** 2025-03-12
