"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cross1Icon, CheckIcon, TimerIcon, PersonIcon, TargetIcon } from "@radix-ui/react-icons";
import { Course } from "@/lib/db";

interface CourseModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onCompleteLesson: (courseId: string, lessonId: string) => Promise<void>;
  isUpdating: boolean;
}

export default function CourseModal({
  course,
  isOpen,
  onClose,
  onCompleteLesson,
  isUpdating,
}: CourseModalProps) {
  if (!course) return null;

  const progressPercent = Math.round((course.completedLessons / course.totalLessons) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/85 backdrop-blur-sm cursor-pointer"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh] select-none"
            role="dialog"
            aria-modal="true"
          >
            <header className="p-6 border-b border-zinc-800/80 flex items-start justify-between gap-4 bg-zinc-900/50">
              <div className="space-y-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-zinc-800 text-zinc-300">
                  {course.category}
                </span>
                <h2 className="text-xl font-bold text-zinc-50 tracking-tight leading-snug">
                  {course.title}
                </h2>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 font-medium">
                  <span className="flex items-center gap-1">
                    <PersonIcon className="w-3.5 h-3.5" />
                    <span>Instructor: {course.instructor}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <TargetIcon className="w-3.5 h-3.5" />
                    <span>Difficulty: {course.difficulty}</span>
                  </span>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 cursor-pointer transition-colors duration-200"
                title="Close dialog"
              >
                <Cross1Icon className="w-4 h-4" />
              </button>
            </header>

            <section className="px-6 py-4 bg-zinc-950 border-b border-zinc-800/80 flex items-center justify-between gap-6">
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 font-bold">Overall Progress</span>
                  <span className="font-bold text-zinc-200">{progressPercent}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-900 border border-zinc-800/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-zinc-100">{course.completedLessons} / {course.totalLessons}</p>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Lessons Done</p>
              </div>
            </section>

            <main className="flex-1 overflow-y-auto p-6 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Curriculum Roadmap</h3>
              
              <div className="space-y-2">
                {course.lessons.map((lesson, idx) => (
                  <div
                    key={lesson.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-colors duration-200 ${
                      lesson.completed
                        ? "bg-zinc-900/30 border-zinc-800/60 text-zinc-500"
                        : "bg-zinc-950/60 border-zinc-800 text-zinc-200 hover:border-zinc-700/80"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span className={`text-[10px] font-bold w-5 text-center shrink-0 ${
                        lesson.completed ? "text-zinc-600" : "text-indigo-400"
                      }`}>
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm font-semibold truncate pr-2">
                        {lesson.title}
                      </span>
                    </div>

                    <div>
                      {lesson.completed ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/10">
                          <CheckIcon className="w-4 h-4" />
                          <span>Finished</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => !isUpdating && onCompleteLesson(course.id, lesson.id)}
                          disabled={isUpdating}
                          className="flex items-center gap-1 px-3 py-1 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs font-bold cursor-pointer transition-transform duration-150 active:scale-95 disabled:opacity-50"
                        >
                          <span>Complete</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </main>

            <footer className="p-4 border-t border-zinc-800 bg-zinc-900/30 flex items-center justify-between text-[10px] text-zinc-500 font-medium">
              <span className="flex items-center gap-1">
                <TimerIcon className="w-3.5 h-3.5" />
                <span>Awarding 75 XP per completed lesson module</span>
              </span>
              <span>Select any module to progress</span>
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
