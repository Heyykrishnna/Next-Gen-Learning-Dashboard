"use server";

import fs from "fs/promises";
import path from "path";

export interface Lesson {
  id: string;
  title: string;
  completed: boolean;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  completedLessons: number;
  totalLessons: number;
  lessons: Lesson[];
  lastAccessed: string;
  icon_name: string;
}

export interface UserProfile {
  name: string;
  streak: number;
  level: number;
  xp: number;
  nextLevelXp: number;
  totalHours: number;
  completedCoursesCount: number;
}

export interface DashboardData {
  user: UserProfile;
  courses: Course[];
  activity: Record<string, number>;
}

const DB_PATH = path.join(process.cwd(), "src/data/db.json");

function generateMockActivity(): Record<string, number> {
  const activity: Record<string, number> = {};
  const today = new Date();
  
  for (let i = 365; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateString = d.toISOString().split("T")[0];
    
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    let count = 0;
    const rand = Math.random();
    if (isWeekend) {
      if (rand > 0.6) count = Math.floor(Math.random() * 2) + 1;
    } else {
      if (rand > 0.2) {
        count = Math.floor(Math.random() * 4) + 1;
        if (rand > 0.8) count += 2;
      }
    }
    
    if (count > 0) {
      activity[dateString] = count;
    }
  }
  
  return activity;
}

const DEFAULT_DATA: DashboardData = {
  user: {
    name: "Yatharth",
    streak: 12,
    level: 4,
    xp: 450,
    nextLevelXp: 1000,
    totalHours: 42,
    completedCoursesCount: 1,
  },
  courses: [
    {
      id: "nextjs-16",
      title: "Next.js 16 Architecture & Patterns",
      instructor: "Sarah Connor",
      difficulty: "Advanced",
      category: "Web Development",
      completedLessons: 12,
      totalLessons: 16,
      lastAccessed: new Date(Date.now() - 3600000 * 2).toISOString(),
      icon_name: "globe",
      lessons: [
        { id: "n1", title: "App Router Fundamentals", completed: true },
        { id: "n2", title: "React Server Components Deep Dive", completed: true },
        { id: "n3", title: "Streaming and Suspense Boundaries", completed: true },
        { id: "n4", title: "Partial Prerendering (PPR)", completed: true },
        { id: "n5", title: "Optimizing Client-Side Routing", completed: true },
        { id: "n6", title: "Server Actions Security & Validation", completed: true },
        { id: "n7", title: "Custom Middleware & Headers", completed: true },
        { id: "n8", title: "Optimizing Image and Font Delivery", completed: true },
        { id: "n9", title: "Data Caching & Revalidation", completed: true },
        { id: "n10", title: "Advanced Metadata & SEO", completed: true },
        { id: "n11", title: "Parallel and Intercepting Routes", completed: true },
        { id: "n12", title: "Dynamic Routing & Static Regeneration", completed: true },
        { id: "n13", title: "Unstable Instant Navigations", completed: false },
        { id: "n14", title: "Error Handling & Recovery", completed: false },
        { id: "n15", title: "Testing App Router Components", completed: false },
        { id: "n16", title: "Deploying to Vercel & Self-Hosting", completed: false }
      ]
    },
    {
      id: "framer-motion",
      title: "Advanced UI Interactions with Framer Motion",
      instructor: "Dan Abramov",
      difficulty: "Intermediate",
      category: "Design & UX",
      completedLessons: 6,
      totalLessons: 10,
      lastAccessed: new Date(Date.now() - 3600000 * 24).toISOString(),
      icon_name: "play",
      lessons: [
        { id: "f1", title: "Introduction to Motion Elements", completed: true },
        { id: "f2", title: "Animate Presence & Exit Animations", completed: true },
        { id: "f3", title: "Layout Animations & FLIP Technique", completed: true },
        { id: "f4", title: "Keyframes and Transition Types", completed: true },
        { id: "f5", title: "Gestures, Hover, Tap, and Drag", completed: true },
        { id: "f6", title: "Scroll-triggered Animations", completed: true },
        { id: "f7", title: "LayoutId Shared Element Transitions", completed: false },
        { id: "f8", title: "Custom SVG Animations", completed: false },
        { id: "f9", title: "Performance Tuning: Will-Change", completed: false },
        { id: "f10", title: "Accessibility in Motion Design", completed: false }
      ]
    },
    {
      id: "system-design",
      title: "Next-Gen System Design & Scalability",
      instructor: "Martin Kleppmann",
      difficulty: "Advanced",
      category: "Architecture",
      completedLessons: 3,
      totalLessons: 8,
      lastAccessed: new Date(Date.now() - 3600000 * 48).toISOString(),
      icon_name: "layers",
      lessons: [
        { id: "s1", title: "Vertical vs Horizontal Scaling", completed: true },
        { id: "s2", title: "Load Balancing & Reverse Proxies", completed: true },
        { id: "s3", title: "Database Sharding & Replication", completed: true },
        { id: "s4", title: "Caching Strategies (Redis & Memcached)", completed: false },
        { id: "s5", title: "Message Queues & Event Sourcing", completed: false },
        { id: "s6", title: "Consistency Models (CAP Theorem)", completed: false },
        { id: "s7", title: "Microservices Architecture & API Gateways", completed: false },
        { id: "s8", title: "Designing for Disaster Recovery", completed: false }
      ]
    },
    {
      id: "tailwind-v4",
      title: "Tailwind CSS v4 Design Systems",
      instructor: "Adam Wathan",
      difficulty: "Beginner",
      category: "Web Development",
      completedLessons: 2,
      totalLessons: 8,
      lastAccessed: new Date(Date.now() - 3600000 * 72).toISOString(),
      icon_name: "blending",
      lessons: [
        { id: "t1", title: "What's New in Tailwind v4", completed: true },
        { id: "t2", title: "The New CSS-First Configuration", completed: true },
        { id: "t3", title: "Customizing Theme Variables in CSS", completed: false },
        { id: "t4", title: "Dynamic Utility Classes and Arbitrary Properties", completed: false },
        { id: "t5", title: "Designing Responsive Grid Layouts", completed: false },
        { id: "t6", title: "Container Queries in Action", completed: false },
        { id: "t7", title: "Dark Mode Strategies in v4", completed: false },
        { id: "t8", title: "Production Builds & Size Optimization", completed: false }
      ]
    }
  ],
  activity: {}
};

export async function fetchDashboardData(): Promise<DashboardData> {
  try {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    
    try {
      const data = await fs.readFile(DB_PATH, "utf-8");
      const parsed = JSON.parse(data) as DashboardData;
      
      let modified = false;
      parsed.courses = parsed.courses.map(course => {
        if (!course.icon_name) {
          modified = true;
          const defaultCourse = DEFAULT_DATA.courses.find(c => c.id === course.id);
          return { ...course, icon_name: defaultCourse?.icon_name || "globe" };
        }
        return course;
      });
      
      if (modified) {
        await saveDashboardData(parsed);
      }
      
      return parsed;
    } catch {
      const initialData = { ...DEFAULT_DATA };
      initialData.activity = generateMockActivity();
      
      await fs.writeFile(DB_PATH, JSON.stringify(initialData, null, 2), "utf-8");
      return initialData;
    }
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    return {
      user: DEFAULT_DATA.user,
      courses: DEFAULT_DATA.courses,
      activity: generateMockActivity()
    };
  }
}

async function saveDashboardData(data: DashboardData): Promise<void> {
  try {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to save dashboard data:", error);
  }
}

export async function resetDashboardData(): Promise<DashboardData> {
  const freshData = { ...DEFAULT_DATA };
  freshData.activity = generateMockActivity();
  await saveDashboardData(freshData);
  return freshData;
}

export async function completeLesson(courseId: string, lessonId: string): Promise<DashboardData> {
  const data = await fetchDashboardData();
  
  const courseIndex = data.courses.findIndex(c => c.id === courseId);
  if (courseIndex === -1) return data;
  
  const course = data.courses[courseIndex];
  const lessonIndex = course.lessons.findIndex(l => l.id === lessonId);
  if (lessonIndex === -1) return data;
  
  if (course.lessons[lessonIndex].completed) return data;
  
  course.lessons[lessonIndex].completed = true;
  course.completedLessons = course.lessons.filter(l => l.completed).length;
  course.lastAccessed = new Date().toISOString();
  
  const xpReward = 75;
  let newXp = data.user.xp + xpReward;
  let newLevel = data.user.level;
  let newNextLevelXp = data.user.nextLevelXp;
  
  while (newXp >= newNextLevelXp) {
    newXp -= newNextLevelXp;
    newLevel += 1;
    newNextLevelXp = Math.floor(newNextLevelXp * 1.25);
  }
  
  data.user.xp = newXp;
  data.user.level = newLevel;
  data.user.nextLevelXp = newNextLevelXp;
  
  data.user.totalHours += 1;
  
  const completedCourses = data.courses.filter(c => c.completedLessons === c.totalLessons).length;
  data.user.completedCoursesCount = completedCourses + 1;
  
  const todayStr = new Date().toISOString().split("T")[0];
  data.activity[todayStr] = (data.activity[todayStr] || 0) + 1;
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];
  
  const hasActivityYesterday = (data.activity[yesterdayStr] || 0) > 0;
  const hasMultipleActivityToday = (data.activity[todayStr] || 0) > 1;
  
  if (!hasMultipleActivityToday) {
    if (hasActivityYesterday || data.user.streak === 0) {
      data.user.streak += 1;
    } else {
      data.user.streak = 1;
    }
  }
  
  await saveDashboardData(data);
  return data;
}
