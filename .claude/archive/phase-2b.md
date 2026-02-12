# Phase 2B: 위젯 프레임워크 + 서드파티 + BIM PoC

## 개요

대시보드 위젯 시스템의 기반을 구축하고, 기존 서드파티 라이브러리를 대체합니다.
BIM PoC를 조기에 진행하여 고위험 항목을 검증합니다.

## 2B.1 대시보드 위젯 프레임워크 ✅ 완료

| 컴포넌트 | 상태 | 설명 |
|----------|------|------|
| WidgetGrid | ✅ | react-grid-layout 기반 6×N Grid, 드래그앤드롭+리사이즈 |
| WidgetContainer | ✅ | header/body/footer 슬롯, 7가지 사이즈 클래스 |
| WidgetRegistry | ✅ | ID → 컴포넌트 매핑, lazy import, DynamicWidget |
| WidgetSkeleton | ✅ | 로딩 스켈레톤 |
| WidgetErrorBoundary | ✅ | 위젯별 에러 처리, 커스텀 폴백 UI |

### 기본 위젯 구현체 ✅

| 위젯 | 상태 | 설명 |
|------|------|------|
| ChartWidget | ✅ | Bar/Line/Area 차트, API 데이터 연동 지원 |
| TableWidget | ✅ | 테이블 위젯, StatusBadge 자동 렌더링 |
| KPIWidget | ✅ | KPI 통계 위젯 |
| ListWidget | ✅ | 목록 위젯 |

### 유틸리티 함수

- `sizeToLayout()` - 위젯 사이즈를 레이아웃으로 변환
- `addWidgetToLayout()` - 레이아웃에 위젯 추가 (빈 공간 자동 탐색)
- `removeWidgetFromLayout()` - 레이아웃에서 위젯 제거
- `saveLayout()` / `loadLayout()` - 레이아웃 localStorage 저장/복원

## 2B.2 서드파티 대체 컴포넌트 ✅ 완료 (4/5)

| 기존 | 대체 | 상태 | 설명 |
|------|------|------|------|
| DHTMLX Scheduler | FullCalendar | ✅ | Calendar, MiniCalendar 컴포넌트, 한국어 로케일 |
| Summernote | Tiptap | ✅ | RichTextEditor, RichTextViewer 컴포넌트, 전체 서식 지원 |
| DHTMLX Spreadsheet | SheetJS | ⏳ | 스프레드시트 (필요시 구현) |
| 카카오맵 (기존) | react-kakao-maps-sdk | ✅ | KakaoMapComponent, StaticMap, useGeocode 훅 |
| printThis | react-to-print | ✅ | PrintButton, PrintContainer, usePrint 훅 |

### 구현된 서드파티 컴포넌트

#### Calendar (FullCalendar 기반)
- `Calendar` - 월간/주간/일간/목록 뷰, 이벤트 드래그앤드롭
- `MiniCalendar` - 소형 날짜 선택 캘린더
- 한국어 로케일 기본 적용

#### RichTextEditor (Tiptap 기반)
- `RichTextEditor` - WYSIWYG 에디터, 전체 툴바
- `RichTextViewer` - 읽기 전용 뷰어
- 제목, 서식, 정렬, 목록, 링크, 이미지, 형광펜 지원

#### KakaoMap (react-kakao-maps-sdk 기반)
- `KakaoMapComponent` - 마커, 클러스터링, 인포윈도우
- `StaticMap` - 정적 지도 이미지
- `useMapBounds` - 마커 기반 범위 계산
- `useGeocode` - 주소↔좌표 변환

#### PrintButton (react-to-print 기반)
- `PrintButton` - 인쇄 버튼 컴포넌트
- `PrintContainer` - 인쇄 영역 래퍼
- `usePrint` - 커스텀 인쇄 훅

## 2B.3 BIM PoC (고위험 항목)

> Phase 6 시작 전까지 기술 결정을 완료해야 합니다.

- [ ] Three.js + IFC.js 프로토타입
- [ ] 기존 HOOPS 기능과 비교 문서
- [ ] 성능/비용 분석 보고서

### 참조

- 기존 BIM 뷰어: `csp-web/.../cleaningBimView.html`
- HOOPS 설정: csp-web 내 HOOPS 관련 코드

## 2B.4 테스트

- [ ] 위젯 프레임워크 통합 테스트
- [ ] 서드파티 컴포넌트 렌더링/기능 테스트

## 의존성

```bash
npm install react-grid-layout @fullcalendar/react @fullcalendar/daygrid @tiptap/react xlsx react-to-print
```

## 완료 기준

- [ ] 위젯 프레임워크 동작 확인
- [ ] 모든 서드파티 대체 완료
- [ ] BIM 기술 결정 완료
- [ ] 테스트 통과
