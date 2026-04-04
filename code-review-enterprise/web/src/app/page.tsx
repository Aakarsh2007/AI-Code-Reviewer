"use client";

import { useAuthStore } from "@/store/auth";
import AuthPage from "@/components/auth/AuthPage";
import Dashboard from "@/components/dashboard/Dashboard";

export default function Home() {
  const { token } = useAuthStore();
  return token ? <Dashboard /> : <AuthPage />;
}
