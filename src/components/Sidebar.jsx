import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen p-5">
      <h2 className="text-3xl font-bold mb-10">
        🚀 TrackJet
      </h2>

      <nav className="space-y-4">
        <Link
          to="/dashboard"
          className="block hover:bg-slate-700 p-3 rounded-lg"
        >
          📊 Dashboard
        </Link>

        <Link
          to="/projects"
          className="block hover:bg-slate-700 p-3 rounded-lg"
        >
          📁 Projects
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;