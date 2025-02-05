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
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [newLocationName, setNewLocationName] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserEmail(localStorage.getItem("email") || "");
      setUserId(localStorage.getItem("userId") || "");
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/location?userId=${userId}`)
      .then((response) => response.json())
      .then((data) => setLocations(data))
      .catch((error) => console.error("Error fetching locations:", error))
      .finally(() => setLoading(false));
  }, [userId]);

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
          <p className="mb-2">{userEmail}</p>
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
        ) : locations.length === 0 ? (
          <p className="text-center text-muted">No locations available.</p>
        ) : (
          <ListGroup>
            {locations.map((location) => (
              <ListGroup.Item
                key={location._id}
                className="mb-3 shadow-sm rounded-3 list-group-item-action"
              >
                <Card>
                  <Card.Body>
                    <Row>
                      <Col md={8}>
                        <Card.Title>
                          <FaMapMarkedAlt className="me-2" />{" "}
                          {location.locationName}
                        </Card.Title>
                      </Col>
                      <Col md={4} className="text-end">
                        <Button
                          variant="warning"
                          className="me-2"
                          onClick={() => {
                            setSelectedLocation(location);
                            setNewLocationName(location.locationName);
                            setShowUpdateModal(true);
                          }}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => {
                            setSelectedLocation(location);
                            setShowDeleteModal(true);
                          }}
                        >
                          <FaTrash />
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

      {/* Update Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>New Location Name</Form.Label>
              <Form.Control
                type="text"
                value={newLocationName}
                onChange={(e) => setNewLocationName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this location?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Dashboard;
