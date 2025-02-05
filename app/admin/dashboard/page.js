"use client";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";

const Page = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        if (res.ok) {
          setUsers(data);
        } else {
          setError("Failed to fetch users");
        }
      } catch (err) {
        setError("Something went wrong!");
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const handleClick = (id) => {
    router.push(`${id}/`);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary">User List</h2>

      {loading && (
        <div className="text-center">
          <div className="spinner-border text-primary"></div>
          <p>Loading users...</p>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <table className="table table-hover mt-3">
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr
                  style={{ cursor: "pointer" }}
                  onClick={() => handleClick(user._id)}
                  key={index}
                >
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email_id}</td>
                  <td>{user.phone_number}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Page;
