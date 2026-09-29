import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/navbar";
import CreateTaskModal from "../components/CreateTaskModal";
import API from "../services/api";
import EditTaskModal from "../components/EditTaskModal";
import AddMemberModal from "../components/AddMemberModal";
import CommentModal from "../components/commentModal";

function ProjectDetails() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  // Projects fetch
  const fetchProject = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get(`/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("API response", res.data);
      setProject(res.data.project);
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  // Task fetch
  const fetchTasks = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get(`/tasks/project/${id}`, {
        params: {
          search,
          status: statusFilter,
          priority: priorityFilter,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(res.data.tasks || []);
    } catch (error) {
      console.error(error);
    }
  }, [id, search, statusFilter, priorityFilter]);

  // Fetch members
  const fetchMembers = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get(`/projects/${id}/members`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMembers(res.data.members || []);
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  // Delete task
  const deleteTask = async (taskId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await API.delete(`/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Task deleted successfully!");
      fetchTasks();
    } catch (error) {
      console.error(error);
      alert("Failed to delete task");
    }
  };

  // Remove member
  const removeMember = async (userId) => {
    const confirmRemove = window.confirm(
      "Are you sure you want to remove this member?"
    );

    if (!confirmRemove) return;

    try {
      const token = localStorage.getItem("token");

      await API.delete(`/projects/${id}/members/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Member removed successfully!");
      fetchMembers();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to remove member");
    }
  };

  // Change status
  const changeStatus = async (taskId, status) => {
    try {
      const token = localStorage.getItem("token");

      await API.patch(
        `/tasks/status/${taskId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchTasks();
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    }
  };

  // Assign task
  const assignTask = async (taskId, assignedTo) => {
    try {
      const token = localStorage.getItem("token");

      await API.patch(
        `/tasks/assign/${taskId}`,
        { assignedTo },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchTasks();
    } catch (error) {
      console.error(error);
      alert("Failed to assign task");
    }
  };

  useEffect(() => {
    fetchProject();
    fetchTasks();
    fetchMembers();
  }, [fetchProject, fetchTasks, fetchMembers]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          {!project ? (
            <h2 className="text-xl">Loading...</h2>
          ) : (
            <>
              <button
                onClick={() => window.history.back()}
                className="mb-5 text-blue-600 font-semibold"
              >
                ← Back to Projects
              </button>

              <div className="bg-white rounded-xl shadow p-6">
                <h1 className="text-4xl font-bold">
                  {project.title}
                </h1>

                <p className="text-gray-600 mt-3">
                  {project.description}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className="font-semibold">{project.status}</p>
                  </div>

                  <div>
                    <p className="text-gray-500">Owner</p>
                    <p className="font-semibold">{project.owner?.name}</p>
                  </div>

                  <div>
                    <p className="text-gray-500">Members</p>
                    <p className="font-semibold">{project.members?.length}</p>
                  </div>

                  <div>
                    <p className="text-gray-500">Created</p>
                    <p className="font-semibold">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-6 mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">
                    Members ({members.length})
                  </h2>

                  <button
                    onClick={() => setIsMemberModalOpen(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    + Add Member
                  </button>
                </div>

                {members.map((member) => (
                  <div
                    key={member._id}
                    className="border-b py-3 flex justify-between"
                  >
                    <div>
                      <p className="font-semibold">{member.name}</p>
                      <p className="text-gray-500">{member.email}</p>
                    </div>
                    <div>
                      {project.owner?._id !== member._id && (
                        <button
                          onClick={() => removeMember(member._id)}
                          className="bg-red-500 hover:bg-red-400 text-white px-3 py-2 rounded"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 mt-6 mb-6">
                <input
                  type="text"
                  placeholder="Search task..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border rounded-lg px-3 py-2"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border rounded-lg px-3 py-2"
                >
                  <option value="">All Status</option>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="border rounded-lg px-3 py-2"
                >
                  <option value="">All Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div className="flex justify-between items-center mt-8">
                <h2 className="text-2xl font-bold">
                  Tasks ({tasks.length})
                </h2>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  + New Task
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {tasks.map((task) => (
                  <div
                    key={task._id}
                    className="bg-white rounded-xl shadow p-5"
                  >
                    <h3 className="text-xl font-bold">{task.title}</h3>

                    <p className="text-gray-500 mt-2">
                      {task.description}
                    </p>

                    <div className="mt-4">
                      <div className="mt-3">
                        <strong>Status:</strong>
                        <select
                          value={task.status}
                          onChange={(e) =>
                            changeStatus(task._id, e.target.value)
                          }
                          className="border rounded px-1 py-.5 ml-1"
                        >
                          <option value="todo">To Do</option>
                          <option value="in-progress">In Progress</option>
                          <option value="done">Done</option>
                        </select>
                      </div>

                      <p className="mt-2">
                        <strong>Priority:</strong> {task.priority}
                      </p>

                      <div className="mt-3">
                        <strong>Assigned:</strong>
                        <select
                          value={task.assignedTo?._id || ""}
                          onChange={(e) =>
                            assignTask(task._id, e.target.value)
                          }
                          className="border rounded px-2 py-1 ml-2"
                        >
                          <option value="">Unassigned</option>
                          {members.map((member) => (
                            <option key={member._id} value={member._id}>
                              {member.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mt-5 flex gap-2 flex-wrap">
                        <button
                          onClick={() => {
                            setEditingTask(task);
                            setIsEditModalOpen(true);
                          }}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteTask(task._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                        >
                          Delete
                        </button>

                        <button
                          onClick={() => {
                            setSelectedTask(task);
                            setIsCommentModalOpen(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                        >
                          Comments
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={id}
        fetchTasks={fetchTasks}
      />

      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={editingTask}
        fetchTasks={fetchTasks}
      />

      <AddMemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        projectId={id}
        fetchMembers={fetchMembers}
      />

      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        task={selectedTask}
      />
    </div>
  );
}

export default ProjectDetails;