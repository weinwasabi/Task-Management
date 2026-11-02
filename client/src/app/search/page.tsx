"use client";

import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import TaskCard from "@/components/TaskCard";
import UserCard from "@/components/UserCard";
import { useSearchQuery } from "@/state/api";
import { Search as SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Search() {
  const [input, setInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: results,
    isLoading,
    isError,
  } = useSearchQuery(searchTerm, {
    skip: searchTerm.length < 3,
  });

  useEffect(() => {
    const timer = window.setTimeout(() => setSearchTerm(input.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [input]);

  const ready = searchTerm === input.trim() && searchTerm.length >= 3;
  const total =
    (results?.tasks?.length ?? 0) +
    (results?.projects?.length ?? 0) +
    (results?.users?.length ?? 0);

  return (
    <div className="app-page">
      <Header name="Search" />
      <div className="max-w-2xl">
        <label htmlFor="project-search" className="app-label">
          Search tasks, projects, and users
        </label>
        <div className="relative">
          <SearchIcon
            aria-hidden="true"
            size={17}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            id="project-search"
            type="search"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Enter a name or keyword"
            className="app-input pl-10"
          />
        </div>
      </div>

      <div aria-live="polite" className="mt-8">
        {input.trim().length < 3 ? (
          <p className="app-empty">
            Enter at least three characters to search.
          </p>
        ) : isLoading || !ready ? (
          <p className="text-muted">Searching...</p>
        ) : isError ? (
          <p role="alert" className="app-empty">
            Search is unavailable. Check the API and try again.
          </p>
        ) : total === 0 ? (
          <p className="app-empty">
            No results found. Try a different keyword.
          </p>
        ) : (
          <div className="space-y-10">
            {!!results?.tasks?.length && (
              <section>
                <h2 className="mb-4 border-b border-line pb-3 text-lg font-semibold text-ink">
                  Tasks{" "}
                  <span className="app-badge ml-2">{results.tasks.length}</span>
                </h2>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {results.tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </section>
            )}
            {!!results?.projects?.length && (
              <section>
                <h2 className="mb-4 border-b border-line pb-3 text-lg font-semibold text-ink">
                  Projects{" "}
                  <span className="app-badge ml-2">
                    {results.projects.length}
                  </span>
                </h2>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {results.projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </section>
            )}
            {!!results?.users?.length && (
              <section>
                <h2 className="mb-4 border-b border-line pb-3 text-lg font-semibold text-ink">
                  Users{" "}
                  <span className="app-badge ml-2">{results.users.length}</span>
                </h2>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {results.users.map((user) => (
                    <UserCard key={user.userId} user={user} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
