import {
  type Task,
  useGetTasksQuery,
  useUpdateTaskStatusMutation,
} from "@/state/api";
import { format, isValid } from "date-fns";
import { MessageSquareMore, Plus } from "lucide-react";
import Image from "next/image";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const statuses = ["To Do", "Work In Progress", "Under Review", "Completed"];

const displayDate = (value?: string) => {
  const date = value ? new Date(value) : null;
  return date && isValid(date) ? format(date, "d MMM") : null;
};

export default function BoardView({ id, setIsModalNewTaskOpen }: Props) {
  const {
    data: tasks,
    isLoading,
    error,
  } = useGetTasksQuery({
    projectId: Number(id),
  });
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const moveTask = (taskId: number, status: string) => {
    void updateTaskStatus({ taskId, status });
  };

  if (isLoading) return <p className="py-6 text-muted">Loading tasks...</p>;
  if (error)
    return (
      <p role="alert" className="py-6 text-ink">
        Could not load tasks.
      </p>
    );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid gap-4 pb-8 md:grid-cols-2 xl:grid-cols-4">
        {statuses.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={(tasks ?? []).filter((task) => task.status === status)}
            moveTask={moveTask}
            onAddTask={() => setIsModalNewTaskOpen(true)}
          />
        ))}
      </div>
    </DndProvider>
  );
}

function TaskColumn({
  status,
  tasks,
  moveTask,
  onAddTask,
}: {
  status: string;
  tasks: Task[];
  moveTask: (taskId: number, status: string) => void;
  onAddTask: () => void;
}) {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "task",
      drop: (item: { id: number }) => moveTask(item.id, status),
      collect: (monitor) => ({ isOver: monitor.isOver() }),
    }),
    [moveTask, status],
  );

  return (
    <section
      ref={(node) => {
        drop(node);
      }}
      aria-label={status}
      className={`min-w-0 rounded-xl border p-2 transition-colors duration-200 ${
        isOver ? "border-line-strong bg-ink/10" : "border-line bg-subtle"
      }`}
    >
      <div className="mb-2 flex min-h-10 items-center justify-between px-2">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.06em] text-ink">
          {status} <span className="ml-1 text-muted">({tasks.length})</span>
        </h2>
        <button
          type="button"
          aria-label={`Add task to ${status}`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-line-strong bg-surface text-ink hover:bg-ink hover:text-canvas"
          onClick={onAddTask}
        >
          <Plus aria-hidden="true" size={16} />
        </button>
      </div>
      <div className="space-y-2">
        {tasks.length ? (
          tasks.map((task) => (
            <BoardTask key={task.id} task={task} moveTask={moveTask} />
          ))
        ) : (
          <p className="rounded-lg border border-dashed border-line-strong px-3 py-6 text-center text-xs text-muted">
            No tasks in this stage
          </p>
        )}
      </div>
    </section>
  );
}

function BoardTask({
  task,
  moveTask,
}: {
  task: Task;
  moveTask: (taskId: number, status: string) => void;
}) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "task",
      item: { id: task.id },
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    }),
    [task.id],
  );
  const start = displayDate(task.startDate);
  const due = displayDate(task.dueDate);

  return (
    <article
      ref={(node) => {
        drag(node);
      }}
      className={`app-panel overflow-hidden p-4 ${isDragging ? "opacity-50" : ""}`}
    >
      {task.attachments?.[0] && (
        <Image
          src={`https://pm-s3-images.s3.us-east-2.amazonaws.com/${task.attachments[0].fileURL}`}
          alt={task.attachments[0].fileName || "Task attachment"}
          width={400}
          height={200}
          className="mb-3 h-32 w-full rounded-lg border border-line object-cover"
        />
      )}
      <div className="flex flex-wrap items-center gap-1.5">
        {task.priority && (
          <span
            className={`app-badge ${task.priority === "Urgent" ? "bg-ink text-canvas" : ""}`}
          >
            {task.priority}
          </span>
        )}
        {task.tags?.split(",").map((tag, index) => (
          <span key={`${index}-${tag}`} className="app-badge">
            {tag.trim()}
          </span>
        ))}
      </div>
      <h3 className="mt-3 text-sm font-semibold leading-snug text-ink">
        {task.title}
      </h3>
      {task.description && (
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
          {task.description}
        </p>
      )}
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-line pt-3">
        <span className="font-mono text-xs text-muted">
          {[start, due].filter(Boolean).join(" – ") || "No dates"}
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-muted">
          <MessageSquareMore aria-hidden="true" size={15} />
          {task.comments?.length ?? 0}
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex -space-x-1.5">
          {[task.assignee, task.author]
            .filter((user) => !!user)
            .map((user) => (
              <span
                key={user!.userId}
                title={user!.username}
                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface bg-subtle font-mono text-xs uppercase text-ink"
              >
                {user!.username.charAt(0)}
              </span>
            ))}
        </div>
        <label className="sr-only" htmlFor={`task-status-${task.id}`}>
          Status for {task.title}
        </label>
        <select
          id={`task-status-${task.id}`}
          className="max-w-36 rounded-md border border-line bg-surface px-2 py-1 font-mono text-[11px] text-ink"
          value={task.status ?? statuses[0]}
          onChange={(event) => moveTask(task.id, event.target.value)}
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
    </article>
  );
}
