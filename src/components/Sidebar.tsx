"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  DashboardIcon,
  ReaderIcon,
  BarChartIcon,
  CalendarIcon,
  GearIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LightningBoltIcon,
  ExitIcon,
} from "@radix-ui/react-icons";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  activeTab,
  setActiveTab,
}: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: DashboardIcon },
    { id: "courses", label: "My Courses", icon: ReaderIcon },
    { id: "analytics", label: "Analytics", icon: BarChartIcon },
    { id: "schedule", label: "Schedule", icon: CalendarIcon },
    { id: "settings", label: "Settings", icon: GearIcon },
  ];

  return (
    <>
      <aside
        className={`hidden md:flex flex-col h-screen sticky top-0 left-0 bg-zinc-900 border-r border-zinc-800 text-zinc-400 select-none z-30 transition-all duration-300`}
        style={{ width: isCollapsed ? "64px" : "240px" }}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-zinc-800">
          {isCollapsed ? (
            <button
              onClick={() => setIsCollapsed(false)}
              className="shrink-0 flex items-center justify-center w-8 h-8 rounded bg-zinc-800 text-zinc-400 hover:text-zinc-50 border border-zinc-700 hover:border-zinc-500 cursor-pointer transition-all duration-200 mx-auto"
              title="Expand Sidebar"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          ) : (
            <>
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded bg-zinc-800 text-emerald-500">
                  <LightningBoltIcon className="w-5 h-5" />
                </div>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-bold text-zinc-50 tracking-wider text-sm truncate"
                >
                  AETHER.OS
                </motion.span>
              </div>
              <button
                onClick={() => setIsCollapsed(true)}
                className="flex items-center justify-center w-6 h-6 rounded bg-zinc-800 text-zinc-400 hover:text-zinc-50 border border-zinc-700 cursor-pointer transition-colors duration-200"
                title="Collapse Sidebar"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        <nav className={`flex-1 py-6 px-3 space-y-1.5 no-scrollbar ${isCollapsed ? "overflow-hidden" : "overflow-y-auto"}`}>
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center w-full h-11 px-3 rounded-lg text-sm font-medium cursor-pointer group relative transition-colors duration-150 ${
                  isActive ? "text-zinc-50 font-bold" : "hover:text-zinc-200 text-zinc-400"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabHighlightDesktop"
                    className="absolute inset-0 bg-zinc-800 rounded-lg -z-10 border border-zinc-800/40"
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                )}

                <div className="shrink-0 flex items-center justify-center w-5 h-5 z-10">
                  <IconComponent className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                </div>
                
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-3 truncate z-10"
                  >
                    {item.label}
                  </motion.span>
                )}

                {isCollapsed && (
                  <div className="absolute left-16 bg-zinc-950 text-zinc-50 text-xs font-semibold px-2.5 py-1.5 rounded-md border border-zinc-800 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap shadow-lg">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-zinc-800 bg-zinc-900/50">
          {isCollapsed ? (
            <button
              onClick={() => setIsCollapsed(false)}
              className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-750 flex items-center justify-center text-zinc-200 font-semibold border border-zinc-700 hover:border-zinc-500 text-[10px] shrink-0 mx-auto cursor-pointer transition-all duration-200"
              title="Expand Sidebar"
            >
              YA
            </button>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-200 font-semibold border border-zinc-700 text-xs shrink-0">
                  YA
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-semibold text-zinc-200 truncate">Yatharth</span>
                  <span className="text-[10px] text-zinc-500 truncate">Level 4 Scholar</span>
                </div>
              </div>
              
              <button 
                onClick={() => alert("Mock Logout Triggered")}
                className="flex items-center justify-center w-7 h-7 rounded hover:bg-zinc-800 text-zinc-500 hover:text-red-400 cursor-pointer transition-colors duration-200"
                title="Logout"
              >
                <ExitIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-zinc-900 border-t border-zinc-800 flex items-center justify-around z-45 px-2 pb-safe select-none">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 cursor-pointer relative transition-colors duration-150 ${
                isActive ? "text-zinc-50 font-bold" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabHighlightMobile"
                  className="absolute inset-0.5 bg-zinc-800/80 rounded-lg -z-10 border border-zinc-800/40"
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              )}
              
              <IconComponent className="w-5 h-5 mb-1 transition-transform duration-150 active:scale-90 z-10" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-center z-10">
                {item.id === "courses" ? "Courses" : item.id === "analytics" ? "Stats" : item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeLineMobile"
                  className="absolute top-0 w-8 h-[2.5px] bg-indigo-500 rounded-full z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
}
