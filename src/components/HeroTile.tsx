"use client";

import React from "react";
import { motion } from "framer-motion";
import { LightningBoltIcon, StarIcon, BookmarkIcon } from "@radix-ui/react-icons";
import { UserProfile } from "@/lib/db";

interface HeroTileProps {
  user: UserProfile;
  onResumeLearning: () => void;
  activeCourseTitle: string;
}

export default function HeroTile({ user, onResumeLearning, activeCourseTitle }: HeroTileProps) {
  const xpPercent = Math.min(100, Math.round((user.xp / user.nextLevelXp) * 100));
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  const currentDayIndex = new Date().getDay();
  
  const streakDays = daysOfWeek.map((day, idx) => {
    const isCompleted = idx <= currentDayIndex && idx > (currentDayIndex - 4);
    const isToday = idx === currentDayIndex;
    
    return {
      day,
      isCompleted,
      isToday,
    };
  });

  return (
    <motion.section
      whileHover={{
        y: -4,
        scale: 1.01,
        borderColor: "#3f3f46",
        boxShadow: "0 10px 25px -5px rgba(63, 63, 70, 0.2), 0 0 12px rgba(63, 63, 70, 0.15)"
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between gap-6 transition-colors duration-150 relative overflow-hidden group will-change-transform"
    >
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none overflow-hidden rounded-2xl z-0 mix-blend-overlay">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="grain-filter-hero">
            <feTurbulence type="fractalNoise" baseFrequency="0.80" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.9 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain-filter-hero)" />
        </svg>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-6 z-10">
        <div className="space-y-2 flex-1">
          <header className="flex items-center gap-2"></header>
          <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-50 tracking-tight font-sans">
            Welcome back, <span className="text-zinc-100">{user.name}</span>
          </h1>
          <p className="text-zinc-400 text-sm max-w-lg leading-relaxed font-sans">
            Your daily streak is secure! Continue where you left off in{" "}
            <span className="font-semibold text-zinc-200">{activeCourseTitle || "your courses"}</span> to reach Level {user.level + 1}.
          </p>
        </div>

        <div className="flex flex-col bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 min-w-[240px] justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-amber-500/10 flex items-center justify-center text-amber-500">
                <LightningBoltIcon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Streak Tracker</span>
            </div>
            <span className="text-sm font-black text-amber-500">{user.streak} Days</span>
          </div>

          <div className="flex justify-between gap-1.5">
            {streakDays.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-1.5 flex-1">
                <span className="text-[10px] font-medium text-zinc-500">{item.day}</span>
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                    item.isToday
                      ? "border border-amber-500 text-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.2)]"
                      : ""
                  } ${
                    item.isCompleted
                      ? "bg-amber-500 text-zinc-950"
                      : "bg-zinc-800 text-zinc-600 border border-zinc-700/50"
                  }`}
                >
                  {item.isCompleted ? "✓" : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 border-t border-zinc-800/80 pt-6 z-10">
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-zinc-300">
              <StarIcon className="w-4 h-4 text-emerald-500" />
              <span>Level {user.level}</span>
            </div>
            <span className="text-zinc-500 font-medium">
              {user.xp} / {user.nextLevelXp} XP ({xpPercent}%)
            </span>
          </div>
          
          <div className="h-3 w-full bg-zinc-950 border border-zinc-800 rounded-full overflow-hidden p-[2px]">
            <motion.div
              className="h-full bg-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        <button
          onClick={onResumeLearning}
          className="flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-semibold text-sm cursor-pointer shadow-lg transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
        >
          <BookmarkIcon className="w-4 h-4" />
          <span>Resume Training</span>
        </button>
      </div>
    </motion.section>
  );
}
