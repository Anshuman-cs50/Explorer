/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { store } from "./explorerStore";
import { CalendarEvent } from "../types";

export function useCalendarController() {
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(5); // June (0-indexed: 5 is June)
  const [selectedDate, setSelectedDate] = useState<string>("2026-06-12");

  // Form State
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventTime, setNewEventTime] = useState("10:00");
  const [newEventDuration, setNewEventDuration] = useState("1 hr");
  const [newEventCategory, setNewEventCategory] = useState<"work" | "personal">("work");

  const events = store.getState().calendar;

  const currentMonthName = useMemo(() => {
    const d = new Date(currentYear, currentMonth, 1);
    return d.toLocaleString("default", { month: "long" });
  }, [currentYear, currentMonth]);

  // Generate days for standard calendar grid (June 2026 starts on Monday)
  const daysInMonth = useMemo(() => {
    const date = new Date(currentYear, currentMonth + 1, 0);
    return date.getDate();
  }, [currentYear, currentMonth]);

  const startDayOffset = useMemo(() => {
    // day of week of 1st day of month
    const date = new Date(currentYear, currentMonth, 1);
    return date.getDay(); // 0 is Sunday, 1 is Monday...
  }, [currentYear, currentMonth]);

  const activeEvents = useMemo(() => {
    return events.filter((e) => e.date === selectedDate);
  }, [events, selectedDate]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle) return;

    store.addCalendarEvent({
      title: newEventTitle,
      date: selectedDate,
      time: newEventTime,
      duration: newEventDuration,
      category: newEventCategory,
    });

    // Reset Form
    setNewEventTitle("");
    setNewEventTime("10:00");
    setNewEventDuration("1 hr");
  };

  // Helper to format days: "YYYY-MM-DD" style
  const formatDateString = (day: number) => {
    const mm = String(currentMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${currentYear}-${mm}-${dd}`;
  };

  return {
    currentYear,
    currentMonth,
    currentMonthName,
    daysInMonth,
    startDayOffset,
    selectedDate,
    setSelectedDate,
    activeEvents,
    handlePrevMonth,
    handleNextMonth,
    handleCreateEvent,
    newEventTitle,
    setNewEventTitle,
    newEventTime,
    setNewEventTime,
    newEventDuration,
    setNewEventDuration,
    newEventCategory,
    setNewEventCategory,
    formatDateString,
    events,
  };
}
