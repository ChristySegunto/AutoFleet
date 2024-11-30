import React, { useRef, useState, useContext, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Card, Modal } from 'react-bootstrap';
import { FaUser, FaPlus } from 'react-icons/fa';
import './Maptracking.css';
import { AuthContext } from './../../settings/AuthContext.js';

function Maptracking() {
    const { adminDetails } = useContext(AuthContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [rentedVehicles, setRentedVehicles] = useState([]);
    const [newRentedVehicle, setNewRentedVehicle] = useState({
        renter_fname: '',
        renter_lname: '',
        pickup_date: '',
        pickup_time: '',
        dropoff_date: '',
        dropoff_time: '',
        car_manufacturer: '',
        car_model: '',
        plate_number: '',
    });

    const [renterIdCounter, setRenterIdCounter] = useState(3); // Start renter_id from 3

    const mapContainerRef = useRef(null);

    // Fetch all rented vehicles from the backend
    useEffect(() => {
        axios.get('http://localhost:5028/api/RentedVehicle')
            .then((response) => {
                setRentedVehicles(response.data);
            })
            .catch((error) => {
                console.error('Error fetching rented vehicles:', error);
                alert(`Failed to fetch data: ${error.response?.data || error.message}`);
            });
    }, []);

    // Add a new rented vehicle
    const addRentedVehicle = () => {
        const rentedVehicleData = {
            renter_fname: newRentedVehicle.renter_fname,
            renter_lname: newRentedVehicle.renter_lname,
            pickup_loc: "Default Pickup Location", // Update as needed
            pickup_date: newRentedVehicle.pickup_date,
            pickup_time: newRentedVehicle.pickup_time,
            dropoff_loc: "Default Drop-off Location", // Update as needed
            dropoff_date: newRentedVehicle.dropoff_date,
            dropoff_time: newRentedVehicle.dropoff_time,
            car_manufacturer: newRentedVehicle.car_manufacturer,
            car_model: newRentedVehicle.car_model,
            plate_number: newRentedVehicle.plate_number,
            rent_status: "Pending", // Default status
            renter_id: renterIdCounter, // Use the current renter_id counter
            vehicle_id: 1, // Replace with actual vehicle ID
        };

        axios.post('http://localhost:5028/api/RentedVehicle/add', rentedVehicleData)
            .then((response) => {
                alert("Rented vehicle added successfully!");
                setRentedVehicles((prev) => [...prev, response.data]);
                setNewRentedVehicle({
                    renter_fname: '',
                    renter_lname: '',
                    pickup_date: '',
                    pickup_time: '',
                    dropoff_date: '',
                    dropoff_time: '',
                    car_manufacturer: '',
                    car_model: '',
                    plate_number: '',
                });
                setShowModal(false);
                setRenterIdCounter((prevId) => prevId + 1); // Increment renter_id after adding a new vehicle
            })
            .catch((error) => {
                console.error('Error adding rented vehicle:', error);
                alert(`Failed to add data: ${error.response?.data || error.message}`);
            });
    };

    // Handle input changes in the form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRentedVehicle((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handle card click to display details of a specific rented vehicle
    const handleCardClick = (vehicle) => {
        setSelectedVehicle(vehicle);
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
                        placeholder="Search rented vehicles..."
                        className="mb-3"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <h1>ONGOING RENTALS</h1>
                    <Button variant="primary" className="mb-3" onClick={() => setShowModal(true)}>
                        <FaPlus className="me-2" /> Add Rental
                    </Button>

                    {rentedVehicles
                        .filter((vehicle) =>
                            vehicle.renter_fname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            vehicle.renter_lname.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((vehicle) => (
                            <Card key={vehicle.rented_vehicle_id} className="vehicle-card mb-3" onClick={() => handleCardClick(vehicle)}>
                                <Card.Body>
                                    <Card.Title>{vehicle.rented_vehicle_id}</Card.Title>
                                    <p><strong>Pick-up Date:</strong> {vehicle.pickup_date}</p>
                                    <p><strong>Drop-off Date:</strong> {vehicle.dropoff_date}</p>
                                </Card.Body>
                            </Card>
                        ))}
                </Col>

                <Col md={9}>
                    <div ref={mapContainerRef} style={{ width: '100%', height: '800px' }} />
                    {selectedVehicle && (
                        <Card className="selected-vehicle-card">
                            <Card.Body>
                                <Card.Title>Rental Details</Card.Title>
                                <p><strong>Rental ID:</strong> {selectedVehicle.rented_vehicle_id}</p>
                                <p><strong>Pick-up Date:</strong> {selectedVehicle.pickup_date}</p>
                                <p><strong>Drop-off Time:</strong> {selectedVehicle.dropoff_time}</p>
                                <p><strong>Car:</strong> {selectedVehicle.car_manufacturer} {selectedVehicle.car_model}</p>
                                <p><strong>Plate Number:</strong> {selectedVehicle.plate_number}</p>
                                <p><strong>Renter:</strong> {selectedVehicle.renter_fname} {selectedVehicle.renter_lname}</p>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>

            {/* Add Rental Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Rental</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {/* Form Inputs */}
                        {Object.keys(newRentedVehicle).map((field) => (
                            <Form.Group className="mb-3" key={field}>
                                <Form.Label>{field.replace('_', ' ')}</Form.Label>
                                <Form.Control
                                    name={field}
                                    value={newRentedVehicle[field]}
                                    onChange={handleInputChange}
                                    placeholder={`Enter ${field.replace('_', ' ')}`}
                                />
                            </Form.Group>
                        ))}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={addRentedVehicle}>
                        Add Rental
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Maptracking;
