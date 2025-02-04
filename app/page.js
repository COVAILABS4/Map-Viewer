"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Form,
  Button,
  Spinner,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email_id: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const [session, setSession] = useState({
    email: "",
    password: "",
    userId: "",
  });

  useEffect(() => {
    // Retrieve session storage values on mount
    const storedEmail = sessionStorage.getItem("email") || "";
    const storedPassword = sessionStorage.getItem("password") || "";
    const storedUserId = sessionStorage.getItem("userId") || "";

    setSession({
      email: storedEmail,
      password: storedPassword,
      userId: storedUserId,
    });

    if (storedUserId) {
      router.push("/dashboard");
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        sessionStorage.setItem("email", formData.email_id);
        sessionStorage.setItem("password", formData.password);
        sessionStorage.setItem("userId", data.user._id);

        setSession({
          email: formData.email_id,
          password: formData.password,
          userId: data.user._id,
        });

        alert("Login successful!");
        router.push("/dashboard");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setLoggingIn(false);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card
        className="shadow-lg p-4"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <Card.Body>
          <h2 className="text-center mb-4 text-primary">Login</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email_id"
                placeholder="Enter email"
                value={formData.email_id}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button
              variant="success"
              type="submit"
              className="w-100"
              disabled={loggingIn}
            >
              {loggingIn ? "Logging in..." : "Login"}
            </Button>
          </Form>
          <Row className="mt-3 text-center">
            <Col>
              <Button
                variant="outline-primary"
                className="w-100"
                onClick={() => router.push("/register")}
              >
                Register
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}
