import type { Project } from "@/state/api";
import { format, isValid } from "date-fns";
import Link from "next/link";

type Props = {
  project: Project;
};

const displayDate = (value?: string) => {
  const date = value ? new Date(value) : null;
  return date && isValid(date) ? format(date, "d MMM yyyy") : "Not set";
};

export default function ProjectCard({ project }: Props) {
  return (
    <article className="app-panel p-5">
      <p className="app-kicker">Project / {project.id}</p>
      <h3 className="mt-3 text-lg font-semibold text-ink">
        <Link
          href={`/projects/${project.id}`}
          className="underline decoration-line-strong underline-offset-4 hover:decoration-ink"
        >
          {project.name}
        </Link>
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {project.description || "No description yet."}
      </p>
      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-4 text-xs text-muted">
        <span>Start: {displayDate(project.startDate)}</span>
        <span>End: {displayDate(project.endDate)}</span>
      </div>
    </article>
  );
}
