import Modal from "@/components/Modal";
import { useCreateProjectMutation } from "@/state/api";
import { useState, type FormEvent } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ModalNewProject({ isOpen, onClose }: Props) {
  const [createProject, { isLoading }] = useCreateProjectMutation();
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const valid =
    projectName.trim().length > 0 &&
    !!startDate &&
    !!endDate &&
    endDate >= startDate;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!valid) return;
    setError("");
    try {
      await createProject({
        name: projectName.trim(),
        description: description.trim(),
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      }).unwrap();
      setProjectName("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      onClose();
    } catch {
      setError(
        "Could not create the project. Check your connection and try again.",
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create project">
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="project-name" className="app-label">
            Project name
          </label>
          <input
            id="project-name"
            className="app-input"
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="project-description" className="app-label">
            Description{" "}
            <span className="normal-case tracking-normal">(optional)</span>
          </label>
          <textarea
            id="project-description"
            className="app-input min-h-24 resize-y"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="project-start" className="app-label">
              Start date
            </label>
            <input
              id="project-start"
              type="date"
              className="app-input"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="project-end" className="app-label">
              End date
            </label>
            <input
              id="project-end"
              type="date"
              min={startDate || undefined}
              className="app-input"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              required
            />
          </div>
        </div>
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
            {isLoading ? "Creating..." : "Create project"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
