import Sidebar from "../components/Sidebar";
import Navbar from "../components/navbar";
import StatsCard from "../components/StatsCard";
import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    doneTasks: 0,
    inProgressTasks: 0,
    todoTasks: 0,
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get("/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Dashboard Response:", res.data);

        if (res.data?.dashboard?.stats) {
          setStats(res.data.dashboard.stats);
        }
      } catch (error) {
        console.log("Dashboard error:", error);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">
            Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Projects"
              value={stats.totalProjects}
              color="text-blue-600"
            />

            <StatsCard
              title="Total Tasks"
              value={stats.totalTasks}
              color="text-green-600"
            />

            <StatsCard
              title="Completed"
              value={stats.doneTasks}
              color="text-purple-600"
            />

            <StatsCard
              title="Pending"
              value={stats.todoTasks + stats.inProgressTasks}
              color="text-red-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;