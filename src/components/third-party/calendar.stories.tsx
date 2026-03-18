import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Calendar, MiniCalendar, type CalendarEvent } from "./calendar";

const meta = {
  title: "Components/ThirdParty/Calendar",
  component: Calendar,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

// 샘플 이벤트 데이터
const sampleEvents = [
  {
    id: "1",
    title: "정기점검 (빌딩 A)",
    start: "2026-03-10",
    allDay: true,
    backgroundColor: "#3b82f6",
  },
  {
    id: "2",
    title: "미팅",
    start: "2026-03-12T10:00:00",
    end: "2026-03-12T11:00:00",
    backgroundColor: "#10b981",
  },
  {
    id: "3",
    title: "설비 유지보수",
    start: "2026-03-15",
    allDay: true,
    backgroundColor: "#f59e0b",
  },
  {
    id: "4",
    title: "보고서 제출",
    start: "2026-03-17T14:00:00",
    end: "2026-03-17T15:00:00",
    backgroundColor: "#8b5cf6",
  },
  {
    id: "5",
    title: "에너지 감시",
    start: "2026-03-20T09:00:00",
    end: "2026-03-20T17:00:00",
    backgroundColor: "#ec4899",
  },
];

const manyEventsData = [
  ...sampleEvents,
  {
    id: "6",
    title: "야간 점검",
    start: "2026-03-21T18:00:00",
    end: "2026-03-21T22:00:00",
    backgroundColor: "#6366f1",
  },
  {
    id: "7",
    title: "긴급 대응",
    start: "2026-03-22T08:00:00",
    end: "2026-03-22T10:00:00",
    backgroundColor: "#ef4444",
  },
];

export const Default: Story = {
  args: {
    events: sampleEvents,
    initialView: "dayGridMonth",
    showHeader: true,
    height: "auto",
  },
};

export const WithEvents: Story = {
  render: () => {
    const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
    return (
      <div className="space-y-4">
        <Calendar
          events={sampleEvents}
          initialView="dayGridMonth"
          onEventClick={(event) => setSelectedEvent(event.id)}
          showHeader={true}
          height={500}
        />
        {selectedEvent && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-900">
              선택된 이벤트: {sampleEvents.find((e) => e.id === selectedEvent)?.title}
            </p>
          </div>
        )}
      </div>
    );
  },
};

export const MultiMonth: Story = {
  render: () => {
    const [currentDate, setCurrentDate] = useState(new Date("2026-03-01"));
    return (
      <div className="space-y-4">
        <Calendar
          events={sampleEvents}
          initialView="dayGridMonth"
          initialDate={currentDate}
          onDatesChange={(start, end) => {
            setCurrentDate(start);
          }}
          showHeader={true}
          height={600}
        />
        <p className="text-sm text-muted-foreground">
          현재 월: {currentDate.toLocaleDateString("ko-KR")}
        </p>
      </div>
    );
  },
};

export const DateRange: Story = {
  render: () => {
    const [selectedRange, setSelectedRange] = useState<{
      start: Date;
      end: Date;
    } | null>(null);
    return (
      <div className="space-y-4">
        <Calendar
          events={sampleEvents}
          initialView="dayGridMonth"
          selectable={true}
          onDateSelect={(start, end) => setSelectedRange({ start, end })}
          showHeader={true}
          height={500}
        />
        {selectedRange && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-900">
              선택된 기간: {selectedRange.start.toLocaleDateString("ko-KR")} ~{" "}
              {selectedRange.end.toLocaleDateString("ko-KR")}
            </p>
          </div>
        )}
      </div>
    );
  },
};

export const Editable: Story = {
  render: () => {
    const [events, setEvents] = useState<CalendarEvent[]>(sampleEvents);
    return (
      <Calendar
        events={events}
        initialView="dayGridMonth"
        editable={true}
        onEventDrop={(event, newStart, newEnd) => {
          setEvents((prev) =>
            prev.map((e) =>
              e.id === event.id
                ? { ...e, start: newStart.toISOString(), end: newEnd ? newEnd.toISOString() : undefined }
                : e
            )
          );
        }}
        showHeader={true}
        height={500}
      />
    );
  },
};

export const WeekView: Story = {
  args: {
    events: sampleEvents,
    initialView: "timeGridWeek",
    showHeader: true,
    height: 600,
  },
};

export const DayView: Story = {
  args: {
    events: sampleEvents,
    initialView: "timeGridDay",
    initialDate: "2026-03-12",
    showHeader: true,
    height: 600,
  },
};

export const ListView: Story = {
  args: {
    events: sampleEvents,
    initialView: "listMonth",
    showHeader: true,
    height: 400,
  },
};

export const ListWeekView: Story = {
  args: {
    events: sampleEvents,
    initialView: "listWeek",
    initialDate: "2026-03-12",
    showHeader: true,
    height: 400,
  },
};

export const WithoutHeader: Story = {
  args: {
    events: sampleEvents,
    initialView: "dayGridMonth",
    showHeader: false,
    height: 500,
  },
};

export const ManyEvents: Story = {
  args: {
    events: manyEventsData,
    initialView: "dayGridMonth",
    showHeader: true,
    height: 550,
  },
};

export const Readonly: Story = {
  args: {
    events: sampleEvents,
    initialView: "dayGridMonth",
    selectable: false,
    editable: false,
    showHeader: true,
    height: 500,
  },
};

export const LargeHeight: Story = {
  args: {
    events: sampleEvents,
    initialView: "dayGridMonth",
    showHeader: true,
    height: 700,
  },
};

export const Empty: Story = {
  args: {
    events: [],
    initialView: "dayGridMonth",
    showHeader: true,
    height: 500,
  },
};

export const CompleteScenario: Story = {
  render: () => {
    const [events, setEvents] = useState<CalendarEvent[]>(sampleEvents);
    const [view, setView] = useState<
      "dayGridMonth" | "timeGridWeek" | "timeGridDay" | "listWeek" | "listMonth"
    >("dayGridMonth");
    const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

    return (
      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setView("dayGridMonth")}
            className={`px-3 py-1 rounded text-sm ${
              view === "dayGridMonth"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            월간
          </button>
          <button
            onClick={() => setView("timeGridWeek")}
            className={`px-3 py-1 rounded text-sm ${
              view === "timeGridWeek"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            주간
          </button>
          <button
            onClick={() => setView("timeGridDay")}
            className={`px-3 py-1 rounded text-sm ${
              view === "timeGridDay"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            일간
          </button>
        </div>

        <Calendar
          events={events}
          initialView={view}
          onEventClick={(event) => setSelectedEvent(event.id)}
          editable={true}
          selectable={true}
          onEventDrop={(event, newStart, newEnd) => {
            setEvents((prev) =>
              prev.map((e) =>
                e.id === event.id
                  ? { ...e, start: newStart, end: newEnd || undefined }
                  : e
              )
            );
          }}
          showHeader={true}
          height={550}
        />

        {selectedEvent && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-900">
              선택된 이벤트: {events.find((e) => e.id === selectedEvent)?.title}
            </p>
          </div>
        )}
      </div>
    );
  },
};

export const MiniCalendarDefault: Story = {
  render: () => {
    const [date, setDate] = useState(new Date("2026-03-15"));
    return (
      <div className="w-full max-w-xs">
        <MiniCalendar selectedDate={date} onDateSelect={setDate} />
        <div className="mt-4 text-sm text-muted-foreground">
          선택된 날짜: {date.toLocaleDateString("ko-KR")}
        </div>
      </div>
    );
  },
};

export const MiniCalendarWithEvents: Story = {
  render: () => {
    const [date, setDate] = useState(new Date("2026-03-15"));
    const eventDates = [
      new Date("2026-03-10"),
      new Date("2026-03-12"),
      new Date("2026-03-15"),
      new Date("2026-03-20"),
    ];
    return (
      <div className="w-full max-w-xs">
        <MiniCalendar
          selectedDate={date}
          onDateSelect={setDate}
          eventDates={eventDates}
        />
        <div className="mt-4 text-sm text-muted-foreground">
          선택된 날짜: {date.toLocaleDateString("ko-KR")}
        </div>
      </div>
    );
  },
};

export const CalendarWithMiniCalendar: Story = {
  render: () => {
    const [date, setDate] = useState(new Date("2026-03-15"));
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <MiniCalendar
            selectedDate={date}
            onDateSelect={setDate}
            eventDates={sampleEvents.map((e) => new Date(e.start))}
          />
        </div>
        <div className="lg:col-span-3">
          <Calendar
            events={sampleEvents}
            initialView="dayGridMonth"
            initialDate={date}
            showHeader={true}
            height={500}
          />
        </div>
      </div>
    );
  },
};
