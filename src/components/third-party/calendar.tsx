"use client";

import { type ReactNode, useState, useCallback, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import type {
  EventClickArg,
  EventDropArg,
  DateSelectArg,
  EventInput,
  DatesSetArg,
} from "@fullcalendar/core";
import koLocale from "@fullcalendar/core/locales/ko";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

/**
 * 캘린더 이벤트 타입
 */
export interface CalendarEvent {
  /** 이벤트 ID */
  id: string;
  /** 이벤트 제목 */
  title: string;
  /** 시작 일시 */
  start: Date | string;
  /** 종료 일시 (옵션) */
  end?: Date | string;
  /** 종일 이벤트 여부 */
  allDay?: boolean;
  /** 배경색 */
  backgroundColor?: string;
  /** 테두리색 */
  borderColor?: string;
  /** 텍스트색 */
  textColor?: string;
  /** 추가 데이터 */
  extendedProps?: Record<string, unknown>;
}

/**
 * 캘린더 뷰 타입
 */
export type CalendarView =
  | "dayGridMonth"
  | "timeGridWeek"
  | "timeGridDay"
  | "listWeek"
  | "listMonth";

/**
 * 캘린더 Props
 */
export interface CalendarProps {
  /** 이벤트 목록 */
  events?: CalendarEvent[];
  /** 초기 뷰 */
  initialView?: CalendarView;
  /** 초기 날짜 */
  initialDate?: Date | string;
  /** 헤더 툴바 표시 여부 */
  showHeader?: boolean;
  /** 날짜 선택 가능 여부 */
  selectable?: boolean;
  /** 이벤트 드래그 가능 여부 */
  editable?: boolean;
  /** 이벤트 클릭 핸들러 */
  onEventClick?: (event: CalendarEvent) => void;
  /** 날짜 선택 핸들러 */
  onDateSelect?: (start: Date, end: Date, allDay: boolean) => void;
  /** 이벤트 드롭 핸들러 */
  onEventDrop?: (event: CalendarEvent, newStart: Date, newEnd: Date | null) => void;
  /** 날짜 범위 변경 핸들러 */
  onDatesChange?: (start: Date, end: Date) => void;
  /** 높이 */
  height?: number | string;
  /** 클래스명 */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * 캘린더 컴포넌트
 *
 * FullCalendar 기반의 캘린더 컴포넌트입니다.
 * DHTMLX Scheduler를 대체합니다.
 *
 * @features
 * - 월간/주간/일간/목록 뷰
 * - 한국어 로케일
 * - 이벤트 드래그앤드롭
 * - 날짜 범위 선택
 * - 반응형 디자인
 *
 * @example
 * ```tsx
 * const events = [
 *   { id: "1", title: "정기점검", start: "2026-02-12", allDay: true },
 *   { id: "2", title: "미팅", start: "2026-02-12T10:00:00", end: "2026-02-12T11:00:00" },
 * ];
 *
 * <Calendar
 *   events={events}
 *   initialView="dayGridMonth"
 *   onEventClick={(event) => console.log(event)}
 *   onDateSelect={(start, end) => console.log(start, end)}
 *   editable
 *   selectable
 * />
 * ```
 */
export function Calendar({
  events = [],
  initialView = "dayGridMonth",
  initialDate,
  showHeader = true,
  selectable = false,
  editable = false,
  onEventClick,
  onDateSelect,
  onEventDrop,
  onDatesChange,
  height = "auto",
  className,
}: CalendarProps): ReactNode {
  // FullCalendar에 맞게 이벤트 변환
  const calendarEvents: EventInput[] = useMemo(() => {
    return events.map((event) => ({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: event.allDay,
      backgroundColor: event.backgroundColor,
      borderColor: event.borderColor ?? event.backgroundColor,
      textColor: event.textColor,
      extendedProps: event.extendedProps,
    }));
  }, [events]);

  // 이벤트 클릭 핸들러
  const handleEventClick = useCallback(
    (clickInfo: EventClickArg) => {
      if (!onEventClick) return;

      const event: CalendarEvent = {
        id: clickInfo.event.id,
        title: clickInfo.event.title,
        start: clickInfo.event.start ?? new Date(),
        end: clickInfo.event.end ?? undefined,
        allDay: clickInfo.event.allDay,
        backgroundColor: clickInfo.event.backgroundColor,
        borderColor: clickInfo.event.borderColor,
        textColor: clickInfo.event.textColor,
        extendedProps: clickInfo.event.extendedProps as Record<string, unknown>,
      };

      onEventClick(event);
    },
    [onEventClick]
  );

  // 날짜 선택 핸들러
  const handleDateSelect = useCallback(
    (selectInfo: DateSelectArg) => {
      if (!onDateSelect) return;
      onDateSelect(selectInfo.start, selectInfo.end, selectInfo.allDay);
    },
    [onDateSelect]
  );

  // 이벤트 드롭 핸들러
  const handleEventDrop = useCallback(
    (dropInfo: EventDropArg) => {
      if (!onEventDrop) return;

      const event: CalendarEvent = {
        id: dropInfo.event.id,
        title: dropInfo.event.title,
        start: dropInfo.event.start ?? new Date(),
        end: dropInfo.event.end ?? undefined,
        allDay: dropInfo.event.allDay,
        extendedProps: dropInfo.event.extendedProps as Record<string, unknown>,
      };

      onEventDrop(
        event,
        dropInfo.event.start ?? new Date(),
        dropInfo.event.end
      );
    },
    [onEventDrop]
  );

  // 날짜 범위 변경 핸들러
  const handleDatesSet = useCallback(
    (dateInfo: DatesSetArg) => {
      if (!onDatesChange) return;
      onDatesChange(dateInfo.start, dateInfo.end);
    },
    [onDatesChange]
  );

  // 헤더 툴바 설정
  const headerToolbar = showHeader
    ? {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
      }
    : false;

  return (
    <div className={cn("calendar-wrapper", className)}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView={initialView}
        initialDate={initialDate}
        locale={koLocale}
        headerToolbar={headerToolbar}
        events={calendarEvents}
        selectable={selectable}
        editable={editable}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        height={height}
        eventClick={handleEventClick}
        select={handleDateSelect}
        eventDrop={handleEventDrop}
        datesSet={handleDatesSet}
        // 스타일 관련
        eventDisplay="block"
        dayHeaderFormat={{ weekday: "short" }}
        slotLabelFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        // 버튼 텍스트 한국어화
        buttonText={{
          today: "오늘",
          month: "월",
          week: "주",
          day: "일",
          list: "목록",
        }}
        // 제목 포맷
        titleFormat={{ year: "numeric", month: "long" }}
        // 반응형 뷰
        views={{
          dayGridMonth: {
            titleFormat: { year: "numeric", month: "long" },
          },
          timeGridWeek: {
            titleFormat: { year: "numeric", month: "short", day: "numeric" },
          },
          timeGridDay: {
            titleFormat: { year: "numeric", month: "long", day: "numeric" },
          },
        }}
      />
    </div>
  );
}

// ============================================================================
// Mini Calendar (Compact Version)
// ============================================================================

export interface MiniCalendarProps {
  /** 선택된 날짜 */
  selectedDate?: Date;
  /** 날짜 선택 핸들러 */
  onDateSelect?: (date: Date) => void;
  /** 이벤트가 있는 날짜 (점 표시) */
  eventDates?: Date[];
  /** 클래스명 */
  className?: string;
}

/**
 * 미니 캘린더 컴포넌트
 *
 * 날짜 선택용 소형 캘린더입니다.
 *
 * @example
 * ```tsx
 * <MiniCalendar
 *   selectedDate={new Date()}
 *   onDateSelect={(date) => setDate(date)}
 *   eventDates={[new Date("2026-02-10"), new Date("2026-02-15")]}
 * />
 * ```
 */
export function MiniCalendar({
  selectedDate,
  onDateSelect,
  eventDates = [],
  className,
}: MiniCalendarProps): ReactNode {
  const handleDateClick = useCallback(
    (info: { date: Date }) => {
      onDateSelect?.(info.date);
    },
    [onDateSelect]
  );

  // 이벤트 날짜를 FullCalendar 이벤트로 변환 (점 표시용)
  const dotEvents: EventInput[] = useMemo(() => {
    return eventDates.map((date, index) => ({
      id: `dot-${index}`,
      start: date,
      allDay: true,
      display: "background",
      backgroundColor: "hsl(var(--primary) / 0.2)",
    }));
  }, [eventDates]);

  return (
    <div className={cn("mini-calendar", className)}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        initialDate={selectedDate}
        locale={koLocale}
        headerToolbar={{
          left: "prev",
          center: "title",
          right: "next",
        }}
        height="auto"
        events={dotEvents}
        dateClick={handleDateClick}
        fixedWeekCount={false}
        showNonCurrentDates={false}
        dayHeaderFormat={{ weekday: "narrow" }}
        titleFormat={{ year: "numeric", month: "short" }}
        buttonText={{
          today: "오늘",
        }}
      />
    </div>
  );
}
