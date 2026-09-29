import { useState } from "react";
import API from "../services/api";

function CreateTaskModal({
  isOpen,
  onClose,
  projectId,
  fetchTasks,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/tasks",
        {
          title,
          description,
          priority,
          project: projectId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchTasks();

      setTitle("");
      setDescription("");
      setPriority("medium");

      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to create task");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6">
          Create Task
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Task Title"
            className="w-full border rounded p-3 mb-4"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Description"
            className="w-full border rounded p-3 mb-4"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            className="w-full border rounded p-3 mb-6"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>low</option>
            <option>medium</option>
            <option>high</option>
          </select>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTaskModal;