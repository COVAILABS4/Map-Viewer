"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap Import

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email_id: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Registration successful!");
        router.push("/");
      } else {
        const error = await res.json();
        alert(error.message);
      }
    } catch (error) {
      console.error("Registration failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow-lg p-4 rounded-4 w-100"
        style={{ maxWidth: "400px" }}
      >
        <h2 className="text-center fw-bold mb-3">Register</h2>
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            required
            className="form-control"
          />
          <input
            type="text"
            name="phone_number"
            placeholder="Phone Number"
            onChange={handleChange}
            required
            className="form-control"
          />
          <input
            type="email"
            name="email_id"
            placeholder="Email"
            onChange={handleChange}
            required
            className="form-control"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="form-control"
          />
          <button
            type="submit"
            className="btn btn-primary w-100 fw-bold"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>
        <div className="text-center mt-3">
          <p className="mb-1">Already have an account?</p>
          <button
            className="btn btn-outline-secondary w-100 fw-bold"
            onClick={() => router.push("/")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
