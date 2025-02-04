"use client";

import { useEffect, useState } from "react";
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

  // Load session data into state
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");
    const storedUserId = sessionStorage.getItem("userId");

    if (!storedUserId) {
      router.push("/");
      return;
    }

    setUserEmail(storedEmail);
    setUserId(storedUserId);

    fetch(`/api/location?userId=${storedUserId}`)
      .then((response) => response.json())
      .then((data) => {
        setLocations(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching locations:", error);
        setLoading(false);
      });
  }, [router]);

  const handleLogout = () => {
    sessionStorage.clear();
    router.push("/");
  };

  const handleUpdate = () => {
    fetch(`/api/location/${selectedLocation._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locationName: newLocationName }),
    })
      .then((res) => res.json())
      .then(() => {
        setLocations((prev) =>
          prev.map((loc) =>
            loc._id === selectedLocation._id
              ? { ...loc, locationName: newLocationName }
              : loc
          )
        );
        setShowUpdateModal(false);
      });
  };

  const handleDelete = () => {
    fetch(`/api/location/${selectedLocation._id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => {
        setLocations((prev) =>
          prev.filter((loc) => loc._id !== selectedLocation._id)
        );
        setShowDeleteModal(false);
        setSelectedLocation(null);
      });
  };

  const handleClick = (id) => {
    router.push(`/map/${id}`);
  };

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
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

      {/* Main Content */}
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
                onClick={() => handleClick(location._id)}
                style={{ transition: "background-color 0.2s" }}
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
                        <Badge bg="info">{index + 1}</Badge>
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

      {/* Update Location Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
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
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{" "}
          <strong>{selectedLocation?.locationName}</strong>?
        </Modal.Body>
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
