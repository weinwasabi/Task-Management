import TimelineChart, {
  type TimelineItem,
  type TimelineViewMode,
} from "@/components/TimelineChart";
import { useGetTasksQuery } from "@/state/api";
import { useMemo, useState } from "react";

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const Timeline = ({ id, setIsModalNewTaskOpen }: Props) => {
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

  const [viewMode, setViewMode] = useState<TimelineViewMode>("Month");

  const timelineItems = useMemo<TimelineItem[]>(() => {
    return (
      tasks?.map((task) => ({
        start: new Date(task.startDate ?? ""),
        end: new Date(task.dueDate ?? ""),
        name: task.title,
        id: `Task-${task.id}`,
        progress: task.points ? (task.points / 10) * 100 : 0,
      })) || []
    );
  }, [tasks]);

  if (isLoading) return <p className="py-6 text-muted">Loading tasks...</p>;
  if (error || !tasks)
    return (
      <p role="alert" className="py-6 text-ink">
        Could not load tasks.
      </p>
    );

  return (
    <div className="pb-8">
      <div className="flex flex-wrap items-center justify-between gap-3 py-5">
        <h2 className="text-lg font-semibold text-ink">Task timeline</h2>
        <div className="flex items-center gap-3">
          <label htmlFor="task-timeline-scale" className="app-label mb-0">
            Scale
          </label>
          <select
            id="task-timeline-scale"
            className="app-input w-36"
            value={viewMode}
            onChange={(event) =>
              setViewMode(event.target.value as TimelineViewMode)
            }
          >
            <option value="Day">Day</option>
            <option value="Week">Week</option>
            <option value="Month">Month</option>
          </select>
        </div>
      </div>

      <div className="app-panel overflow-hidden">
        <TimelineChart items={timelineItems} viewMode={viewMode} />
        <div className="px-4 pb-5 pt-1">
          <button
            className="app-button-primary"
            onClick={() => setIsModalNewTaskOpen(true)}
          >
            Add task
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
