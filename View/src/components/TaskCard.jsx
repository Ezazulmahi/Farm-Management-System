// TaskCard.jsx
import React from "react";

const TaskCard = ({ task, onComplete, onDelete }) => {
  const isOverdue = task.status !== "Completed" && new Date(task.dueDate) < new Date();

  return (
    <div className={`bg-white shadow-lg rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center border-2 transition ${isOverdue ? "border-red-500" : "border-transparent"} hover:border-green-400`}>      
      <div className="space-y-1">
        <h4 className="font-bold text-xl text-gray-800">{task.title}</h4>
        <p className="text-sm text-gray-600">{task.description}</p>
        <p className="text-sm text-gray-500">
          👤 {task.assignedTo} | 📅 {new Date(task.dueDate).toLocaleDateString()}
        </p>
        <span className={`inline-block px-3 py-1 text-xs rounded-full font-semibold mt-1 ${task.status === "Completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
          {task.status} {isOverdue && <span className="ml-1 text-red-600">⚠️ Overdue</span>}
        </span>
      </div>
      <div className="flex gap-2 mt-4 md:mt-0">
        {task.status !== "Completed" && (
          <button onClick={onComplete} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition">
            Complete
          </button>
        )}
        <button onClick={onDelete} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition">
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
