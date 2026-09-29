import { useState, useEffect } from "react";
import API from "../services/api";

function EditTaskModal({
  isOpen,
  onClose,
  task,
  fetchTasks,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await API.put(
        `/tasks/${task._id}`,
        {
          title,
          description,
          priority,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchTasks();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to update task");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6">
          Edit Task
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="w-full border rounded p-3 mb-4"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
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
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
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
              className="px-5 py-2 bg-yellow-500 text-white rounded"
            >
              Update Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTaskModal;