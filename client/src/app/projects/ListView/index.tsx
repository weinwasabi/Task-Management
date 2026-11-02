import Header from "@/components/Header";
import TaskCard from "@/components/TaskCard";
import { Task, useGetTasksQuery } from "@/state/api";
import React from "react";

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const ListView = ({ id, setIsModalNewTaskOpen }: Props) => {
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

  if (isLoading) return <p className="py-6 text-muted">Loading tasks...</p>;
  if (error)
    return (
      <p role="alert" className="py-6 text-ink">
        Could not load tasks.
      </p>
    );

  return (
    <div className="pb-8">
      <div className="pt-5">
        <Header
          name="List"
          buttonComponent={
            <button
              type="button"
              className="app-button-primary"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              Add task
            </button>
          }
          isSmallText
        />
      </div>
      {tasks?.length ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tasks.map((task: Task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <p className="app-empty">
          No tasks yet. Add the first task to this project.
        </p>
      )}
    </div>
  );
};

export default ListView;
