/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCalendarController } from "../logic/calendarLogic";
import { ChevronLeft, ChevronRight, Plus, Calendar, Clock, Bookmark } from "lucide-react";

export function CalendarWorkspace() {
  const c = useCalendarController();

  // Create list of blank offset days and month day numbers
  const offsetDays = Array.from({ length: c.startDayOffset }, (_, i) => i);
  const monthDays = Array.from({ length: c.daysInMonth }, (_, i) => i + 1);

  return (
    <div className="flex h-full gap-6">
      {/* Calendar Grid Section */}
      <div className="w-[55%] flex flex-col gap-4 pr-4 border-r border-white/10">
        <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/5">
          <button
            onClick={c.handlePrevMonth}
            className="p-1.5 hover:bg-white/10 rounded-lg text-white/70 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <h3 className="font-bold text-white text-sm tracking-tight select-none">
            {c.currentMonthName} {c.currentYear}
          </h3>
          
          <button
            onClick={c.handleNextMonth}
            className="p-1.5 hover:bg-white/10 rounded-lg text-white/70 transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Calendar Day Header */}
        <div className="grid grid-cols-7 text-center text-xs font-semibold text-white/40 border-b border-white/5 pb-2 select-none">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        {/* Days Grid Wrapper */}
        <div className="grid grid-cols-7 gap-1.5 flex-1 min-h-[180px]">
          {offsetDays.map((_, i) => (
            <div key={`offset-${i}`} className="p-2 opacity-0" />
          ))}

          {monthDays.map((day) => {
            const dateStr = c.formatDateString(day);
            const isSelected = c.selectedDate === dateStr;
            const dailyEvents = c.events.filter((e) => e.date === dateStr);
            const hasEvent = dailyEvents.length > 0;

            return (
              <button
                key={`day-${day}`}
                onClick={() => c.setSelectedDate(dateStr)}
                className={`p-2 rounded-xl text-xs font-semibold flex flex-col items-center justify-between min-h-[44px] transition-all cursor-pointer relative border ${
                  isSelected
                    ? "bg-rose-500/20 border-rose-400/40 text-rose-200"
                    : "bg-white/5 border-transparent text-white/70 hover:bg-white/10"
                }`}
              >
                <span>{day}</span>
                {/* Event Dot Indicators */}
                {hasEvent && (
                  <span className="flex gap-0.5 justify-center mt-1">
                    {dailyEvents.map((ev, index) => (
                      <span
                        key={ev.id || index}
                        className={`w-1.5 h-1.5 rounded-full ${
                          ev.category === "work" ? "bg-rose-400" : "bg-cyan-400"
                        }`}
                      />
                    ))}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Timeline & Add On-page event Form */}
      <div className="flex-grow flex flex-col gap-5 overflow-y-auto pl-2">
        {/* Timeline Header */}
        <div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Events on</span>
          <h4 className="text-sm font-bold text-rose-200 flex items-center gap-1.5 mt-0.5 select-none">
            <Calendar className="w-4 h-4" /> {c.selectedDate === "2026-06-12" ? "Today" : c.selectedDate}
          </h4>
        </div>

        {/* Event List */}
        <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto">
          {c.activeEvents.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-500 bg-white/5 rounded-2xl border border-white/5 select-none">
              No meetings scheduled for this date
            </div>
          ) : (
            c.activeEvents.map((evt) => (
              <div
                key={evt.id}
                className={`p-3.5 rounded-xl border flex flex-col gap-1 ${
                  evt.category === "work"
                    ? "bg-rose-500/10 border-rose-500/20 text-rose-200"
                    : "bg-cyan-500/10 border-cyan-500/20 text-cyan-200"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs">{evt.title}</span>
                  <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-black/20">
                    {evt.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-350">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {evt.time}</span>
                  <span>({evt.duration})</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create event Form fields */}
        <form onSubmit={c.handleCreateEvent} className="flex flex-col gap-3.5 bg-white/5 p-4 rounded-2xl border border-white/5">
          <span className="text-xs font-semibold uppercase text-white/40 tracking-wider">Fast Schedule Event</span>
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2 flex flex-col gap-1">
              <input
                type="text"
                required
                placeholder="Meeting name"
                value={c.newEventTitle}
                onChange={(e) => c.setNewEventTitle(e.target.value)}
                className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-rose-400 placeholder-slate-500"
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <input
                type="time"
                value={c.newEventTime}
                onChange={(e) => c.setNewEventTime(e.target.value)}
                className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-rose-400"
              />
            </div>

            <div className="flex flex-col gap-1">
              <select
                value={c.newEventCategory}
                onChange={(e) => c.setNewEventCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-xl text-xs text-white focus:outline-none hover:bg-black/30"
              >
                <option value="work">Work category</option>
                <option value="personal">Personal Category</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center gap-1.5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs cursor-pointer transition-all border border-white/10"
          >
            <Plus className="w-3.5 h-3.5" /> Book on timeline
          </button>
        </form>
      </div>
    </div>
  );
}

export default CalendarWorkspace;
