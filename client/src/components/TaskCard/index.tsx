import type { Task } from "@/state/api";
import { format, isValid } from "date-fns";
import Image from "next/image";

type Props = {
  task: Task;
};

const displayDate = (value?: string) => {
  const date = value ? new Date(value) : null;
  return date && isValid(date) ? format(date, "d MMM yyyy") : "Not set";
};

export default function TaskCard({ task }: Props) {
  return (
    <article className="app-panel min-w-0 p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="app-kicker">Task / {task.id}</span>
        {task.status && <span className="app-badge">{task.status}</span>}
        {task.priority && <span className="app-badge">{task.priority}</span>}
      </div>
      <h3 className="mt-4 text-lg font-semibold leading-snug text-ink">
        {task.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
        {task.description || "No description yet."}
      </p>
      {task.attachments?.[0] && (
        <Image
          src={`https://pm-s3-images.s3.us-east-2.amazonaws.com/${task.attachments[0].fileURL}`}
          alt={task.attachments[0].fileName || "Task attachment"}
          width={400}
          height={200}
          className="mt-4 h-36 w-full rounded-lg border border-line object-cover"
        />
      )}
      {task.tags && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {task.tags.split(",").map((tag) => (
            <span className="app-badge" key={tag.trim()}>
              {tag.trim()}
            </span>
          ))}
        </div>
      )}
      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4 text-xs">
        <div>
          <span className="app-kicker block">Start</span>
          <span className="mt-1 block text-ink">
            {displayDate(task.startDate)}
          </span>
        </div>
        <div>
          <span className="app-kicker block">Due</span>
          <span className="mt-1 block text-ink">
            {displayDate(task.dueDate)}
          </span>
        </div>
        <div>
          <span className="app-kicker block">Author</span>
          <span className="mt-1 block truncate text-ink">
            {task.author?.username || "Unknown"}
          </span>
        </div>
        <div>
          <span className="app-kicker block">Assignee</span>
          <span className="mt-1 block truncate text-ink">
            {task.assignee?.username || "Unassigned"}
          </span>
        </div>
      </div>
    </article>
  );
}
