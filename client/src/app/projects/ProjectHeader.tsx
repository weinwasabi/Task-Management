import Header from "@/components/Header";
import { useGetProjectsQuery } from "@/state/api";
import { Clock, Grid3x3, List, Plus, Table } from "lucide-react";
import { useState } from "react";
import ModalNewProject from "./ModalNewProject";

type Props = {
  id: string;
  activeTab: string;
  setActiveTab: (tabName: string) => void;
};

const tabs = [
  { name: "Board", icon: Grid3x3 },
  { name: "List", icon: List },
  { name: "Timeline", icon: Clock },
  { name: "Table", icon: Table },
];

export default function ProjectHeader({ id, activeTab, setActiveTab }: Props) {
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);
  const { data: projects } = useGetProjectsQuery();
  const project = projects?.find((item) => item.id === Number(id));

  return (
    <>
      <ModalNewProject
        isOpen={isModalNewProjectOpen}
        onClose={() => setIsModalNewProjectOpen(false)}
      />
      <p className="app-kicker mb-3">Project / {id}</p>
      <Header
        name={project?.name ?? "Project"}
        buttonComponent={
          <button
            type="button"
            className="app-button-primary"
            onClick={() => setIsModalNewProjectOpen(true)}
          >
            <Plus aria-hidden="true" size={16} />
            New project
          </button>
        }
      />
      <div
        role="group"
        aria-label="Project views"
        className="mb-6 flex gap-5 overflow-x-auto border-b border-line"
      >
        {tabs.map(({ name, icon: Icon }) => {
          const selected = activeTab === name;
          return (
            <button
              key={name}
              type="button"
              aria-pressed={selected}
              className={`flex min-h-11 shrink-0 items-center gap-2 border-b-2 px-1 text-sm transition-colors duration-200 ${
                selected
                  ? "border-ink font-medium text-ink"
                  : "border-transparent text-muted hover:text-ink"
              }`}
              onClick={() => setActiveTab(name)}
            >
              <Icon aria-hidden="true" size={16} />
              {name}
            </button>
          );
        })}
      </div>
    </>
  );
}
