"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  EnterIcon,
  BookmarkIcon,
  ReaderIcon,
  GlobeIcon,
  PlayIcon,
  LayersIcon,
  BlendingModeIcon,
} from "@radix-ui/react-icons";
import { Course } from "@/lib/db";

interface CourseTilesProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 20,
    },
  },
};

export default function CourseTiles({ courses, onSelectCourse }: CourseTilesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const categories = ["All", ...Array.from(new Set(courses.map((c) => c.category)))];
  const filteredCourses = selectedCategory === "All"
    ? courses
    : courses.filter((c) => c.category === selectedCategory);

  const getCourseIcon = (iconName: string) => {
    switch (iconName) {
      case "globe":
        return <GlobeIcon className="w-5 h-5 text-indigo-400" />;
      case "play":
        return <PlayIcon className="w-5 h-5 text-indigo-400" />;
      case "layers":
        return <LayersIcon className="w-5 h-5 text-indigo-400" />;
      case "blending":
        return <BlendingModeIcon className="w-5 h-5 text-indigo-400" />;
      default:
        return <ReaderIcon className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <section className="w-full flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <ReaderIcon className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight">Active Programs</h2>
        </div>
        
        <div className="flex flex-wrap gap-1.5">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-md text-xs font-semibold tracking-wide transition-colors duration-200 cursor-pointer ${
                selectedCategory === category
                  ? "bg-indigo-600 text-zinc-50"
                  : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {filteredCourses.map((course) => {
          const progressPercent = Math.round((course.completedLessons / course.totalLessons) * 100);
          
          return (
            <motion.article
              key={course.id}
              variants={itemVariants}
              onClick={() => onSelectCourse(course)}
              whileHover={{
                y: -4,
                scale: 1.015,
                borderColor: "#6366f1",
                boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.2), 0 0 12px rgba(99, 102, 241, 0.15)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative flex flex-col justify-between bg-zinc-900 border border-zinc-800 rounded-2xl p-5 cursor-pointer select-none transition-colors duration-150 will-change-transform min-h-[190px] overflow-hidden"
            >
              <div className="absolute inset-0 opacity-[0.07] pointer-events-none overflow-hidden rounded-2xl z-0 mix-blend-overlay">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <filter id={`grain-filter-${course.id}`}>
                    <feTurbulence type="fractalNoise" baseFrequency="0.80" numOctaves="4" stitchTiles="stitch" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.9 0" />
                  </filter>
                  <rect width="100%" height="100%" filter={`url(#grain-filter-${course.id})`} />
                </svg>
              </div>

              <div className="space-y-3 z-10 relative">
                <header className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center border border-zinc-750">
                      {getCourseIcon(course.icon_name)}
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-zinc-800 text-zinc-300">
                      {course.category}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    course.difficulty === "Advanced"
                      ? "bg-red-500/10 text-red-400 border border-red-500/20"
                      : course.difficulty === "Intermediate"
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  }`}>
                    {course.difficulty}
                  </span>
                </header>

                <div>
                  <h3 className="text-base font-bold text-zinc-100 group-hover:text-indigo-400 transition-colors duration-200 line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-xs text-zinc-500 font-medium">Instructor: {course.instructor}</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-zinc-800/80 mt-4 z-10 relative">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400 font-bold">{course.completedLessons} / {course.totalLessons} Lessons</span>
                    <span className="font-semibold text-zinc-200">{progressPercent}%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-950 border border-zinc-800/80 rounded-full overflow-hidden p-[2px]">
                    <motion.div
                      className="h-full bg-indigo-500 rounded-full w-full origin-left"
                      style={{ originX: 0 }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: progressPercent / 100 }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>

                <footer className="flex items-center justify-between text-[10px] text-zinc-500 font-medium pt-1">
                  <div className="flex items-center gap-1.5">
                    <BookmarkIcon className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Active recently</span>
                  </div>
                  <div className="flex items-center gap-1 text-indigo-400 font-bold group-hover:translate-x-0.5 transition-transform duration-200">
                    <span>Enter Course</span>
                    <EnterIcon className="w-3 h-3" />
                  </div>
                </footer>
              </div>
            </motion.article>
          );
        })}
        
        {filteredCourses.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-zinc-500 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30">
            <p className="text-sm font-medium">No active courses in this category.</p>
          </div>
        )}
      </motion.div>
    </section>
  );
}