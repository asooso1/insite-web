# Phase 2B: 위젯 프레임워크 + 서드파티 + BIM PoC

## 개요

대시보드 위젯 시스템의 기반을 구축하고, 기존 서드파티 라이브러리를 대체합니다.
BIM PoC를 조기에 진행하여 고위험 항목을 검증합니다.

## 2B.1 대시보드 위젯 프레임워크

| 컴포넌트 | 상태 | 설명 |
|----------|------|------|
| WidgetGrid | ⏳ | react-grid-layout 기반 6×N Grid, 드래그앤드롭+리사이즈 |
| WidgetContainer | ⏳ | header/body/footer 슬롯, 7가지 사이즈 클래스 |
| WidgetRegistry | ⏳ | ID → 컴포넌트 매핑, lazy import |
| WidgetSkeleton | ⏳ | 로딩 스켈레톤 |
| WidgetErrorBoundary | ⏳ | 위젯별 에러 처리 |

### 기본 위젯 구현체

- chart-widget
- table-widget
- kpi-widget
- list-widget

## 2B.2 서드파티 대체 컴포넌트

| 기존 | 대체 | 상태 | 설명 |
|------|------|------|------|
| DHTMLX Scheduler | FullCalendar | ⏳ | 캘린더/스케줄러 |
| Summernote | Tiptap | ⏳ | WYSIWYG 에디터 |
| DHTMLX Spreadsheet | SheetJS | ⏳ | 스프레드시트 |
| 카카오맵 (기존) | 카카오맵 (React) | ⏳ | 동적 import |
| printThis | react-to-print | ⏳ | 인쇄 기능 |

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
