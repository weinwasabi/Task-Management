import Modal from "@/components/Modal";
import {
  Priority,
  Status,
  useCreateTaskMutation,
  useGetAuthUserQuery,
  useGetProjectsQuery,
  useGetUsersQuery,
} from "@/state/api";
import { useState, type FormEvent } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  id?: string | null;
};

export default function ModalNewTask({ isOpen, onClose, id = null }: Props) {
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const { data: account } = useGetAuthUserQuery({});
  const { data: users } = useGetUsersQuery();
  const { data: projects } = useGetProjectsQuery();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>(Status.ToDo);
  const [priority, setPriority] = useState<Priority>(Priority.Backlog);
  const [tags, setTags] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [authorUserId, setAuthorUserId] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [error, setError] = useState("");

  const selectedAuthorId =
    Number(authorUserId) || account?.userDetails?.userId || 0;
  const selectedProjectId = Number(id ?? projectId);
  const valid =
    title.trim().length > 0 &&
    selectedAuthorId > 0 &&
    selectedProjectId > 0 &&
    (!startDate || !dueDate || dueDate >= startDate);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!valid) return;
    setError("");
    try {
      await createTask({
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        tags: tags.trim(),
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        authorUserId: selectedAuthorId,
        assignedUserId: assignedUserId ? Number(assignedUserId) : undefined,
        projectId: selectedProjectId,
      }).unwrap();
      setTitle("");
      setDescription("");
      setTags("");
      setStartDate("");
      setDueDate("");
      setAssignedUserId("");
      onClose();
    } catch {
      setError("Could not create the task. Check the details and try again.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create task">
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="task-title" className="app-label">
            Title
          </label>
          <input
            id="task-title"
            className="app-input"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="task-description" className="app-label">
            Description{" "}
            <span className="normal-case tracking-normal">(optional)</span>
          </label>
          <textarea
            id="task-description"
            className="app-input min-h-20 resize-y"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="task-status" className="app-label">
              Status
            </label>
            <select
              id="task-status"
              className="app-input"
              value={status}
              onChange={(event) => setStatus(event.target.value as Status)}
            >
              {Object.values(Status).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="task-priority" className="app-label">
              Priority
            </label>
            <select
              id="task-priority"
              className="app-input"
              value={priority}
              onChange={(event) => setPriority(event.target.value as Priority)}
            >
              {Object.values(Priority).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="task-tags" className="app-label">
            Tags{" "}
            <span className="normal-case tracking-normal">
              (comma separated)
            </span>
          </label>
          <input
            id="task-tags"
            className="app-input"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="task-start" className="app-label">
              Start date
            </label>
            <input
              id="task-start"
              type="date"
              className="app-input"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="task-due" className="app-label">
              Due date
            </label>
            <input
              id="task-due"
              type="date"
              min={startDate || undefined}
              className="app-input"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="task-author" className="app-label">
              Author
            </label>
            <select
              id="task-author"
              className="app-input"
              value={String(selectedAuthorId || "")}
              onChange={(event) => setAuthorUserId(event.target.value)}
              required
            >
              <option value="">Select a user</option>
              {users?.map((user) => (
                <option key={user.userId} value={user.userId}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="task-assignee" className="app-label">
              Assignee{" "}
              <span className="normal-case tracking-normal">(optional)</span>
            </label>
            <select
              id="task-assignee"
              className="app-input"
              value={assignedUserId}
              onChange={(event) => setAssignedUserId(event.target.value)}
            >
              <option value="">Unassigned</option>
              {users?.map((user) => (
                <option key={user.userId} value={user.userId}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
        </div>
        {id === null && (
          <div>
            <label htmlFor="task-project" className="app-label">
              Project
            </label>
            <select
              id="task-project"
              className="app-input"
              value={projectId}
              onChange={(event) => setProjectId(event.target.value)}
              required
            >
              <option value="">Select a project</option>
              {projects?.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {error && (
          <p role="alert" className="text-sm text-ink">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2 border-t border-line pt-5">
          <button
            type="button"
            className="app-button-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="app-button-primary"
            disabled={!valid || isLoading}
          >
            {isLoading ? "Creating..." : "Create task"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
