"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Spinner,
  Container,
  Row,
  Col,
  ListGroup,
  Card,
  Badge,
} from "react-bootstrap";
import { FaMapMarkedAlt } from "react-icons/fa";

const Dashboard = () => {
  const router = useRouter();

  const { user_id } = useParams();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/location?userId=${user_id}`)
      .then((response) => response.json())
      .then((data) => setLocations(data))
      .catch((error) => console.error("Error fetching locations:", error))
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <div className="d-flex vh-100">
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
                onClick={() => router.push(`${user_id}/${location._id}/`)}
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
