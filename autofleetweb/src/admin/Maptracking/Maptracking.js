import React, { useEffect, useRef, useState, useContext } from 'react';
import mapboxgl from 'mapbox-gl';
import { Form, Button, Container, Row, Col, Card, Modal } from 'react-bootstrap';
import { FaBell, FaSearch, FaUserCircle, FaPlus, FaUser } from 'react-icons/fa';
import { database } from './firebase';
import { ref, push, onValue } from 'firebase/database';
import './Maptracking.css';
import { AuthContext } from './../../settings/AuthContext.js';

function Maptracking() {
    const { user, adminDetails, setAdminDetails } = useContext(AuthContext); // Access user and setAdminDetails from context

    const username = "User";
    const mapContainerRef = useRef(null);
    const [trips, setTrips] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newTrip, setNewTrip] = useState({
        shippingNumber: '',
        source: '',
        destination: '',
        totalDistance: '',
        fuelConsumption: '',
        renterName: '',
        rentStartDate: '',
        rentEndDate: ''
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredTrips, setFilteredTrips] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState(null);

    // Filter trips based on the search query
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredTrips(trips);
        } else {
            const lowerCaseQuery = searchQuery.toLowerCase();
            const filtered = trips.filter(trip =>
                trip.shippingNumber.toLowerCase().includes(lowerCaseQuery) ||
                trip.source.toLowerCase().includes(lowerCaseQuery) ||
                trip.destination.toLowerCase().includes(lowerCaseQuery)
            );
            setFilteredTrips(filtered);
        }
    }, [searchQuery, trips]);

    // Fetch trips from Firebase
    useEffect(() => {
        const tripsRef = ref(database, 'trips');
        onValue(tripsRef, (snapshot) => {
            const data = snapshot.val();
            const tripsArray = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
            setTrips(tripsArray);
        });
    }, []);

    // Initialize Mapbox
    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1Ijoicm9jaGVsbGVib3JyIiwiYSI6ImNtM29rejZnazA0Z3Mya3NkZ2g4YXd5cnIifQ.4Pso-euXHqkZMUmz7Dpegw';

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/navigation-night-v1',
            center: [121.11472431559307, 14.648879098920109],
            zoom: 15,
        });

        map.addControl(new mapboxgl.NavigationControl(), 'top-right');

        return () => map.remove();
    }, []);

    // Handle Modal Inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewTrip(prev => ({ ...prev, [name]: value }));
    };

    // Save new trip to Firebase
    const addTrip = () => {
        const tripsRef = ref(database, 'trips');
        push(tripsRef, newTrip);
        setNewTrip({
            shippingNumber: '',
            source: '',
            destination: '',
            totalDistance: '',
            fuelConsumption: '',
            renterName: '',
            rentStartDate: '',
            rentEndDate: ''
        });
        setShowModal(false);
    };

    // Handle clicking a trip card
    const handleCardClick = (trip) => {
        setSelectedTrip(trip); // Set the selected trip to show detailed info
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
                <div className='header-button'>
                    <Button className='user-button'>
                        <div className='user-icon'><FaUser /></div> 
                        {adminDetails?.fname} {adminDetails?.lname }
                    </Button>
                </div>
                </Col>
            </Row>

            <hr className="divider" />

            {/* Main Content Section */}
            <Row className="main-content">
                <Col md={3} className="search-box">
                    {/* Search Bar */}
                    <Form.Group controlId="searchTrips">
                        <Form.Control
                            type="text"
                            placeholder="Search trips..."
                            className="mb-3"
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </Form.Group>

                    <h1>ONGOING TRIPS</h1>
                    <Button
                        variant="primary"
                        className="mb-3"
                        onClick={() => setShowModal(true)}
                    >
                        <FaPlus className="me-2" /> Add Trip
                    </Button>
                    {filteredTrips.map(trip => (
                        <Card key={trip.id} className="trip-card mb-3" onClick={() => handleCardClick(trip)}>
                            <Card.Body>
                                <Card.Title>Trip Number</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{trip.shippingNumber}</Card.Subtitle>
                                <div className="location-info">
                                    <p><i className="fas fa-map-marker-alt"></i> {trip.source}</p>
                                    <p><i className="fas fa-map-marker-alt"></i> {trip.destination}</p>
                                </div>
                                <div className="trip-details">
                                    <p><strong>Total Distance:</strong> {trip.totalDistance} km</p>
                                    <p><strong>Fuel Consumption:</strong> {trip.fuelConsumption} liters</p>
                                    <p><strong>Renter:</strong> {trip.renterName}</p>
                                    <p><strong>Rent Period:</strong> {trip.rentStartDate} to {trip.rentEndDate}</p>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </Col>

                <Col md={9} className="map-display">
                    <div
                        ref={mapContainerRef}
                        style={{ width: '100%', height: '800px' }}
                        className="map-container"
                    ></div>

                    
                    {selectedTrip && (
                        <div className="selected-trip-overlay">
                            <Card className="selected-trip-card mb-3">
                                <Card.Body>
                                    <Card.Title className='card-title'>Trip Details</Card.Title>
                                    <Card.Subtitle className="card-subtitle">{selectedTrip.shippingNumber}</Card.Subtitle>
                                    <div className="location-info">
                                        <p><i className="fas fa-map-marker-alt"></i> {selectedTrip.source}</p>
                                        <p><i className="fas fa-map-marker-alt"></i> {selectedTrip.destination}</p>
                                    </div>
                                    <hr className="divider" />
                                    <div className="trip-details">
                                        <p><strong>Total Distance:</strong> {selectedTrip.totalDistance} km</p>
                                        <p><strong>Fuel Consumption:</strong> {selectedTrip.fuelConsumption} liters</p>
                                        <p><strong>Renter:</strong> {selectedTrip.renterName}</p>
                                        <p><strong>Rent Period:</strong> {selectedTrip.rentStartDate} to {selectedTrip.rentEndDate}</p>
                                    </div>
                                    
                                </Card.Body>
                            </Card>
                        </div>
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
                        <Form.Group>
                            <Form.Label>Trip Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="shippingNumber"
                                value={newTrip.shippingNumber}
                                onChange={handleChange}
                                placeholder="Enter trip number"
                            />
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Source</Form.Label>
                            <Form.Control
                                type="text"
                                name="source"
                                value={newTrip.source}
                                onChange={handleChange}
                                placeholder="Enter source location"
                            />
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Destination</Form.Label>
                            <Form.Control
                                type="text"
                                name="destination"
                                value={newTrip.destination}
                                onChange={handleChange}
                                placeholder="Enter destination location"
                            />
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Total Distance</Form.Label>
                            <Form.Control
                                type="number"
                                name="totalDistance"
                                value={newTrip.totalDistance}
                                onChange={handleChange}
                                placeholder="Enter total distance (in km)"
                            />
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Fuel Consumption</Form.Label>
                            <Form.Control
                                type="number"
                                name="fuelConsumption"
                                value={newTrip.fuelConsumption}
                                onChange={handleChange}
                                placeholder="Enter fuel consumption (in liters)"
                            />
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Renter Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="renterName"
                                value={newTrip.renterName}
                                onChange={handleChange}
                                placeholder="Enter renter's name"
                            />
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Rent Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="rentStartDate"
                                value={newTrip.rentStartDate}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Rent End Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="rentEndDate"
                                value={newTrip.rentEndDate}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={addTrip}>
                        Save Trip
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Maptracking;
