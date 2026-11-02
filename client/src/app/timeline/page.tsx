"use client";

import Header from "@/components/Header";
import TimelineChart, {
  type TimelineItem,
  type TimelineViewMode,
} from "@/components/TimelineChart";
import { useGetProjectsQuery } from "@/state/api";
import { useMemo, useState } from "react";

const Timeline = () => {
  const { data: projects, isLoading, isError } = useGetProjectsQuery();

  const [viewMode, setViewMode] = useState<TimelineViewMode>("Month");

  const timelineItems = useMemo<TimelineItem[]>(() => {
    return (
      projects?.map((project) => ({
        start: new Date(project.startDate ?? ""),
        end: new Date(project.endDate ?? ""),
        name: project.name,
        id: `Project-${project.id}`,
        progress: 50,
      })) || []
    );
  }, [projects]);

  if (isLoading)
    return <p className="app-page text-muted">Loading timeline...</p>;
  if (isError || !projects)
    return (
      <p role="alert" className="app-page text-ink">
        Could not load projects.
      </p>
    );

  return (
    <div className="app-page">
      <Header name="Project timeline" />
      <div className="mb-4 flex items-center justify-end gap-3">
        <label htmlFor="project-timeline-scale" className="app-label mb-0">
          Scale
        </label>
        <div className="w-36">
          <select
            id="project-timeline-scale"
            className="app-input"
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
      </div>
    </div>
  );
};

export default Timeline;
