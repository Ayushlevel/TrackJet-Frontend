import { useState } from "react";
import API from "../services/api";

function AddMemberModal({
  isOpen,
  onClose,
  projectId,
  fetchMembers,
}) {
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await API.post(
        `/projects/${projectId}/members`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Member added successfully!");

      fetchMembers();
      setEmail("");
      onClose();
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message || "Failed to add member"
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-96">
        <h2 className="text-2xl font-bold mb-5">
          Add Member
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter member email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg p-2 mb-5"
            required
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMemberModal;