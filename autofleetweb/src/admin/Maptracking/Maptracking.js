import React, { useRef, useState, useContext, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Card, Modal } from 'react-bootstrap';
import { FaUser, FaPlus } from 'react-icons/fa';
import './Maptracking.css';
import { AuthContext } from '../../settings/AuthContext.js';

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
    const mapInstanceRef = useRef(null);

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

        // Initialize the Mapbox map
        mapboxgl.accessToken = 'pk.eyJ1Ijoicm9jaGVsbGVib3JyIiwiYSI6ImNtM29rejZnazA0Z3Mya3NkZ2g4YXd5cnIifQ.4Pso-euXHqkZMUmz7Dpegw'; // Replace with your Mapbox access token
        const map = new mapboxgl.Map({
            container: mapContainerRef.current, // Reference to the container element
            style: 'mapbox://styles/mapbox/streets-v11', // Map style
            center: [120.9842, 14.5995], // New center [longitude, latitude] for Manila, Philippines
            zoom: 12, // Adjust zoom level to better fit the region
        });
        
        // Fetch car data from API
        axios.get('http://localhost:5028/api/CarUpdate') // Replace with your API endpoint
            .then((response) => {
                const cars = response.data; // Ensure your API returns an array of car objects
                cars.forEach(car => {
                    if (car.location_longitude && car.location_latitude) {
                        new mapboxgl.Marker()
                            .setLngLat([car.location_longitude, car.location_latitude]) // Set pin location
                            .setPopup(
                                new mapboxgl.Popup({ offset: 25 }).setText(
                                    `Car ID: ${car.carupdate_id}`
                                ) // Optional popup with Car ID
                            )
                            .addTo(map); // Add pin to map
                    }
                });
            })
            .catch((error) => {
                console.error('Error fetching car data:', error);
                alert('Failed to fetch car locations');
            });
        
        // Add navigation controls (zoom, rotation, etc.)
        map.addControl(new mapboxgl.NavigationControl());
        
        // Cleanup map on component unmount
        return () => {
            if (map) {
                map.remove();
            }
        };
        

    }, []);  // Empty dependency array ensures this effect runs once when the component mounts

    // Add a new rented vehicle
    const addRentedVehicle = () => {
        const rentedVehicleData = {
            renter_fname: newRentedVehicle.renter_fname,
            renter_lname: newRentedVehicle.renter_lname,
            pickup_date: new Date(newRentedVehicle.pickup_date).toISOString(),
            pickup_time: newRentedVehicle.pickup_time,
            dropoff_date: new Date(newRentedVehicle.dropoff_date).toISOString(),
            dropoff_time: newRentedVehicle.dropoff_time,
            car_manufacturer: newRentedVehicle.car_manufacturer,
            car_model: newRentedVehicle.car_model,
            plate_number: newRentedVehicle.plate_number,
<<<<<<< Updated upstream
            rent_status: "Pending",
            renter_id: renterIdCounter,
            vehicle_id: 1, // Replace with actual vehicle ID if needed
=======
            rent_status: "Pending", 
            renter_id: renterIdCounter,
            vehicle_id: 1, 
>>>>>>> Stashed changes
        };
    
        // Log the request body to the console to inspect its structure
        console.log('Request Body:', rentedVehicleData);
    
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
                setRenterIdCounter((prevId) => prevId + 1);
            })
            .catch((error) => {
<<<<<<< Updated upstream
                // Log error details for debugging
                console.error('Error adding rented vehicle:', error.response?.data || error.message);
                console.log('Error response:', error.response);  // Log the full error response
=======
                console.error('Error adding rented vehicle:', error.response?.data || error.message);
>>>>>>> Stashed changes
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
            {/* Header and main content sections */}
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
                    {/* Map Container */}
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
                        <Form.Group className="mb-3">
                            <Form.Label>Renter First Name</Form.Label>
                            <Form.Control
                                name="renter_fname"
                                value={newRentedVehicle.renter_fname}
                                onChange={handleInputChange}
                                placeholder="Enter first name"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Renter Last Name</Form.Label>
                            <Form.Control
                                name="renter_lname"
                                value={newRentedVehicle.renter_lname}
                                onChange={handleInputChange}
                                placeholder="Enter last name"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Pick-up Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="pickup_date"
                                value={newRentedVehicle.pickup_date}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Pick-up Time</Form.Label>
                            <Form.Control
                                type="time"
                                name="pickup_time"
                                value={newRentedVehicle.pickup_time}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Drop-off Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="dropoff_date"
                                value={newRentedVehicle.dropoff_date}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Drop-off Time</Form.Label>
                            <Form.Control
                                type="time"
                                name="dropoff_time"
                                value={newRentedVehicle.dropoff_time}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Car Manufacturer</Form.Label>
                            <Form.Control
                                name="car_manufacturer"
                                value={newRentedVehicle.car_manufacturer}
                                onChange={handleInputChange}
                                placeholder="Enter car manufacturer"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Car Model</Form.Label>
                            <Form.Control
                                name="car_model"
                                value={newRentedVehicle.car_model}
                                onChange={handleInputChange}
                                placeholder="Enter car model"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Plate Number</Form.Label>
                            <Form.Control
                                name="plate_number"
                                value={newRentedVehicle.plate_number}
                                onChange={handleInputChange}
                                placeholder="Enter plate number"
                            />
                        </Form.Group>
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
