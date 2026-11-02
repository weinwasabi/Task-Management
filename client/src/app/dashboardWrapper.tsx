"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import AuthProvider from "./authProvider";
import StoreProvider, { useAppSelector } from "./redux";
import { useAppDispatch } from "./redux";
import { setIsDarkMode } from "@/state";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Sidebar />
      <main
        className={`flex min-h-screen w-full flex-col transition-[padding] duration-300 ${
          isSidebarCollapsed ? "" : "lg:pl-56"
        }`}
      >
        <Navbar />
        {children}
      </main>
    </div>
  );
};

const ThemeSync = ({ children }: { children: React.ReactNode }) => {
  const themePreference = useAppSelector(
    (state) => state.global.themePreference,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      const dark =
        themePreference === "system"
          ? systemTheme.matches
          : themePreference === "dark";
      document.documentElement.classList.toggle("dark", dark);
      document.documentElement.classList.toggle(
        "light",
        themePreference === "light",
      );
      dispatch(setIsDarkMode(dark));
    };

    applyTheme();
    if (themePreference === "system") {
      systemTheme.addEventListener("change", applyTheme);
      return () => systemTheme.removeEventListener("change", applyTheme);
    }
  }, [dispatch, themePreference]);

  return <>{children}</>;
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <ThemeSync>
        <AuthProvider>
          <DashboardLayout>{children}</DashboardLayout>
        </AuthProvider>
      </ThemeSync>
    </StoreProvider>
  );
};

export default DashboardWrapper;
