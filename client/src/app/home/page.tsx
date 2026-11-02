"use client";

import Header from "@/components/Header";
import { useAppSelector } from "@/app/redux";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import {
  Priority,
  Status,
  useGetAllTasksQuery,
  useGetProjectsQuery,
} from "@/state/api";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const taskColumns: GridColDef[] = [
  { field: "title", headerName: "Title", flex: 1, minWidth: 180 },
  { field: "status", headerName: "Status", width: 150 },
  { field: "priority", headerName: "Priority", width: 130 },
  { field: "dueDate", headerName: "Due Date", width: 160 },
];

const statusColors = ["#0a0a0a", "#404040", "#737373", "#a3a3a3", "#d4d4d4"];
const darkStatusColors = [
  "#f4f4f5",
  "#c5c5cb",
  "#a0a0a8",
  "#77777f",
  "#4b4b54",
];

export default function HomePage() {
  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useGetAllTasksQuery();
  const {
    data: projects,
    isLoading: projectsLoading,
    isError: projectsError,
  } = useGetProjectsQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  if (tasksLoading || projectsLoading) {
    return <p className="app-page text-muted">Loading dashboard...</p>;
  }

  if (tasksError || projectsError || !tasks || !projects) {
    return (
      <p role="alert" className="app-page text-ink">
        Could not load the dashboard. Check that the API is running, then
        refresh.
      </p>
    );
  }

  const priorityDistribution = [...Object.values(Priority), "Unspecified"].map(
    (name) => ({
      name,
      count: tasks.filter((task) => (task.priority ?? "Unspecified") === name)
        .length,
    }),
  );
  const statusDistribution = [...Object.values(Status), "Unspecified"]
    .map((name) => ({
      name,
      count: tasks.filter((task) => (task.status ?? "Unspecified") === name)
        .length,
    }))
    .filter(({ count }) => count > 0);
  const completedTasks = tasks.filter(
    (task) => task.status === Status.Completed,
  ).length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === Status.WorkInProgress,
  ).length;
  const textColor = "rgb(var(--color-muted))";
  const gridColor = "rgb(var(--color-line))";

  return (
    <div className="app-page">
      <Header name="Dashboard" />
      <div className="mb-10 grid grid-cols-2 border-b border-line lg:grid-cols-4">
        {[
          { label: "Projects", value: projects.length },
          { label: "Tasks", value: tasks.length },
          { label: "Completed tasks", value: completedTasks },
          { label: "In progress", value: inProgressTasks },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="border-r border-t border-line px-4 py-5 last:border-r-0 lg:px-5"
          >
            <p className="app-kicker">{label}</p>
            <p className="mt-3 font-mono text-3xl font-semibold tracking-[-0.06em] text-ink sm:text-4xl">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <section className="app-panel min-w-0 p-5">
          <h2 className="mb-5 text-lg font-semibold text-ink">
            Task priorities
          </h2>
          {tasks.length === 0 ? (
            <p className="app-empty">
              No tasks yet. Create a project and add its first task.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={priorityDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" stroke={textColor} />
                <YAxis allowDecimals={false} stroke={textColor} />
                <Tooltip />
                <Bar
                  dataKey="count"
                  fill="rgb(var(--color-ink))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </section>

        <section className="app-panel min-w-0 p-5">
          <h2 className="mb-5 text-lg font-semibold text-ink">Task status</h2>
          {tasks.length === 0 ? (
            <p className="app-empty">Task status will appear here.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  dataKey="count"
                  nameKey="name"
                  label={{ fill: "rgb(var(--color-ink))", fontSize: 12 }}
                >
                  {statusDistribution.map(({ name }, index) => (
                    <Cell
                      key={name}
                      fill={
                        (isDarkMode ? darkStatusColors : statusColors)[
                          index % statusColors.length
                        ]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </section>

        <section className="min-w-0 pt-5 lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-ink">All tasks</h2>
          {tasks.length === 0 ? (
            <p className="app-empty">No tasks to display.</p>
          ) : (
            <div className="h-96 w-full">
              <DataGrid
                rows={tasks}
                columns={taskColumns}
                getRowClassName={() => "data-grid-row"}
                getCellClassName={() => "data-grid-cell"}
                className={dataGridClassNames}
                sx={dataGridSxStyles(isDarkMode)}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
