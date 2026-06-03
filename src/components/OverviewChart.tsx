"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Noise from "./Noise";

interface OverviewChartProps {
  totalXp: number;
  totalHours: number;
}

type TabId = "xp" | "minutes" | "solved";

export default function OverviewChart({ totalXp, totalHours }: OverviewChartProps) {
  const [activeTab, setActiveTab] = useState<TabId>("xp");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const data = {
    xp: {
      label: "XP Gained",
      displayValue: `${totalXp.toLocaleString()} XP`,
      values: [1800, 4200, 2800, 4500, 2200, 4700, 2800, 4400, 3000, 4200, 4600, 3500],
      unit: "XP",
      max: 6000,
      color: "#6366f1",
    },
    minutes: {
      label: "Minutes Learned",
      displayValue: `${(totalHours * 60).toLocaleString()} mins`,
      values: [1200, 3800, 2200, 4100, 1800, 4500, 2400, 3900, 2600, 3700, 4300, 3100],
      unit: "mins",
      max: 6000,
      color: "#10b981",
    },
    solved: {
      label: "Questions Solved",
      displayValue: "6,253",
      values: [800, 2900, 1900, 3500, 1500, 4200, 2100, 3400, 2000, 3100, 3900, 2500],
      unit: "tasks",
      max: 6000,
      color: "#f59e0b",
    },
  };

  const activeData = data[activeTab];
  const width = 1000;
  const height = 280;
  const paddingX = 60;
  const paddingY = 40;

  const points = activeData.values.map((val, i) => {
    const x = paddingX + (i * (width - 2 * paddingX)) / 11;
    const y = height - paddingY - (val / activeData.max) * (height - 2 * paddingY);
    return { x, y };
  });

  const getBezierPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return "";
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const curr = pts[i];
      const next = pts[i + 1];
      const cpX1 = curr.x + (next.x - curr.x) / 3;
      const cpY1 = curr.y;
      const cpX2 = next.x - (next.x - curr.x) / 3;
      const cpY2 = next.y;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
    }
    return path;
  };

  const linePath = getBezierPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden relative group">
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-0 mix-blend-overlay">
        <Noise patternAlpha={75} />
      </div>
      <div className="flex flex-col md:flex-row md:items-stretch justify-between border-b border-zinc-800 bg-zinc-900/50">
        <div className="p-6 flex items-center">
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight font-sans">Overview</h2>
        </div>
        
        <div className="grid grid-cols-3 border-t md:border-t-0 border-zinc-800 md:divide-x divide-zinc-800">
          {(Object.keys(data) as TabId[]).map((tabKey) => {
            const tab = data[tabKey];
            const isActive = activeTab === tabKey;
            return (
              <button
                key={tabKey}
                onClick={() => setActiveTab(tabKey)}
                className={`flex flex-col justify-center px-4 py-3 md:px-8 md:py-5 text-left cursor-pointer transition-all duration-200 ${
                  isActive
                    ? "bg-zinc-800 text-zinc-50"
                    : "hover:bg-zinc-900/30 text-zinc-400"
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  {tab.label}
                </span>
                <span className="text-lg md:text-2xl font-black text-zinc-100 mt-1 font-sans">
                  {tab.displayValue}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6 relative select-none">
        <div className="relative w-full overflow-x-auto no-scrollbar">
          <div className="min-w-[700px] w-full relative">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
              <g>
                {gridLines.map((ratio, i) => {
                  const y = height - paddingY - ratio * (height - 2 * paddingY);
                  const val = Math.round(ratio * activeData.max);
                  return (
                    <g key={i}>
                      <line
                        x1={paddingX}
                        y1={y}
                        x2={width - paddingX}
                        y2={y}
                        stroke="#27272a"
                        strokeWidth="1"
                      />
                      <text
                        x={paddingX - 12}
                        y={y + 4}
                        textAnchor="end"
                        className="text-[10px] font-bold fill-zinc-500 font-sans"
                      >
                        {val.toLocaleString()}{activeTab === "xp" ? " XP" : activeTab === "minutes" ? "m" : ""}
                      </text>
                    </g>
                  );
                })}
              </g>

              <g>
                {months.map((month, i) => {
                  const x = paddingX + (i * (width - 2 * paddingX)) / 11;
                  return (
                    <text
                      key={i}
                      x={x}
                      y={height - paddingY + 22}
                      textAnchor="middle"
                      className="text-[10px] font-bold fill-zinc-500 font-sans"
                    >
                      {month}
                    </text>
                  );
                })}
              </g>

              <g>
                <motion.path
                  key={`area-${activeTab}`}
                  d={areaPath}
                  fill={activeData.color}
                  fillOpacity="0.04"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <motion.path
                  key={`line-${activeTab}`}
                  d={linePath}
                  fill="none"
                  stroke={activeData.color}
                  strokeWidth="2.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                />
              </g>

              {hoveredIndex !== null && (
                <g>
                  <line
                    x1={points[hoveredIndex].x}
                    y1={paddingY}
                    x2={points[hoveredIndex].x}
                    y2={height - paddingY}
                    stroke={activeData.color}
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    opacity="0.4"
                  />
                  <circle
                    cx={points[hoveredIndex].x}
                    cy={points[hoveredIndex].y}
                    r="8"
                    fill={activeData.color}
                    opacity="0.3"
                  />
                  <circle
                    cx={points[hoveredIndex].x}
                    cy={points[hoveredIndex].y}
                    r="4"
                    fill="#fafafa"
                    stroke={activeData.color}
                    strokeWidth="2"
                  />
                </g>
              )}

              <g>
                {points.map((pt, i) => (
                  <rect
                    key={i}
                    x={pt.x - (width - 2 * paddingX) / 22}
                    y={paddingY}
                    width={(width - 2 * paddingX) / 11}
                    height={height - 2 * paddingY}
                    fill="transparent"
                    className="cursor-crosshair"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                ))}
              </g>
            </svg>
          </div>
        </div>

        {hoveredIndex !== null && (
          <div
            className="absolute bg-zinc-950 border border-zinc-800 text-zinc-200 p-2.5 rounded-xl text-xs font-bold shadow-2xl pointer-events-none z-30 transition-all duration-100"
            style={{
              left: `${(points[hoveredIndex].x / width) * 100}%`,
              top: `${(points[hoveredIndex].y / height) * 100 - 10}%`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <p className="text-zinc-500 text-[9px] uppercase tracking-wider font-bold">{months[hoveredIndex]}</p>
            <p className="text-xs font-black text-zinc-100 mt-1">
              {activeData.values[hoveredIndex].toLocaleString()} {activeData.unit}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
