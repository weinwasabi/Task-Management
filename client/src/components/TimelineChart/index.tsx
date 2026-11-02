import {
  addDays,
  addMonths,
  addWeeks,
  differenceInCalendarDays,
  differenceInCalendarMonths,
  differenceInCalendarWeeks,
  format,
  isValid,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";

export type TimelineViewMode = "Day" | "Week" | "Month";

export type TimelineItem = {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
};

type Props = {
  items: TimelineItem[];
  viewMode: TimelineViewMode;
};

const unitWidth: Record<TimelineViewMode, number> = {
  Day: 48,
  Week: 96,
  Month: 144,
};

const startOfUnit = (date: Date, viewMode: TimelineViewMode) => {
  if (viewMode === "Day") return startOfDay(date);
  if (viewMode === "Week") return startOfWeek(date, { weekStartsOn: 1 });
  return startOfMonth(date);
};

const addUnit = (date: Date, amount: number, viewMode: TimelineViewMode) => {
  if (viewMode === "Day") return addDays(date, amount);
  if (viewMode === "Week") return addWeeks(date, amount);
  return addMonths(date, amount);
};

const unitIndex = (date: Date, start: Date, viewMode: TimelineViewMode) => {
  if (viewMode === "Day") return differenceInCalendarDays(date, start);
  if (viewMode === "Week")
    return differenceInCalendarWeeks(date, start, { weekStartsOn: 1 });
  return differenceInCalendarMonths(date, start);
};

const unitLabel = (date: Date, viewMode: TimelineViewMode) => {
  if (viewMode === "Day") return format(date, "d MMM");
  if (viewMode === "Week") return format(date, "d MMM");
  return format(date, "MMM yyyy");
};

export default function TimelineChart({ items, viewMode }: Props) {
  const validItems = items.filter(
    ({ start, end }) => isValid(start) && isValid(end) && start <= end,
  );

  if (validItems.length === 0) {
    return (
      <p className="app-empty">
        No dated items to show. Add start and end dates to see a timeline.
      </p>
    );
  }

  const first = new Date(
    Math.min(...validItems.map((item) => item.start.getTime())),
  );
  const last = new Date(
    Math.max(...validItems.map((item) => item.end.getTime())),
  );
  const rangeStart = startOfUnit(first, viewMode);
  const count = unitIndex(last, rangeStart, viewMode) + 1;
  const width = unitWidth[viewMode];
  const chartWidth = count * width;
  const units = Array.from({ length: count }, (_, index) =>
    addUnit(rangeStart, index, viewMode),
  );

  return (
    <div
      className="overflow-x-auto"
      role="region"
      aria-label={`${viewMode} timeline`}
      tabIndex={0}
    >
      <ul className="sr-only">
        {validItems.map((item) => (
          <li key={item.id}>
            {item.name}: {format(item.start, "PP")} to {format(item.end, "PP")},{" "}
            {Math.round(item.progress)} percent complete
          </li>
        ))}
      </ul>
      <div style={{ minWidth: chartWidth + 192 }}>
        <div className="flex border-b border-line bg-subtle">
          <div className="sticky left-0 z-10 w-48 shrink-0 bg-subtle px-4 py-3 font-mono text-xs font-semibold uppercase tracking-wide text-muted">
            Name
          </div>
          <div className="flex" style={{ width: chartWidth }}>
            {units.map((date) => (
              <div
                key={date.toISOString()}
                className="shrink-0 border-l border-line px-2 py-3 text-center font-mono text-xs text-muted"
                style={{ width }}
              >
                {unitLabel(date, viewMode)}
              </div>
            ))}
          </div>
        </div>

        {validItems.map((item) => {
          const firstIndex = unitIndex(item.start, rangeStart, viewMode);
          const lastIndex = unitIndex(item.end, rangeStart, viewMode);
          const progress = Math.max(0, Math.min(100, item.progress));

          return (
            <div
              key={item.id}
              className="flex border-b border-line last:border-b-0"
            >
              <div
                className="sticky left-0 z-10 w-48 shrink-0 truncate bg-surface px-4 py-3 text-sm text-ink"
                title={item.name}
              >
                {item.name}
              </div>
              <div className="relative h-12" style={{ width: chartWidth }}>
                {units.map((date, index) => (
                  <div
                    key={date.toISOString()}
                    className="absolute inset-y-0 border-l border-line"
                    style={{ left: index * width }}
                  />
                ))}
                <div
                  className="absolute top-3 h-6 overflow-hidden rounded-md border border-line-strong bg-subtle"
                  style={{
                    left: firstIndex * width + 4,
                    width: (lastIndex - firstIndex + 1) * width - 8,
                  }}
                  title={`${item.name}: ${format(item.start, "PP")} – ${format(item.end, "PP")}`}
                >
                  <div
                    className="h-full bg-ink"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
