// src/pages/AdminUserManagementPage.js
import React, { useState, useEffect } from "react";

function AdminUserManagementPage() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "", // Added password field
    role: "Borrower",
  });
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("http://localhost:5000/api/users", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      } else {
        alert(data.message);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(newUser),
    });
    const data = await res.json();
    if (res.ok) {
      setUsers([...users, data]);
      setNewUser({ name: "", email: "", password: "", role: "Borrower" }); // Reset form
    } else {
      alert(data.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (res.ok) {
      setUsers(users.filter((user) => user._id !== userId));
    } else {
      const data = await res.json();
      alert(data.message);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:5000/api/users/${editingUser._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(editingUser),
    });
    const data = await res.json();
    if (res.ok) {
      setUsers(users.map((user) => user._id === editingUser._id ? editingUser : user));
      setEditingUser(null);
    } else {
      alert(data.message);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}> {/* Inline style for container */}
      <h2>User Management (Admin)</h2>

      {/* Add User Form */}
      <form onSubmit={handleAddUser} style={{ marginBottom: "30px", border: "1px solid #ccc", padding: "15px", borderRadius: "5px" }}> {/* Inline style for form */}
        <h3 style={{ marginTop: "0" }}>Add New User</h3> {/* Inline style for heading */}
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          required
          style={{ marginRight: "10px", padding: "8px", border: "1px solid #ccc", borderRadius: "3px" }} // Inline style for input
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          required
          style={{ marginRight: "10px", padding: "8px", border: "1px solid #ccc", borderRadius: "3px" }} // Inline style for input
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          required
          style={{ marginRight: "10px", padding: "8px", border: "1px solid #ccc", borderRadius: "3px" }} // Inline style for input
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          style={{ marginRight: "10px", padding: "8px", border: "1px solid #ccc", borderRadius: "3px" }} // Inline style for select
        >
          <option value="Borrower">Borrower</option>
          <option value="Lender">Lender</option>
          <option value="Admin">Admin</option>
        </select>
        <button type="submit" style={{ backgroundColor: "#007bff", color: "white", cursor: "pointer", border: "none", padding: "8px 15px", borderRadius: "3px" }}> {/* Inline style for button */}
          Add User
        </button>
      </form>

      {/* Edit User Form */}
      {editingUser && (
        <form onSubmit={handleUpdateUser} style={{ marginBottom: "30px", border: "1px solid #ccc", padding: "15px", borderRadius: "5px" }}> {/* Inline style for form */}
          <h3>Edit User</h3>
          <input
            type="text"
            value={editingUser.name}
            onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
            required
            style={{ marginRight: "10px", padding: "8px", border: "1px solid #ccc", borderRadius: "3px" }} // Inline style for input
          />
          <input
            type="email"
            value={editingUser.email}
            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
            required
            style={{ marginRight: "10px", padding: "8px", border: "1px solid #ccc", borderRadius: "3px" }} // Inline style for input
          />
          <select
            value={editingUser.role}
            onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
            style={{ marginRight: "10px", padding: "8px", border: "1px solid #ccc", borderRadius: "3px" }} // Inline style for select
          >
            <option value="Borrower">Borrower</option>
            <option value="Lender">Lender</option>
            <option value="Admin">Admin</option>
          </select>
          <button type="submit" style={{ backgroundColor: "#28a745", color: "white", cursor: "pointer", border: "none", padding: "8px 15px", borderRadius: "3px" }}> {/* Inline style for button */}
            Update User
          </button>
        </form>
      )}

      {/* Users List */}
      <h3>All Users</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}> {/* Inline style for table */}
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}> {/* Inline style for table header row */}
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Name</th> {/* Inline style for table header */}
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Email</th> {/* Inline style for table header */}
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Role</th> {/* Inline style for table header */}
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Actions</th> {/* Inline style for table header */}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} style={{ backgroundColor: user._id === editingUser?._id ? "#ffffcc" : "transparent" }}> {/* Inline style for table row (highlight editing row) */}
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.name}</td> {/* Inline style for table data */}
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.email}</td> {/* Inline style for table data */}
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.role}</td> {/* Inline style for table data */}
              <td style={{ border: "1px solid #ddd", padding: "8px" }}> {/* Inline style for table data */}
                <button onClick={() => handleEditUser(user)} style={{ marginRight: "5px", padding: "5px 10px", cursor: "pointer" }}>Edit</button> {/* Inline style for button */}
                <button onClick={() => handleDeleteUser(user._id)} style={{ backgroundColor: "#dc3545", color: "white", cursor: "pointer", border: "none", padding: "5px 10px", borderRadius: "3px" }}>Delete</button> {/* Inline style for button */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUserManagementPage;