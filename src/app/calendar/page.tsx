"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useJobs } from "@/lib/storage";
import { STATUS_META } from "@/lib/types";

export default function CalendarPage() {
  const jobs = useJobs();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const interviewsByDate = useMemo(() => {
    const map: Record<string, { title: string; company: string; status: string }[]> = {};
    jobs.forEach(job => {
      job.interviews.forEach(interview => {
        if (!interview.completed) {
          const dateKey = interview.date;
          if (!map[dateKey]) map[dateKey] = [];
          map[dateKey].push({
            title: interview.title,
            company: job.company,
            status: job.status,
          });
        }
      });
    });
    return map;
  }, [jobs]);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const days = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  const today = new Date();
  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const formatDate = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="border-b">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <h1 className="text-2xl font-bold">Interview Calendar</h1>
          <p className="mt-1 text-sm text-muted-foreground">Upcoming interviews and events</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth} className="inline-flex h-8 items-center rounded-lg border border-border bg-background px-3 text-sm font-medium hover:bg-muted">
            <ChevronLeft className="size-4" />
          </button>
          <h2 className="text-lg font-semibold">{monthName}</h2>
          <button onClick={nextMonth} className="inline-flex h-8 items-center rounded-lg border border-border bg-background px-3 text-sm font-medium hover:bg-muted">
            <ChevronRight className="size-4" />
          </button>
        </div>

        {/* Calendar grid */}
        <div className="rounded-xl border bg-card">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-xs font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7">
            {days.map((day, i) => {
              if (day === null) {
                return <div key={`empty-${i}`} className="min-h-24 border-b border-r p-1" />;
              }
              const dateStr = formatDate(day);
              const events = interviewsByDate[dateStr] || [];
              return (
                <div key={day} className={`min-h-24 border-b border-r p-1 ${isToday(day) ? 'bg-primary/5' : ''}`}>
                  <span className={`inline-flex size-6 items-center justify-center rounded-full text-xs ${isToday(day) ? 'bg-primary text-primary-foreground font-medium' : ''}`}>
                    {day}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {events.slice(0, 2).map((event, j) => (
                      <div key={j} className={`truncate rounded px-1 py-0.5 text-[10px] font-medium text-white ${STATUS_META[event.status as keyof typeof STATUS_META]?.accent || 'bg-sky-500'}`}>
                        {event.title}
                      </div>
                    ))}
                    {events.length > 2 && (
                      <p className="text-[10px] text-muted-foreground">+{events.length - 2} more</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
