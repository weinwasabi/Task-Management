"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { APP_NAME } from "@/lib/branding";
import { setIsMobileMenuOpen, setIsSidebarCollapsed } from "@/state";
import { useGetAuthUserQuery, useGetProjectsQuery } from "@/state/api";
import { signOut } from "aws-amplify/auth";
import {
  Briefcase,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Home,
  Layers3,
  Search,
  Settings,
  User,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavLinkProps = {
  href: string;
  icon?: LucideIcon;
  label: string;
};

function NavLink({ href, icon: Icon, label }: NavLinkProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const active = pathname === href;

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      onClick={() => dispatch(setIsMobileMenuOpen(false))}
      className={`flex min-h-10 items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-200 focus-visible:outline-offset-[-2px] ${
        active
          ? "bg-ink text-canvas"
          : "text-muted hover:bg-subtle hover:text-ink"
      }`}
    >
      {Icon ? (
        <Icon aria-hidden="true" size={16} />
      ) : (
        <ChevronRight aria-hidden="true" size={14} />
      )}
      <span className="truncate">{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const isMobileMenuOpen = useAppSelector(
    (state) => state.global.isMobileMenuOpen,
  );
  const { data: projects } = useGetProjectsQuery();
  const { data: account } = useGetAuthUserQuery({});
  const [showProjects, setShowProjects] = useState(true);
  const [showPriority, setShowPriority] = useState(true);
  const username =
    account?.userDetails?.username ?? account?.user.username ?? "Account";

  useEffect(() => {
    dispatch(setIsMobileMenuOpen(false));
  }, [dispatch, pathname]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <>
      {isMobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm lg:hidden"
          onClick={() => dispatch(setIsMobileMenuOpen(false))}
        />
      )}
      <aside
        aria-label="Primary navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-56 flex-col border-r border-line bg-surface transition-transform duration-300 ${
          isMobileMenuOpen
            ? "visible translate-x-0"
            : "invisible -translate-x-full"
        } ${isSidebarCollapsed ? "lg:invisible lg:-translate-x-full" : "lg:visible lg:translate-x-0"}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-ink"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-ink text-canvas">
              <Layers3 aria-hidden="true" size={17} />
            </span>
            <span className="truncate">{APP_NAME}</span>
          </Link>
          <button
            type="button"
            aria-label="Close navigation"
            className="rounded-md p-2 text-muted hover:bg-subtle hover:text-ink lg:hidden"
            onClick={() => dispatch(setIsMobileMenuOpen(false))}
          >
            <X aria-hidden="true" size={17} />
          </button>
          <button
            type="button"
            aria-label="Collapse sidebar"
            className="hidden rounded-md p-2 text-muted hover:bg-subtle hover:text-ink lg:block"
            onClick={() => dispatch(setIsSidebarCollapsed(true))}
          >
            <X aria-hidden="true" size={17} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
          <p className="app-kicker mb-3 px-3">Workspace</p>
          <nav aria-label="Workspace" className="space-y-1">
            <NavLink icon={Home} label="Dashboard" href="/" />
            <NavLink icon={Briefcase} label="Timeline" href="/timeline" />
            <NavLink icon={Search} label="Search" href="/search" />
            <NavLink icon={User} label="Users" href="/users" />
            <NavLink icon={Users} label="Teams" href="/teams" />
            <NavLink icon={Settings} label="Settings" href="/settings" />
          </nav>

          <div className="mt-7 border-t border-line pt-4">
            <button
              type="button"
              aria-expanded={showProjects}
              className="app-kicker flex min-h-9 w-full items-center justify-between rounded-md px-3 text-left hover:bg-subtle hover:text-ink"
              onClick={() => setShowProjects((value) => !value)}
            >
              Projects
              {showProjects ? (
                <ChevronUp size={14} />
              ) : (
                <ChevronDown size={14} />
              )}
            </button>
            {showProjects && (
              <nav aria-label="Projects" className="mt-1 space-y-1">
                {projects?.length ? (
                  projects.map((project) => (
                    <NavLink
                      key={project.id}
                      href={`/projects/${project.id}`}
                      label={project.name}
                    />
                  ))
                ) : (
                  <p className="px-3 py-2 text-xs text-muted">
                    No projects yet
                  </p>
                )}
              </nav>
            )}
          </div>

          <div className="mt-4 border-t border-line pt-4">
            <button
              type="button"
              aria-expanded={showPriority}
              className="app-kicker flex min-h-9 w-full items-center justify-between rounded-md px-3 text-left hover:bg-subtle hover:text-ink"
              onClick={() => setShowPriority((value) => !value)}
            >
              Priority
              {showPriority ? (
                <ChevronUp size={14} />
              ) : (
                <ChevronDown size={14} />
              )}
            </button>
            {showPriority && (
              <nav aria-label="Priority" className="mt-1 space-y-1">
                {["Urgent", "High", "Medium", "Low", "Backlog"].map(
                  (priority) => (
                    <NavLink
                      key={priority}
                      href={`/priority/${priority.toLowerCase()}`}
                      label={priority}
                    />
                  ),
                )}
              </nav>
            )}
          </div>
        </div>

        <div className="border-t border-line p-4">
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line-strong bg-subtle font-mono text-xs uppercase text-ink">
              {username.charAt(0)}
            </span>
            <span className="min-w-0 truncate text-sm font-medium text-ink">
              {username}
            </span>
          </div>
          <button
            type="button"
            className="app-button-secondary w-full"
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
