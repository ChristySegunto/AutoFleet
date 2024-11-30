import React, { useRef, useState, useContext, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Card, Modal } from 'react-bootstrap';
import { FaUser, FaPlus } from 'react-icons/fa';
import './Maptracking.css';
import { AuthContext } from './../../settings/AuthContext.js';

function Maptracking() {
    const { adminDetails } = useContext(AuthContext);

    const mapContainerRef = useRef(null);
    const [trips, setTrips] = useState([]);
    const [filteredTrips, setFilteredTrips] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [newTrip, setNewTrip] = useState({
        renter_fname: '',
        renter_lname: '',
        pick_date: '',
        pick_time: '',
        dropoff_date: '',
        dropoff_time: '',
        car_manufacturer: '',
        car_model: '',
        plate_number: '',
    });
    const [showModal, setShowModal] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);

    // Fetch trips on component mount
    useEffect(() => {
        axios.get('http://localhost:5028/api/Trips')
            .then(response => setTrips(response.data))
            .catch(error => console.error("Error fetching trips:", error));
    }, []);

    // Initialize Mapbox
    useEffect(() => {
        mapboxgl.accessToken = 'your-mapbox-access-token';
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [0, 0], // Default center
            zoom: 2,
        });

        return () => map.remove(); // Cleanup map instance on component unmount
    }, []);

    // Filter trips when search query changes
    useEffect(() => {
        setFilteredTrips(
            trips.filter(trip =>
                trip.trip_number.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery, trips]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewTrip(prev => ({ ...prev, [name]: value }));
    };

    const addTrip = () => {
        const tripData = { 
            ...newTrip,
            admin_id: adminDetails?.adminId // You can add admin_id or any other necessary data
        };
    
        axios.post('http://localhost:5028/api/Trip/add', tripData)
            .then(response => {
                alert("Trip added successfully!");
                setTrips(prev => [...prev, response.data]);
                setNewTrip({
                    renter_fname: '',
                    renter_lname: '',
                    pick_date: '',
                    pick_time: '',
                    dropoff_date: '',
                    dropoff_time: '',
                    car_manufacturer: '',
                    car_model: '',
                    plate_number: '',
                });
                setShowModal(false);
            })
            .catch(error => {
                console.error("Error adding trip:", error);
                alert(`Failed to add trip: ${error.response?.data || error.message}`);
            });
    };
    

    return (
        <Container fluid className="Maptracking">
            {/* Header Section */}
            <Row className="align-items-center justify-content-between mb-3">
                <Col xs="auto">
                    <div className="map-header">
                        <h1>MAP TRACKING</h1>
                        <p>Welcome Back, {adminDetails?.fname}</p>
                    </div>
                </Col>
                <Col xs="auto" className="d-flex align-items-center">
                    <Button className="user-button">
                        <FaUser /> {adminDetails?.fname} {adminDetails?.lname}
                    </Button>
                </Col>
            </Row>

            <hr className="divider" />

            {/* Main Content Section */}
            <Row className="main-content">
                <Col md={3}>
                    <Form.Control
                        type="text"
                        placeholder="Search trips..."
                        className="mb-3"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <h1>ONGOING TRIPS</h1>
                    <Button variant="primary" className="mb-3" onClick={() => setShowModal(true)}>
                        <FaPlus className="me-2" /> Add Trip
                    </Button>
                    {(searchQuery ? filteredTrips : trips).map(trip => (
                        <Card key={trip.id} className="trip-card mb-3" onClick={() => setSelectedTrip(trip)}>
                            <Card.Body>
                                <Card.Title>{trip.trip_number}</Card.Title>
                                <p><strong>Pick-up Date:</strong> {trip.pickup_date}</p>
                                <p><strong>Drop-off Date:</strong> {trip.dropoff_time}</p>
                            </Card.Body>
                        </Card>
                    ))}
                </Col>

                <Col md={9}>
                    <div ref={mapContainerRef} style={{ width: '100%', height: '800px' }} />
                    {selectedTrip && (
                        <Card className="selected-trip-card">
                            <Card.Body>
                                <Card.Title>Trip Details</Card.Title>
                                <p><strong>Trip Number:</strong> {selectedTrip.trip_number}</p>
                                <p><strong>Pick-up Date:</strong> {selectedTrip.pickup_date}</p>
                                <p><strong>Drop-off Time:</strong> {selectedTrip.dropoff_time}</p>
                                <p><strong>Car:</strong> {selectedTrip.car_manufacturer}</p>
                                <p><strong>Plate Number:</strong> {selectedTrip.plate_number}</p>
                                <p><strong>Renter:</strong> {selectedTrip.renterFirstName} {selectedTrip.renterLastName}</p>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>

            {/* Add Trip Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Trip</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {/* Form Inputs */}
                        <Form.Group className="mb-3">
                            <Form.Label>Renter First Name</Form.Label>
                            <Form.Control
                                name="renter_fname"
                                value={newTrip.renter_fname}
                                onChange={handleChange}
                                placeholder="Enter Renter First Name"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Renter Last Name</Form.Label>
                            <Form.Control
                                name="renter_lname"
                                value={newTrip.renter_lname}
                                onChange={handleChange}
                                placeholder="Enter Renter Last Name"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Pick-up Date</Form.Label>
                            <Form.Control
                                name="pick_date"
                                type="date"
                                value={newTrip.pick_date}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Pick-up Time</Form.Label>
                            <Form.Control
                                name="pick_time"
                                type="time"
                                value={newTrip.pick_time}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Drop-off Date</Form.Label>
                            <Form.Control
                                name="dropoff_date"
                                type="date"
                                value={newTrip.dropoff_date}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Drop-off Time</Form.Label>
                            <Form.Control
                                name="dropoff_time"
                                type="time"
                                value={newTrip.dropoff_time}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Car Manufacturer</Form.Label>
                            <Form.Control
                                name="car_manufacturer"
                                value={newTrip.car_manufacturer}
                                onChange={handleChange}
                                placeholder="Enter Car Manufacturer"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Car Model</Form.Label>
                            <Form.Control
                                name="car_model"
                                value={newTrip.car_model}
                                onChange={handleChange}
                                placeholder="Enter Car Model"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Plate Number</Form.Label>
                            <Form.Control
                                name="plate_number"
                                value={newTrip.plate_number}
                                onChange={handleChange}
                                placeholder="Enter Plate Number"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={addTrip}>
                        Add Trip
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Maptracking;
