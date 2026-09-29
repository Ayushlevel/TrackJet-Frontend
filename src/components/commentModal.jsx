import { useEffect, useState } from "react";
import API from "../services/api";

function CommentModal({ isOpen, onClose, task }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const fetchComments = async () => {
    if (!task) return;

    try {
      const token = localStorage.getItem("token");

      const res = await API.get(`/comments/${task._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Comments API:", res.data);
      console.log("Comments Array:", res.data.comments);
      setComments(res.data.comments || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isOpen && task) {
      fetchComments();
    }
  }, [isOpen, task]);

  if (!isOpen || !task) return null;

  const addComment = async () => {
    if (!text.trim()) return;

    try {
      const token = localStorage.getItem("token");

      await API.post(
        `/comments/${task._id}`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setText("");
      fetchComments();
    } catch (error) {
      console.error("Error:", error);
      console.error("Response:", error.response?.data);
      console.error("Status:", error.response?.status);

      alert(error.response?.data?.message || "Failed to add comment");
    }
  };

  const updateComment = async () => {
    try {
      const token = localStorage.getItem("token");

      await API.put(
        `/comments/${editingId}`,
        { text: editText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditingId(null);
      setEditText("");
      fetchComments();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteComment = async (id) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      const token = localStorage.getItem("token");

      await API.delete(`/comments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchComments();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white w-[600px] rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">
          Comments - {task.title}
        </h2>

        <div className="h-72 overflow-y-auto border rounded p-3">
          {comments.length === 0 ? (
            <p className="text-gray-500">No comments yet.</p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="border-b py-3">
                <p className="font-semibold">
                  {comment.user?.name}
                </p>

                {editingId === comment._id ? (
                  <>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="border rounded w-full p-2 mt-2"
                      rows={3}
                    />

                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={updateComment}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>

                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditText("");
                        }}
                        className="bg-gray-500 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="mt-2">{comment.text}</p>

                    <small className="text-gray-500 block mt-1">
                      {new Date(comment.createdAt).toLocaleString()}
                    </small>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => {
                          setEditingId(comment._id);
                          setEditText(comment.text);
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteComment(comment._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="w-full border rounded mt-4 p-2"
          rows={3}
        />

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>

          <button
            onClick={addComment}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Comment
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommentModal;