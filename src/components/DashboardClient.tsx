"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import HeroTile from "./HeroTile";
import CourseTiles from "./CourseTiles";
import ActivityTile from "./ActivityTile";
import StatsGrid from "./StatsGrid";
import CourseModal from "./CourseModal";
import { DashboardData, Course, completeLesson, resetDashboardData } from "@/lib/db";
import { ReloadIcon } from "@radix-ui/react-icons";

interface DashboardClientProps {
  initialData: DashboardData;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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
      stiffness: 260,
      damping: 22,
    },
  },
};

export default function DashboardClient({ initialData }: DashboardClientProps) {
  const [data, setData] = useState<DashboardData>(initialData);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isPending, startTransition] = useTransition();

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setIsSidebarCollapsed(window.innerWidth < 1024);
    }
  }, []);

  const mostRecentCourse = [...data.courses].sort(
    (a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime()
  )[0];

  const handleResumeLearning = () => {
    if (mostRecentCourse) {
      setSelectedCourse(mostRecentCourse);
    }
  };

  const handleCompleteLesson = async (courseId: string, lessonId: string) => {
    startTransition(async () => {
      const updatedData = await completeLesson(courseId, lessonId);
      setData(updatedData);
      
      if (selectedCourse && selectedCourse.id === courseId) {
        const updatedCourse = updatedData.courses.find((c) => c.id === courseId);
        if (updatedCourse) {
          setSelectedCourse(updatedCourse);
        }
      }
    });
  };

  const handleResetData = async () => {
    if (confirm("Are you sure you want to reset your learning records?")) {
      startTransition(async () => {
        const resetData = await resetDashboardData();
        setData(resetData);
        setSelectedCourse(null);
      });
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="bento-grid mt-6"
          >
            <motion.div variants={itemVariants} className="col-span-full">
              <HeroTile
                user={data.user}
                onResumeLearning={handleResumeLearning}
                activeCourseTitle={mostRecentCourse?.title || ""}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="col-span-full">
              <StatsGrid user={data.user} />
            </motion.div>

            <motion.div variants={itemVariants} className="col-span-full">
              <CourseTiles
                courses={data.courses}
                onSelectCourse={(course) => setSelectedCourse(course)}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="col-span-full">
              <ActivityTile activity={data.activity} />
            </motion.div>
          </motion.div>
        );

      case "courses":
        return (
          <div className="space-y-6 mt-6">
            <header className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h1 className="text-2xl font-black text-zinc-100 tracking-tight">Active Curriculums</h1>
                <p className="text-zinc-500 text-xs mt-1">Review, filter, and track all enrolled courses.</p>
              </div>
            </header>
            <CourseTiles
              courses={data.courses}
              onSelectCourse={(course) => setSelectedCourse(course)}
            />
          </div>
        );

      case "analytics":
        return (
          <div className="space-y-6 mt-6">
            <header className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h1 className="text-2xl font-black text-zinc-100 tracking-tight font-sans">Learning Analytics</h1>
                <p className="text-zinc-500 text-xs mt-1">Granular heatmaps and performance data.</p>
              </div>
            </header>
            <ActivityTile activity={data.activity} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-zinc-300">Time Distribution</h3>
                <div className="h-40 bg-zinc-950 border border-zinc-800/80 rounded-xl flex flex-col p-4">
                  <div className="flex-1 flex items-end justify-between gap-2 h-24">
                    {[45, 80, 55, 90, 70, 40, 100].map((height, i) => (
                      <div key={i} className="flex-1 h-full flex flex-col justify-end relative group/bar">
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/bar:block bg-zinc-900 border border-zinc-800 text-[8px] text-zinc-200 font-bold px-1.5 py-0.5 rounded shadow z-10 whitespace-nowrap">
                          {(height / 10).toFixed(1)} hrs
                        </div>
                        <div
                          className="w-full bg-indigo-500 rounded-t-sm hover:bg-indigo-400 transition-colors duration-150"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between gap-2 mt-2 pt-2 border-t border-zinc-900">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                      <span key={day} className="flex-1 text-center text-[9px] font-bold text-zinc-500 uppercase tracking-wide">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-zinc-300">Milestone Achievements</h3>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800/80 p-2.5 rounded-xl">
                    <div className="w-7 h-7 rounded bg-amber-500/10 text-amber-500 flex items-center justify-center text-xs font-bold">L4</div>
                    <div className="text-xs">
                      <p className="font-bold text-zinc-200">Level 4 Scholar</p>
                      <p className="text-zinc-500 font-medium">Earned by crossing 1,000 cumulative XP</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800/80 p-2.5 rounded-xl">
                    <div className="w-7 h-7 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-bold">12d</div>
                    <div className="text-xs">
                      <p className="font-bold text-zinc-200">Consistency Master</p>
                      <p className="text-zinc-500 font-medium">Maintain a learning streak above 10 days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "schedule":
        return (
          <div className="space-y-6 mt-6">
            <header className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h1 className="text-2xl font-black text-zinc-100 tracking-tight">Timeline & Sessions</h1>
                <p className="text-zinc-500 text-xs mt-1">Scheduled lessons and calendar goals.</p>
              </div>
            </header>
            
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Upcoming Events</h3>
              <div className="space-y-3">
                {[
                  { time: "09:00 AM", title: "RSC Caching Strategies", desc: "Next.js 16 - Lesson 9", type: "Web" },
                  { time: "02:30 PM", title: "Framer Layout Animation Review", desc: "Framer Motion - Lesson 7", type: "Design" },
                  { time: "05:00 PM", title: "CAP Theorem Live Q&A", desc: "System Design - Lesson 6", type: "Arch" },
                ].map((event, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 font-sans">
                    <span className="text-xs font-bold text-indigo-400 w-20 shrink-0 pt-0.5">{event.time}</span>
                    <div className="text-xs">
                      <p className="font-bold text-zinc-200">{event.title}</p>
                      <p className="text-zinc-500 font-medium">{event.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6 mt-6">
            <header className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h1 className="text-2xl font-black text-zinc-100 tracking-tight font-sans">System Settings</h1>
                <p className="text-zinc-500 text-xs mt-1">Customize your learning space and manage database files.</p>
              </div>
            </header>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
              <div className="space-y-2 border-b border-zinc-800/60 pb-5">
                <h3 className="text-sm font-bold text-zinc-300">Profile Defaults</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1 text-xs">
                    <span className="text-zinc-500 font-bold">SCHOLAR USERNAME</span>
                    <input
                      type="text"
                      value={data.user.name}
                      readOnly
                      className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-zinc-300 focus:outline-none focus:border-zinc-700"
                    />
                  </div>
                  <div className="space-y-1 text-xs">
                    <span className="text-zinc-500 font-bold">CURRENT LEVEL</span>
                    <input
                      type="text"
                      value={`Level ${data.user.level}`}
                      readOnly
                      className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-zinc-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleResetData}
                  disabled={isPending}
                  className="flex items-center justify-center gap-2 h-11 px-5 rounded-lg bg-red-600 hover:bg-red-700 text-zinc-50 font-bold text-xs cursor-pointer shadow transition-colors duration-200"
                >
                  <ReloadIcon className={`w-3.5 h-3.5 ${isPending ? "animate-spin" : ""}`} />
                  <span>Wipe & Reset Database Files</span>
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex bg-zinc-950 text-zinc-50 min-h-screen font-sans">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-10 py-8 pb-24 md:pb-8 relative">
        <AnimatePresence>
          {isPending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-4 right-4 bg-zinc-900 border border-zinc-800/80 p-2.5 rounded-xl flex items-center gap-2 shadow-2xl z-40 animate-pulse"
            >
              <ReloadIcon className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Syncing database...</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-6xl mx-auto space-y-6">

          <div className="transition-all duration-300">
            {renderTabContent()}
          </div>
        </div>

        <CourseModal
          course={selectedCourse}
          isOpen={!!selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onCompleteLesson={handleCompleteLesson}
          isUpdating={isPending}
        />
      </main>
    </div>
  );
}
