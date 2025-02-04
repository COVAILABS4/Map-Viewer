"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Spinner,
  Button,
  Container,
  Row,
  Col,
  ListGroup,
  Card,
  Badge,
  Modal,
  Form,
} from "react-bootstrap";
import {
  FaMapMarkedAlt,
  FaEdit,
  FaTrash,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";

const Dashboard = () => {
  const router = useRouter();
  const userEmail = useRef(
    typeof window !== "undefined" ? localStorage.getItem("email") : ""
  );
  const userId = useRef(
    typeof window !== "undefined" ? localStorage.getItem("userId") : ""
  );
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [newLocationName, setNewLocationName] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!userId.current) {
      router.push("/");
      return;
    }

    fetch(`/api/location?userId=${userId.current}`)
      .then((response) => response.json())
      .then((data) => setLocations(data))
      .catch((error) => console.error("Error fetching locations:", error))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
    router.push("/");
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/location/${selectedLocation._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationName: newLocationName }),
      });
      if (!res.ok) throw new Error("Failed to update location");

      setLocations((prev) =>
        prev.map((loc) =>
          loc._id === selectedLocation._id
            ? { ...loc, locationName: newLocationName }
            : loc
        )
      );
      setShowUpdateModal(false);
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/location/${selectedLocation._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete location");

      setLocations((prev) =>
        prev.filter((loc) => loc._id !== selectedLocation._id)
      );
      setShowDeleteModal(false);
      setSelectedLocation(null);
    } catch (error) {
      console.error("Error deleting location:", error);
    }
  };

  return (
    <div className="d-flex vh-100">
      <div
        className="bg-dark text-white p-4 d-flex flex-column align-items-center justify-content-between"
        style={{ width: "250px" }}
      >
        <div className="text-center">
          <FaUserCircle size={80} className="mb-3" />
          <p className="mb-2">{userEmail.current}</p>
        </div>
        <Button variant="danger" onClick={handleLogout} className="w-100">
          <FaSignOutAlt /> Logout
        </Button>
      </div>

      <Container className="p-4 flex-grow-1">
        <Row className="mb-4">
          <Col>
            <h1 className="text-primary">Locations List</h1>
            <p className="lead text-muted">Manage your locations below.</p>
          </Col>
        </Row>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status" variant="primary" />
          </div>
        ) : (
          <ListGroup>
            {locations.map((location, index) => (
              <ListGroup.Item
                key={location._id}
                className="mb-3 shadow-sm rounded-3 list-group-item-action"
                onClick={() => router.push(`/map/${location._id}`)}
                style={{
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f8f9fa")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "white")
                }
              >
                <Card>
                  <Card.Body>
                    <Row>
                      <Col md={1}>
                        <Badge bg="light" text="dark">
                          {index + 1}
                        </Badge>
                      </Col>
                      <Col md={7}>
                        <Card.Title>
                          <FaMapMarkedAlt className="me-2" />
                          {location.locationName}
                        </Card.Title>
                      </Col>
                      <Col md={4} className="text-end">
                        <Button
                          variant="success"
                          size="sm"
                          className="me-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLocation(location);
                            setNewLocationName(location.locationName);
                            setShowUpdateModal(true);
                          }}
                        >
                          <FaEdit /> Update
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLocation(location);
                            setShowDeleteModal(true);
                          }}
                        >
                          <FaTrash /> Delete
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Container>
    </div>
  );
};

export default Dashboard;
