import React, { useState } from "react";
import UserList from "../components/UserList";
import UserForm from "../components/UserForm";
import Sidebar from "../components/Sidebar"; // Import the Sidebar component
import "../styles/ManageUsers.css"; // Import styles if needed

const ManageUsers = () => {
  const [editingUser, setEditingUser] = useState(null);

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleSave = () => {
    setEditingUser(null);
  };

  return (
    <div className="manage-users-container">
      <Sidebar /> {/* Add the Sidebar component */}
      <div className="manage-users-content">
        <h1>Manage Users</h1>
        <UserList onEdit={handleEdit} />
        {editingUser && <UserForm user={editingUser} onSave={handleSave} />}
      </div>
    </div>
  );
};

export default ManageUsers;