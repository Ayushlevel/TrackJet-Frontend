import { useState, useEffect } from "react";
import API from "../services/api";

function EditProjectModal({ isOpen, onClose, project, onProjectUpdated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");

  useEffect(() => {
    if (project) {
      setTitle(project.title || "");
      setDescription(project.description || "");
      setStatus(project.status || "Active");
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await API.put(
        `/projects/${project._id}`,
        {
          title,
          description,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Project updated successfully!");
      if (onProjectUpdated) {
        await onProjectUpdated();
      }
      onClose();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update project");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl w-[450px] p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-5">
          Edit Project
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Project Title"
            className="w-full border rounded-lg p-3 mb-4"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Project Description"
            className="w-full border rounded-lg p-3 mb-4 h-32 resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded-lg p-3 mb-5 bg-white"
          >
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-5 py-2 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProjectModal;
