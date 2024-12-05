import React, { useRef, useState, useContext, useEffect } from 'react';
import mapboxgl from 'mapbox-gl'; // Mapbox library for maps
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl'; // Components for React integration with Mapbox

import axios from 'axios'; // Library for making HTTP requests
import { Form, Button, Container, Row, Col, Card, Modal } from 'react-bootstrap'; // Bootstrap components for UI
import { FaUser, FaPlus } from 'react-icons/fa'; // Icons for UI
import './Maptracking.css'; // Custom CSS for styling
import { AuthContext } from '../../settings/AuthContext.js'; // Context for authentication details
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS
import 'mapbox-gl/dist/mapbox-gl.css'; // Mapbox CSS
import { Navigate } from 'react-router-dom'; // Router for navigation

function Maptracking() {
    // Access admin details from AuthContext
    const { adminDetails } = useContext(AuthContext);

    // State for search input
    const [searchQuery, setSearchQuery] = useState('');

    // Modal visibility state for adding a rental
    const [showModal, setShowModal] = useState(false);

    // State for the list of rented vehicles
    const [rentedVehicles, setRentedVehicles] = useState([]);

    // State for the currently selected vehicle
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    // State for trip summary data
    const [tripSummary, setTripSummary] = useState(null);

    // State for the list of renters
    const [renterList, setRenterList] = useState([]);

    // State for the currently selected renter
    const [selectedRenter, setSelectedRenter] = useState(null);

    // State for the list of available vehicles
    const [vehicleList, setVehicleList] = useState([]);

    // State for pickup and dropoff date and time inputs
    const [pickupDate, setPickupDate] = useState("");
    const [pickupTime, setPickupTime] = useState("");
    const [dropoffDate, setDropoffDate] = useState("");
    const [dropoffTime, setDropoffTime] = useState("");

    // State to track whether an alert has already been shown
    const [alertShown, setAlertShown] = useState(false);

    // Map configuration state
    const [viewState, setViewState] = useState({
        longitude: 120.962852,
        latitude: 14.619343,
        zoom: 12
    });

    // State for marker position on the map
    const [markerPosition, setMarkerPosition] = useState(null);

    // Popup visibility state
    const [showPopup, setShowPopup] = useState(false);

    // Fetch rented vehicles from the backend on component load
    useEffect(() => {
        axios.get('http://localhost:5028/api/RentedVehicle')
            .then((response) => {
                const sortedVehicles = sortVehicles(response.data); // Sort vehicles by status
                setRentedVehicles(sortedVehicles);
            })
            .catch((error) => {
                console.error('Error fetching rented vehicles:', error);
                alert(`Failed to fetch data: ${error.response?.data || error.message}`);
            });
    }, []);

    // Utility function to reset map view to default
    const resetMap = () => {
        setViewState({
            longitude: 120.962852,
            latitude: 14.619343,
            zoom: 18,
            transitionDuration: 1000
        });
        setMarkerPosition(null);
    };

    // Sort vehicles by rental status
    const sortVehicles = (vehicles) => {
        const statusOrder = { "Ongoing": 1, "Upcoming": 2, "Completed": 3 };
        return vehicles.sort((a, b) => statusOrder[a.rent_status] - statusOrder[b.rent_status]);
    };

    // Handle card click to display rental details and fetch location data
    const handleCardClick = (vehicle) => {
        setSelectedVehicle(vehicle);

        // Handle based on the rental status
        if (vehicle.rent_status === "Upcoming") {
            alert("The renter has not yet started the trip.");
            resetMap();
        } else if (vehicle.rent_status === "Completed") {
            alert("Trip Completed");
            fetchTripSummary(vehicle.rented_vehicle_id);
            resetMap();
        } else if (vehicle.rent_status === "Ongoing") {
            fetchRealTimeCarLocation(vehicle.rented_vehicle_id);
        }
    };

    // Fetch real-time car location
    const fetchRealTimeCarLocation = (rentedVehiclesId) => {
        axios.get(`http://localhost:5028/api/Location/realtime/${rentedVehiclesId}`)
            .then((response) => {
                const carUpdate = response.data;

                if (!carUpdate) {
                    if (!alertShown) {
                        alert("The renter has not yet started the trip.");
                        setAlertShown(true);
                    }
                    resetMap();
                    return;
                }

                // Update marker position and map view
                setMarkerPosition(carUpdate);
                setViewState({
                    longitude: carUpdate.locationLongitude,
                    latitude: carUpdate.locationLatitude,
                    zoom: 15,
                    transitionDuration: 1000
                });
                setShowPopup(true);
            })
            .catch((error) => {
                console.error('Error fetching real-time car location:', error);
                resetMap();
            });
    };

    // Fetch trip summary for completed rentals
    const fetchTripSummary = (rentedVehiclesId) => {
        axios.get(`http://localhost:5028/api/Location/trip-summary/${rentedVehiclesId}`)
            .then((response) => {
                setTripSummary(response.data);
            })
            .catch((error) => console.error('Error fetching trip summary:', error));
    };

    // Poll for real-time updates for ongoing rentals
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (selectedVehicle?.rent_status === "Ongoing") {
                fetchRealTimeCarLocation(selectedVehicle.rented_vehicle_id);
            }
        }, 2000); // Fetch data every 2 seconds

        return () => clearInterval(intervalId); // Clean up on unmount
    }, [selectedVehicle]);

    // Fetch renter and vehicle lists on component load
    useEffect(() => {
        axios.get("http://localhost:5028/api/Renter/list")
            .then((response) => setRenterList(response.data))
            .catch((error) => console.error("Error fetching renters:", error));

        axios.get("http://localhost:5028/api/Vehicle/list")
            .then((response) => setVehicleList(response.data))
            .catch((error) => console.error("Error fetching vehicles:", error));
    }, []);

    // Handle form submission to save a new trip
    const handleSaveTrip = () => {
        if (!selectedRenter || !selectedVehicle || !pickupDate || !pickupTime || !dropoffDate || !dropoffTime) {
            alert("Please complete all fields before saving the trip.");
            return;
        }

        const tripData = {
            renter_id: selectedRenter.renter_id,
            vehicle_id: selectedVehicle.vehicle_id,
            pickup_date: pickupDate,
            pickup_time: pickupTime,
            dropoff_date: dropoffDate,
            dropoff_time: dropoffTime,
            rent_status: "Upcoming"
        };

        axios.post("http://localhost:5028/api/RentedVehicle/add", tripData)
            .then(() => {
                alert("Trip saved successfully!");
                setShowModal(false);
                axios.get('http://localhost:5028/api/RentedVehicle')
                    .then((response) => setRentedVehicles(sortVehicles(response.data)))
                    .catch((error) => console.error('Error fetching rented vehicles:', error));
            })
            .catch((error) => {
                console.error("Error saving trip:", error);
                alert(`Failed to save the trip. Error: ${error.response?.data || error.message}`);
            });
    };

    return (
        <Container fluid className="Maptracking">
            {/* Header section */}
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

            {/* Main content section */}
            <Row className="main-content">
                {/* Sidebar with vehicle list and search */}
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
                    <div className="scrollable-container">
                        {rentedVehicles
                            .filter((vehicle) =>
                                (vehicle.renter_fname + ' ' + vehicle.renter_lname)
                                    .toLowerCase()
                                    .includes(searchQuery.toLowerCase())
                            )
                            .map((vehicle) => (
                                <Card key={vehicle.rented_vehicle_id} className="mb-3" onClick={() => handleCardClick(vehicle)}>
                                    <Card.Body>
                                        <Card.Title>{vehicle.renter_fname} {vehicle.renter_lname}</Card.Title>
                                        <Card.Text>Status: {vehicle.rent_status}</Card.Text>
                                    </Card.Body>
                                </Card>
                            ))}
                    </div>
                </Col>

                {/* Map view */}
                <Col md={9}>
                    <Map
                        {...viewState}
                        onMove={(e) => setViewState(e.viewState)}
                        mapStyle="mapbox://styles/mapbox/streets-v11"
                        mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
                        style={{ width: '100%', height: '600px' }}
                    >
                        {markerPosition && (
                            <Marker
                                longitude={markerPosition.locationLongitude}
                                latitude={markerPosition.locationLatitude}
                            >
                                <div className="marker"></div>
                            </Marker>
                        )}
                        {showPopup && markerPosition && (
                            <Popup
                                longitude={markerPosition.locationLongitude}
                                latitude={markerPosition.locationLatitude}
                                closeOnClick={false}
                                onClose={() => setShowPopup(false)}
                            >
                                <div>
                                    <p>{selectedVehicle.renter_fname} {selectedVehicle.renter_lname}</p>
                                    <p>Ongoing Trip</p>
                                </div>
                            </Popup>
                        )}
                        <NavigationControl />
                    </Map>
                </Col>
            </Row>

            {/* Modal for adding rental */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add a New Rental</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="renter">
                        <Form.Label>Renter</Form.Label>
                        <Form.Control
                            as="select"
                            value={selectedRenter?.renter_id || ""}
                            onChange={(e) =>
                                setSelectedRenter(renterList.find(r => r.renter_id === parseInt(e.target.value)))
                            }
                        >
                            <option value="">Select a renter</option>
                            {renterList.map((renter) => (
                                <option key={renter.renter_id} value={renter.renter_id}>
                                    {renter.renter_fname} {renter.renter_lname}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="vehicle">
                        <Form.Label>Vehicle</Form.Label>
                        <Form.Control
                            as="select"
                            value={selectedVehicle?.vehicle_id || ""}
                            onChange={(e) =>
                                setSelectedVehicle(vehicleList.find(v => v.vehicle_id === parseInt(e.target.value)))
                            }
                        >
                            <option value="">Select a vehicle</option>
                            {vehicleList.map((vehicle) => (
                                <option key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
                                    {vehicle.vehicle_brand} {vehicle.vehicle_model}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="pickupDate">
                        <Form.Label>Pickup Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={pickupDate}
                            onChange={(e) => setPickupDate(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="pickupTime">
                        <Form.Label>Pickup Time</Form.Label>
                        <Form.Control
                            type="time"
                            value={pickupTime}
                            onChange={(e) => setPickupTime(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="dropoffDate">
                        <Form.Label>Dropoff Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={dropoffDate}
                            onChange={(e) => setDropoffDate(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="dropoffTime">
                        <Form.Label>Dropoff Time</Form.Label>
                        <Form.Control
                            type="time"
                            value={dropoffTime}
                            onChange={(e) => setDropoffTime(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveTrip}>
                        Save Trip
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Maptracking;
