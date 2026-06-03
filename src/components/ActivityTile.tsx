"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChartIcon } from "@radix-ui/react-icons";

interface ActivityTileProps {
  activity: Record<string, number>;
}

export default function ActivityTile({ activity }: ActivityTileProps) {
  const { grid, monthLabels, totalLessonsCompleted, activeDays, peakDayActivity } = useMemo(() => {
    const today = new Date();
    const startOfGrid = new Date();
    startOfGrid.setDate(today.getDate() - 364);
    const startDayOfWeek = startOfGrid.getDay();
    startOfGrid.setDate(startOfGrid.getDate() - startDayOfWeek);
    
    const calculatedGrid: Date[][] = [];
    const currentDate = new Date(startOfGrid);
    
    for (let w = 0; w < 53; w++) {
      const week: Date[] = [];
      for (let d = 0; d < 7; d++) {
        week.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      calculatedGrid.push(week);
    }

    const labels: { label: string; colIndex: number }[] = [];
    let lastMonth = -1;
    calculatedGrid.forEach((week, wIndex) => {
      const month = week[3].getMonth();
      if (month !== lastMonth) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        labels.push({ label: monthNames[month], colIndex: wIndex });
        lastMonth = month;
      }
    });

    let total = 0;
    let days = 0;
    let peak = 0;

    Object.entries(activity).forEach(([dateStr, count]) => {
      total += count;
      if (count > 0) {
        days += 1;
        if (count > peak) {
          peak = count;
        }
      }
    });

    return {
      grid: calculatedGrid,
      monthLabels: labels,
      totalLessonsCompleted: total,
      activeDays: days,
      peakDayActivity: peak,
    };
  }, [activity]);

  const getColorClass = (count: number) => {
    if (count === 0) return "bg-zinc-800/80 border border-zinc-900/50 hover:bg-zinc-700";
    if (count <= 1) return "bg-emerald-950/80 hover:bg-emerald-900";
    if (count <= 3) return "bg-emerald-700/80 hover:bg-emerald-600";
    if (count <= 5) return "bg-emerald-500 hover:bg-emerald-400";
    return "bg-emerald-400 hover:bg-emerald-300";
  };

  return (
    <motion.section
      whileHover={{
        y: -4,
        scale: 1.01,
        borderColor: "#10b981",
        boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.2), 0 0 12px rgba(16, 185, 129, 0.15)"
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between gap-6 transition-colors duration-150 relative group will-change-transform"
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <BarChartIcon className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight font-sans">Activity Log</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-zinc-950 border border-zinc-800/60 p-4 rounded-xl">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Lessons Finished</span>
          <p className="text-xl font-black text-zinc-100">{totalLessonsCompleted}</p>
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Active Days</span>
          <p className="text-xl font-black text-zinc-100">{activeDays} Days</p>
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Peak Daily Output</span>
          <p className="text-xl font-black text-zinc-100">{peakDayActivity} units</p>
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Completion Rate</span>
          <p className="text-xl font-black text-zinc-100">
            {activeDays > 0 ? (totalLessonsCompleted / activeDays).toFixed(1) : "0.0"} / Day
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 overflow-x-auto w-full py-1 scrollbar-thin select-none">
        <div className="relative h-4 text-[9px] text-zinc-500 font-bold tracking-wider uppercase mb-1">
          {monthLabels.map((lbl, idx) => (
            <span
              key={idx}
              className="absolute"
              style={{ left: `${lbl.colIndex * 13}px` }}
            >
              {lbl.label}
            </span>
          ))}
        </div>

        <div className="flex gap-[3px] pt-6">
          <div className="flex flex-col justify-between text-[9px] text-zinc-600 font-bold uppercase w-5 pr-1 py-[2px] h-[88px] shrink-0">
            <span>Sun</span>
            <span>Tue</span>
            <span>Thu</span>
            <span>Sat</span>
          </div>

          <div className="flex gap-[3px] flex-1">
            {grid.map((week, wIndex) => (
              <div key={wIndex} className="flex flex-col gap-[3px] shrink-0">
                {week.map((day, dIndex) => {
                  const dateStr = day.toISOString().split("T")[0];
                  const count = activity[dateStr] || 0;
                  
                  return (
                    <div key={dIndex} className="relative group/cell">
                      <div
                        className={`w-[10px] h-[10px] rounded-[1px] transition-transform duration-100 hover:scale-125 cursor-pointer will-change-transform ${getColorClass(count)}`}
                      />
                      
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/cell:flex flex-col items-center z-50 pointer-events-none">
                        <div className="bg-zinc-950 text-zinc-200 border border-zinc-800 text-[9px] font-bold py-1 px-2 rounded-md shadow-2xl whitespace-nowrap leading-none">
                          {count === 1 ? "1 lesson" : `${count} lessons`} on {new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="w-1.5 h-1.5 bg-zinc-950 border-r border-b border-zinc-800 rotate-45 mt-[-4px]" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-zinc-500 font-medium border-t border-zinc-800/80 pt-3">
        <span>Showing past 365 days of learning records</span>
        <div className="flex items-center gap-1.5 font-semibold">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-[1px] bg-zinc-800/80 border border-zinc-900/50" />
          <div className="w-2.5 h-2.5 rounded-[1px] bg-emerald-950/80" />
          <div className="w-2.5 h-2.5 rounded-[1px] bg-emerald-700/80" />
          <div className="w-2.5 h-2.5 rounded-[1px] bg-emerald-500" />
          <div className="w-2.5 h-2.5 rounded-[1px] bg-emerald-400" />
          <span>More</span>
        </div>
      </div>
    </motion.section>
  );
}
