"use client";

import React from "react";
import { motion } from "framer-motion";
import { TimerIcon, StarIcon, CheckCircledIcon, RocketIcon } from "@radix-ui/react-icons";
import { UserProfile } from "@/lib/db";

interface StatsGridProps {
  user: UserProfile;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
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

export default function StatsGrid({ user }: StatsGridProps) {
  const stats = [
    {
      id: "hours",
      title: "Learning Hours",
      value: `${user.totalHours} hrs`,
      description: "Total time spent studying",
      icon: TimerIcon,
      iconColor: "text-indigo-400",
      hoverBorderColor: "#6366f1",
    },
    {
      id: "completed",
      title: "Programs Completed",
      value: `${user.completedCoursesCount}`,
      description: "Completed curriculum tracks",
      icon: CheckCircledIcon,
      iconColor: "text-emerald-400",
      hoverBorderColor: "#10b981",
    },
    {
      id: "rank",
      title: "Global Rank",
      value: "Top 2.5%",
      description: "Percentile among global scholars",
      icon: RocketIcon,
      iconColor: "text-amber-400",
      hoverBorderColor: "#f59e0b",
    },
    {
      id: "focus",
      title: "Skill Tier",
      value: user.level >= 10 ? "Arch-Mage" : user.level >= 5 ? "Elite" : "Acolyte",
      description: `Progressing to Level ${user.level + 1}`,
      icon: StarIcon,
      iconColor: "text-red-400",
      hoverBorderColor: "#f43f5e",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        
        return (
          <motion.article
            key={stat.id}
            variants={itemVariants}
            whileHover={{
              y: -4,
              scale: 1.015,
              borderColor: stat.hoverBorderColor,
              boxShadow: `0 10px 25px -5px ${stat.hoverBorderColor}20, 0 0 12px ${stat.hoverBorderColor}25`
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`flex flex-col justify-between bg-zinc-900 border border-zinc-800 rounded-2xl p-5 select-none transition-colors duration-150 will-change-transform`}
          >
            <header className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500 tracking-wider uppercase">
                {stat.title}
              </span>
              <IconComponent className={`w-5 h-5 ${stat.iconColor}`} />
            </header>
            
            <div className="mt-4">
              <p className="text-2xl font-black text-zinc-100 tracking-tight">
                {stat.value}
              </p>
              <p className="text-[10px] font-semibold text-zinc-500 mt-1 uppercase tracking-wide">
                {stat.description}
              </p>
            </div>
          </motion.article>
        );
      })}
    </motion.div>
  );
}
