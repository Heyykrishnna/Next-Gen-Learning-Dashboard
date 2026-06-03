import React from "react";
import { fetchDashboardData } from "@/lib/db";
import DashboardClient from "@/components/DashboardClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const initialData = await fetchDashboardData();

  return <DashboardClient initialData={initialData} />;
}
