"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { APP_NAME } from "@/lib/branding";
import {
  setIsMobileMenuOpen,
  setIsSidebarCollapsed,
  setThemePreference,
} from "@/state";
import { useGetAuthUserQuery } from "@/state/api";
import { Menu, Moon, Search, Settings, Sun } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const isMobileMenuOpen = useAppSelector(
    (state) => state.global.isMobileMenuOpen,
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: account } = useGetAuthUserQuery({});
  const username =
    account?.userDetails?.username ?? account?.user.username ?? "Account";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-line bg-surface/95 px-4 backdrop-blur-md lg:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label={isMobileMenuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isMobileMenuOpen}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink hover:bg-subtle lg:hidden"
          onClick={() => dispatch(setIsMobileMenuOpen(!isMobileMenuOpen))}
        >
          <Menu aria-hidden="true" size={20} />
        </button>
        {isSidebarCollapsed && (
          <button
            type="button"
            aria-label="Expand sidebar"
            className="hidden h-10 w-10 items-center justify-center rounded-md text-ink hover:bg-subtle lg:inline-flex"
            onClick={() => dispatch(setIsSidebarCollapsed(false))}
          >
            <Menu aria-hidden="true" size={20} />
          </button>
        )}
        <Link
          href="/"
          className="truncate font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink lg:hidden"
        >
          {APP_NAME}
        </Link>
        <span className="app-kicker hidden lg:block">Workspace / overview</span>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <Link
          href="/search"
          className="inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm text-muted hover:bg-subtle hover:text-ink"
        >
          <Search aria-hidden="true" size={17} />
          <span className="hidden sm:inline">Search</span>
        </Link>
        <button
          type="button"
          aria-label={isDarkMode ? "Use light theme" : "Use dark theme"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted hover:bg-subtle hover:text-ink"
          onClick={() =>
            dispatch(setThemePreference(isDarkMode ? "light" : "dark"))
          }
        >
          {isDarkMode ? (
            <Sun aria-hidden="true" size={18} />
          ) : (
            <Moon aria-hidden="true" size={18} />
          )}
        </button>
        <Link
          href="/settings"
          aria-label="Settings"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted hover:bg-subtle hover:text-ink"
        >
          <Settings aria-hidden="true" size={18} />
        </Link>
        <span className="mx-1 hidden h-6 w-px bg-line sm:block" />
        <span
          aria-label={`Signed in as ${username}`}
          title={username}
          className="hidden h-8 w-8 items-center justify-center rounded-full border border-line-strong bg-subtle font-mono text-xs uppercase text-ink sm:inline-flex"
        >
          {username.charAt(0)}
        </span>
      </div>
    </header>
  );
}
