import React, { useRef, useState, useContext, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl';

import axios from 'axios';
import { Form, Button, Container, Row, Col, Card, Modal } from 'react-bootstrap';
import { FaUser, FaPlus } from 'react-icons/fa';
import './Maptracking.css';
import { AuthContext } from '../../settings/AuthContext.js';
import "bootstrap/dist/css/bootstrap.min.css";
import 'mapbox-gl/dist/mapbox-gl.css';
import { Navigate } from 'react-router-dom';


function Maptracking() {
    const { adminDetails } = useContext(AuthContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [rentedVehicles, setRentedVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const mapContainerRef = useRef(null);
    const [tripSummary, setTripSummary] = useState(null); // Add state for trip summary

    
   // const mapInstanceRef = useRef(null);
    const [renterList, setRenterList] = useState([]);
    const [selectedRenter, setSelectedRenter] = useState(null);
  
    const [vehicleList, setVehicleList] = useState([]); 
    const [pickupDate, setPickupDate] = useState("");
    const [pickupTime, setPickupTime] = useState("");
    const [dropoffDate, setDropoffDate] = useState("");
    const [dropoffTime, setDropoffTime] = useState("");
    const [alertShown, setAlertShown] = useState(false); // Track if the alert has been shown


    const mapRef = useRef(null); // Reference for the map instance
    const markerRef = useRef(null); // Reference for the marker to update location
    const [showPopup, setShowPopup] = useState(false);

    // Viewport state for react-map-gl
    const [viewState, setViewState] = useState({
        longitude: 120.962852,
        latitude: 14.619343,
        zoom: 12
    });

    // State for current marker position
    const [markerPosition, setMarkerPosition] = useState(null);
  
    const sortVehicles = (vehicles) => {
      const statusOrder = {
        "Ongoing": 1,
        "Upcoming": 2,
        "Completed": 3
      };
    
      return vehicles.sort((a, b) => statusOrder[a.rent_status] - statusOrder[b.rent_status]);
    };
    
    // Fetch all rented vehicles from the backend
    useEffect(() => {
        axios.get('http://localhost:5028/api/RentedVehicle')
            .then((response) => {
                console.log('Fetched rented vehicles:', response.data);
                const sortedVehicles = sortVehicles(response.data); // Sort the vehicles here
                setRentedVehicles(sortedVehicles);
                console.log('Set rented vehicles:', sortedVehicles);
            })
            .catch((error) => {
                console.error('Error fetching rented vehicles:', error);
                alert(`Failed to fetch data: ${error.response?.data || error.message}`);
            });

    }, []); 


    const resetMap = () => {
        setViewState({
            longitude: 120.962852,
            latitude: 14.619343,
            zoom: 18,
            transitionDuration: 1000,  // Optional: adds a smooth transition effect
        });
        setMarkerPosition(null);
    };



    // Handle card click to display details of a specific rented vehicle
    const handleCardClick = (vehicle) => {
      if (!vehicle) {
        console.error("Invalid vehicle object");
        return; // Exit early if vehicle is null or undefined
      }
    
      setSelectedVehicle(vehicle);
    
      const rentedVehicleId = vehicle.rented_vehicle_id; // Access the rented_vehicle_id safely
      if (!rentedVehicleId) {
        console.error("Invalid rented_vehicle_id");
        return; // Exit early if rented_vehicle_id is missing
      }
    
      // Check the rent status before proceeding
      if (vehicle.rent_status === "Upcoming") {
        alert("The renter has not yet started the trip.");
        resetMap(); // Reset the map since the trip hasn't started yet
      }

      if (vehicle.rent_status === "Completed") {
        alert("Trip Completed");
        fetchTripSummary(rentedVehicleId);
        resetMap(); // Reset map, no real-time tracking is needed for completed trips
      }

      if (vehicle.rent_status === "Ongoing") {
        fetchRealTimeCarLocation(rentedVehicleId);
      }

    };


    // Fetch real-time car location data
    const fetchRealTimeCarLocation = (rentedVehiclesId) => {
        axios.get(`http://localhost:5028/api/Location/realtime/${rentedVehiclesId}`)
            .then((response) => {
                const carUpdate = response.data;
                const { locationLatitude, locationLongitude, speed, totalFuelConsumption, totalDistanceTravelled, rent_status } = carUpdate;
                
                // Check if there's no carUpdate
                if (!carUpdate) {
                    if (!alertShown) { // Show alert only if not already shown
                        alert("The renter has not yet started the trip.");
                        setAlertShown(true); // Set flag to true after showing the alert
                    }
                    resetMap(); // Reset the map if there's no car update
                    return;
                }
                // Update marker position
                setMarkerPosition({
                    longitude: locationLongitude,
                    latitude: locationLatitude,
                    speed,
                    totalFuelConsumption,
                    totalDistanceTravelled
                });

                // Update viewport to center on the marker
                setViewState({
                    longitude: locationLongitude,
                    latitude: locationLatitude,
                    zoom: 15,
                    transitionDuration: 1000
                });

                setShowPopup(true);
            })
            .catch((error) => {
                if (error.response && error.response.status === 404) {
                  if (error.response && error.response.status === 404) {
                      resetMap();
                  } else {
                      console.error('Error fetching real-time car location:', error);
                  }
                } else {
                    console.error('Error fetching real-time car location:', error);
                }
            });
    };

    const fetchTripSummary = (rentedVehiclesId) => {
      axios.get(`http://localhost:5028/api/Location/trip-summary/${rentedVehiclesId}`)
      .then((response) => {
        const tripSummaryData = response.data;
        setTripSummary(tripSummaryData);
      })
      .catch((error) => {
        console.error('Error fetching trip summary:', error);
      });

    };

    useEffect(() => {
      const intervalId = setInterval(() => {
          if (selectedVehicle && selectedVehicle.rent_status === "Ongoing") {
              fetchRealTimeCarLocation(selectedVehicle.rented_vehicle_id);
          }
      }, 2000); // Update every 2 seconds
  
      return () => clearInterval(intervalId); // Clean up interval on component unmount
    }, [selectedVehicle]);
  
  

    //ADD TRIP
      // Fetch renters from API
  useEffect(() => {
    axios
      .get("http://localhost:5028/api/Renter/list")
      .then((response) => {
        setRenterList(response.data);
      })
      .catch((error) => console.error("Error fetching renters:", error));
  }, []);

  // Fetch vehicles from API
  useEffect(() => {
    axios
      .get("http://localhost:5028/api/Vehicle/list")
      .then((response) => {
        setVehicleList(response.data);
      })
      .catch((error) => console.error("Error fetching vehicles:", error));
  }, []);

  // Handle renter selection
  const handleSelectRenter = (e) => {
    const fullName = e.target.value;
    const renter = renterList.find(
      (r) => `${r.renter_fname} ${r.renter_lname}` === fullName
    );
    setSelectedRenter(renter);
  };

  // Handle vehicle selection
  const handleSelectVehicle = (e) => {
    const vehicleId = parseInt(e.target.value, 10);
    const vehicle = vehicleList.find((v) => v.vehicle_id === vehicleId);
    setSelectedVehicle(vehicle);
  };

  // Function to format date in "YYYY Month - DD" format
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  }).replace(',', ' -'); // Adjust the format to "YYYY Month - DD"
};


  // Handle form submission
  const handleSaveTrip = () => {
    if (!selectedRenter || !selectedVehicle || !pickupDate || !pickupTime || !dropoffDate || !dropoffTime) {
      alert("Please complete all fields before saving the trip.");
      return;
    }

    const tripData = {
      renter_id: selectedRenter.renter_id, // Only send renter_id
      vehicle_id: selectedVehicle.vehicle_id, // Only send vehicle_id
      renter_fname: selectedRenter.renter_fname,
      renter_lname: selectedRenter.renter_lname,
      pickup_date: pickupDate,
      pickup_time: pickupTime,
      dropoff_date: dropoffDate,
      dropoff_time: dropoffTime,
      car_manufacturer: selectedVehicle.car_manufacturer,
      car_model: selectedVehicle.car_model,
      plate_number: selectedVehicle.plate_number,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      rent_status: "Upcoming",
    };

    axios
      .post("http://localhost:5028/api/RentedVehicle/add", tripData)
      .then((response) => {
        alert("Trip saved successfully!");
        setShowModal(false);
        
        // Re-fetch rented vehicles and update state to trigger a re-render
        axios.get('http://localhost:5028/api/RentedVehicle')
        .then((response) => {
            console.log('Fetched rented vehicles after new rental:', response.data);
            const sortedVehicles = sortVehicles(response.data); // Sort the vehicles here
            setRentedVehicles(sortedVehicles);  // Update the rented vehicles state
        })
        .catch((error) => {
            console.error('Error fetching rented vehicles:', error);
        });
      })
      .catch((error) => {
        console.error("Error saving trip:", error.response?.data || error.message);
        alert(`Failed to save the trip. Error: ${error.response?.data || error.message}`);
      });
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

                {/* Scrollable Container for the cards */}
                <div className="scrollable-container">
                  {rentedVehicles
                    .filter((vehicle) =>
                      (vehicle.renter_fname && vehicle.renter_fname.includes(searchQuery)) ||
                      (vehicle.renter_lname && vehicle.renter_lname.includes(searchQuery))
                    )
                    .map((vehicle) => (
                      <Card key={vehicle.rented_vehicle_id} className="vehicle-card mb-3" onClick={() => handleCardClick(vehicle)}>
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-center">
                            <p><strong>Rental ID:</strong> {vehicle.rented_vehicle_id}</p>
                            <span className={`status-label ${vehicle.rent_status.toLowerCase()}`}>
                              {vehicle.rent_status}
                            </span>
                          </div>
                          <p><strong>Renter:</strong> {vehicle.renter_fname} {vehicle.renter_lname}</p>
                          <p><strong>Pick-up Date:</strong></p>
                          <p>{formatDate(vehicle.pickup_date)}</p>
                          <p><strong>Drop-off Date:</strong></p>
                          <p>{formatDate(vehicle.dropoff_date)}</p>
                          <p><strong>Car Model:</strong> {vehicle.car_model}</p>
                        </Card.Body>
                      </Card>
                    ))}
                </div>
              </Col>


              <Col md={9} className="col-container">
                    <div className="map-container">
                        <Map
                            {...viewState}
                            onMove={evt => setViewState(evt.viewState)}
                            mapStyle="mapbox://styles/mapbox/streets-v11"
                            mapboxAccessToken="pk.eyJ1Ijoicm9jaGVsbGVib3JyIiwiYSI6ImNtM29rejZnazA0Z3Mya3NkZ2g4YXd5cnIifQ.4Pso-euXHqkZMUmz7Dpegw"
                        >
                            <NavigationControl position="top-right" />
                            
                            {markerPosition && (
                                <Marker
                                    longitude={markerPosition.longitude}
                                    latitude={markerPosition.latitude}
                                    anchor="center"
                                    color="red"
                                />
                            )}

                            {showPopup && markerPosition && (
                                <Popup
                                    longitude={markerPosition.longitude}
                                    latitude={markerPosition.latitude}
                                    anchor="bottom"
                                    onClose={() => setShowPopup(false)}
                                    closeButton={true}
                                >
                                    <div>
                                        <p><strong>Speed:</strong> {markerPosition.speed} km/h</p>
                                        <p><strong>Fuel Consumption:</strong> {markerPosition.totalFuelConsumption} L</p>
                                        <p><strong>Total Distance:</strong> {markerPosition.totalDistanceTravelled} km</p>
                                        <p><strong>Longitude:</strong> {markerPosition.longitude}</p>
                                        <p><strong>Latitude:</strong> {markerPosition.latitude}</p>
                                    </div>
                                </Popup>
                            )}
                        </Map>

                        {selectedVehicle && (
                            <Card className="selected-vehicle-card flying-card">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <Card.Title>Rental Details</Card.Title>
                                        <span className={`status-label ${selectedVehicle.rent_status}`}>
                                            {selectedVehicle.rent_status}
                                        </span>
                                    </div>
                                    <div className="rental-dates">
                                        <p><strong>Pick-up Date:</strong> {formatDate(selectedVehicle.pickup_date)}</p>
                                        <p><strong>Drop-off Date:</strong> {formatDate(selectedVehicle.dropoff_date)}</p>
                                    </div>
                                    <p><strong>Rental ID:</strong> {selectedVehicle.rented_vehicle_id}</p>
                                    <p><strong>Renter:</strong> {selectedVehicle.renter_fname} {selectedVehicle.renter_lname}</p>
                                    <p><strong>Pick-up Time:</strong> {selectedVehicle.pickup_time}</p>
                                    <p><strong>Drop-off Time:</strong> {selectedVehicle.dropoff_time}</p>
                                    <p><strong>Car:</strong> {selectedVehicle.car_manufacturer} {selectedVehicle.car_model}</p>
                                    <p><strong>Plate Number:</strong> {selectedVehicle.plate_number}</p>
                                    {tripSummary && (
                                        <div className="trip-summary">
                                            <h5>Trip Summary</h5>
                                            <p><strong>Total Distance Travelled:</strong> {tripSummary.totalDistanceTravelled} km</p>
                                            <p><strong>Total Fuel Consumption:</strong> {tripSummary.totalFuelConsumption} L</p>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        )}
                    </div>
                </Col>
            </Row>

            {/* Add Rental Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Add Trip</Modal.Title>
                </Modal.Header>
              <Modal.Body>
                {/* Renter Selection */}
                <div>
                  <label>Select a Renter:</label>
                  <select onChange={handleSelectRenter} defaultValue="">
                    <option value="" disabled>
                      Select a Renter
                    </option>
                    {renterList.map((renter, index) => (
                      <option key={index} value={`${renter.renter_fname} ${renter.renter_lname}`}>
                        {`${renter.renter_fname} ${renter.renter_lname}`}
                      </option>
                    ))}
                  </select>
                  {/* {selectedRenter && (
                    <div>
                      <h5>Renter Details:</h5>
                      <p><strong>First Name:</strong> {selectedRenter.renter_fname}</p>
                      <p><strong>Last Name:</strong> {selectedRenter.renter_lname}</p>
                    </div>
                  )} */}
                </div>

                {/* Vehicle Selection */}
                <div style={{ marginTop: "20px" }}>
                  <label>Select a Vehicle:</label>
                  <select onChange={handleSelectVehicle} defaultValue="">
                    <option value="" disabled>
                      Select a Vehicle
                    </option>
                    {vehicleList.map((vehicle) => (
                      <option key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
                        {vehicle.car_manufacturer} {vehicle.car_model} ({vehicle.plate_number})
                      </option>
                    ))}
                  </select>
                  {/* {selectedVehicle && (
                    <div>
                      <h5>Vehicle Details:</h5>
                      <p><strong>Manufacturer:</strong> {selectedVehicle.car_manufacturer}</p>
                      <p><strong>Model:</strong> {selectedVehicle.car_model}</p>
                      <p><strong>Plate Number:</strong> {selectedVehicle.plate_number}</p>
                    </div>
                  )} */}
                </div>

                {/* Trip Details */}
                <div style={{ marginTop: "20px" }}>
                  <h5>Trip Details</h5>
                  <div>
                    <label>Pickup Date:</label>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Pickup Time:</label>
                    <input
                      type="time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Dropoff Date:</label>
                    <input
                      type="date"
                      value={dropoffDate}
                      onChange={(e) => setDropoffDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Dropoff Time:</label>
                    <input
                      type="time"
                      value={dropoffTime}
                      onChange={(e) => setDropoffTime(e.target.value)}
                    />
                  </div>
                </div>
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