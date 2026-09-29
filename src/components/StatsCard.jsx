function StatsCard({ title, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-gray-500 text-sm">{title}</h3>

      <h1 className={`text-3xl font-bold mt-2 ${color}`}>
        {value}
      </h1>
    </div>
  );
}

export default StatsCard;