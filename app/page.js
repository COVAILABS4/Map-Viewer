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
} from "react-bootstrap"; // Import Bootstrap components
import { FaMapMarkedAlt } from "react-icons/fa"; // Import FontAwesome for an icon

const Home = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading
  const router = useRouter();

  useEffect(() => {
    // Fetch the list of locations from the API
    fetch("/api/get-data")
      .then((response) => response.json())
      .then((data) => {
        setLocations(data);
        setLoading(false); // Stop loading once data is fetched
      })
      .catch((error) => {
        console.error("Error fetching locations:", error);
        setLoading(false); // Stop loading if there is an error
      });
  }, []);

  const handleClick = (id) => {
    // Redirect to the Map page with the selected location id
    router.push(`/map/${id}`);
  };

  return (
    <Container fluid className="p-4">
      <Row className="mb-4">
        <Col md={12} className="text-center">
          <h1>Locations List</h1>
          <p className="lead text-muted">
            Click on a location to see it on the map.
          </p>
        </Col>
      </Row>

      {loading ? (
        <Row className="justify-content-center">
          <Col xs="auto">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col md={12}>
            <ListGroup>
              {locations.map((location, index) => (
                <ListGroup.Item key={location._id} className="mb-3">
                  <Card className="shadow-sm" style={{ cursor: "pointer" }}>
                    <Card.Body onClick={() => handleClick(location._id)}>
                      <Row>
                        <Col md={1} className="d-flex align-items-center">
                          <Badge pill bg="info">
                            {index + 1} {/* Serial Number */}
                          </Badge>
                        </Col>
                        <Col md={10}>
                          <Card.Title>
                            <FaMapMarkedAlt className="me-2" />
                            {location.name}
                          </Card.Title>
                          <Card.Text className="text-muted">
                            Click to view on the map
                          </Card.Text>
                        </Col>
                        <Col
                          md={1}
                          className="d-flex justify-content-end align-items-center"
                        >
                          <Button variant="primary" size="sm">
                            View
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Home;
