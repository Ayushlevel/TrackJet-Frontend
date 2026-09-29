import { useNavigate } from "react-router-dom";
import { FiUsers, FiCalendar, FiArrowRight, FiEdit2, FiTrash2, FiShield } from "react-icons/fi";

function ProjectCard({ project, onEdit, onDelete, currentUser }) {
  const navigate = useNavigate();

  const isOwner =
    currentUser &&
    (project.owner?._id === currentUser._id ||
      project.owner === currentUser._id ||
      project.owner?.email === currentUser.email);

  const isCompleted = project.status === "Completed";

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-lg transition-all duration-200 p-6 flex flex-col justify-between group">
      <div>
        {/* Header Badges */}
        <div className="flex justify-between items-start gap-2 mb-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
              isCompleted
                ? "bg-purple-100 text-purple-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {project.status || "Active"}
          </span>

          {isOwner && (
            <span className="flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
              <FiShield className="text-xs" /> Owner
            </span>
          )}
        </div>

        {/* Project Title */}
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
          {project.title}
        </h3>

        {/* Project Description */}
        <p className="text-gray-500 text-sm mt-2 line-clamp-2 leading-relaxed min-h-[40px]">
          {project.description || "No description provided."}
        </p>

        {/* Metadata stats */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1.5" title="Project Owner">
            <span className="font-medium text-gray-700">
              {project.owner?.name || "Team Lead"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {project.members && (
              <span
                className="flex items-center gap-1 text-gray-600"
                title="Total Members"
              >
                <FiUsers className="text-gray-400" />
                {project.members.length}
              </span>
            )}
            {project.createdAt && (
              <span
                className="flex items-center gap-1 text-gray-400"
                title="Creation Date"
              >
                <FiCalendar />
                {new Date(project.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
        <button
          onClick={() => navigate(`/project/${project._id}`)}
          className="flex-1 flex items-center justify-center gap-1.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white font-semibold text-sm px-4 py-2 rounded-xl transition duration-150"
        >
          <span>Open Project</span>
          <FiArrowRight className="text-sm" />
        </button>

        {isOwner && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(project)}
              className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
              title="Edit Project"
            >
              <FiEdit2 className="text-base" />
            </button>
            <button
              onClick={() => onDelete(project)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
              title="Delete Project"
            >
              <FiTrash2 className="text-base" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectCard;
