import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    console.error(e);
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="bg-white shadow-md h-16 flex justify-between items-center px-8">
      <h1 className="text-2xl font-bold text-blue-600">
        TrackJet
      </h1>

      <div className="flex items-center gap-4">
        <span className="font-semibold">
          {user?.name}
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;