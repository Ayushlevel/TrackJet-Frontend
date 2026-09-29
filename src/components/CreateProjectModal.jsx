import { useState } from "react";
import API from "../services/api";

function CreateProjectModal({ isOpen, onClose, onProjectCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/projects",
        {
          title,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTitle("");
      setDescription("");

      await onProjectCreated();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl w-[450px] p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-5">
          Create New Project
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
            className="w-full border rounded-lg p-3 mb-5 h-32 resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

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
              className="bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProjectModal;