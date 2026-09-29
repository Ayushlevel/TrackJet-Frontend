import { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/navbar";
import API from "../services/api";
import CreateProjectModal from "../components/CreateProjectModal";
import EditProjectModal from "../components/EditProjectModal";
import { useNavigate } from "react-router-dom";

function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Fetch all projects
  const fetchProjects = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProjects(res.data.projects || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const deleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      const token = localStorage.getItem("token");
      await API.delete(`/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Project deleted successfully");
      fetchProjects();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete project");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Projects</h1>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              + New Project
            </button>
          </div>

          {/* Project Cards */}
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition"
                >
                  <h2 className="text-2xl font-semibold">
                    {project.title}
                  </h2>

                  <p className="text-gray-600 mt-2">
                    {project.description || "No description"}
                  </p>

                  <div className="mt-4">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      {project.status}
                    </span>
                  </div>

                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={() => navigate(`/project/${project._id}`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      View
                    </button>

                    <button
                      onClick={() => {
                        setEditingProject(project);
                        setIsEditModalOpen(true);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteProject(project._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-10 text-center text-gray-500">
              No projects found.
            </div>
          )}

          {/* Create Project Modal */}
          <CreateProjectModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onProjectCreated={fetchProjects}
          />

          {/* Edit Project Modal */}
          <EditProjectModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingProject(null);
            }}
            project={editingProject}
            onProjectUpdated={fetchProjects}
          />
        </div>
      </div>
    </div>
  );
}

export default Projects;