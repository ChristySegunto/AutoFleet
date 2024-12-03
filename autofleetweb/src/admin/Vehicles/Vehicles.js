import { Form, Button, Modal, Row, Col, Tabs, Tab } from 'react-bootstrap';  // Import UI components from React-Bootstrap
import { FaUser, FaEdit, FaTrash, FaEye } from 'react-icons/fa';  // Import icons for UI buttons
import React, { useContext, useState, useEffect } from 'react';  // Import necessary React hooks
import axios from 'axios';  // Import Axios for API requests
import { AuthContext } from './../../settings/AuthContext.js';  // Import AuthContext to get authentication data
import './Vehicles.css';  // Import the CSS file for styling

const Vehicles = () => {
  // Access user and admin details from AuthContext
  const { user, adminDetails, setAdminDetails } = useContext(AuthContext);

  // State hooks for managing vehicle data, modal state, errors, etc.
  const [vehicles, setVehicles] = useState([]);  // State to store list of vehicles
  const [selectedVehicle, setSelectedVehicle] = useState(null);  // State for the selected vehicle
  const [showModal, setShowModal] = useState(false);  // State to control modal visibility
  const [modalMode, setModalMode] = useState('add'); // Modal mode - 'add', 'view', or 'edit'
  const [activeTab, setActiveTab] = useState('details');  // State to manage active tab in the modal
  const [errors, setErrors] = useState({});  // State to manage form validation errors

  // Function to format date to 'YYYY-MM-DD' format
  const formatDate = (date) => {
    if (!date) return '';  // Return empty string if no date is provided
    
    const d = new Date(date);  // Create a new Date object
    const year = d.getFullYear();  // Get the year from the date
    const month = String(d.getMonth() + 1).padStart(2, '0');  // Get the month and pad to two digits
    const day = String(d.getDate()).padStart(2, '0');  // Get the day and pad to two digits
    
    return `${year}-${month}-${day}`;  // Return the formatted date string
  };

  // Fetch vehicles from the backend API when the component mounts
  useEffect(() => {
    axios.get('http://localhost:5028/api/Vehicle/list')  // Send GET request to fetch vehicle data
      .then(response => setVehicles(response.data))  // On success, set the vehicles state with the response data
      .catch(error => console.error("Error fetching vehicles:", error));  // Log error if API request fails
  }, []);  // Empty dependency array ensures this runs only once when the component mounts

  // Handle showing the modal for adding a new vehicle
  const handleShow = () => {
    setModalMode('add');  // Set modal mode to 'add' for creating a new vehicle
    setSelectedVehicle({
      vehicle_id: 0,  // Set default values for a new vehicle
      plate_number: '',
      car_model: '',
      vehicle_status: '',
      created_at: formatDate(new Date())  // Set creation date to current date
    });
    setShowModal(true);  // Show the modal
    setActiveTab('details');  // Set the active tab to 'details'
  };

  // Handle closing the modal
  const handleClose = () => {
    setShowModal(false);  // Hide the modal
    setSelectedVehicle(null);  // Reset the selected vehicle state
    setActiveTab('details');  // Reset the active tab to 'details'
    setErrors({});  // Clear any existing form validation errors
  };

  // Handle clicking on a vehicle row to view details
  const handleRowClick = (vehicle) => {
    const formattedVehicle = {
      ...vehicle,  // Copy existing vehicle data
      created_at: formatDate(vehicle.created_at),  // Format created_at date
      updated_at: formatDate(vehicle.updated_at),  // Format updated_at date
    };

    console.log("Selected Vehicle:", formattedVehicle);  // Log the selected vehicle for debugging
    setSelectedVehicle(formattedVehicle);  // Set the selected vehicle data
    setModalMode('view');  // Set modal mode to 'view' for viewing vehicle details
    setShowModal(true);  // Show the modal
    setActiveTab('details');  // Set the active tab to 'details'
  };

  // Handle editing a vehicle
  const handleEdit = (vehicle) => {
    setSelectedVehicle({
      ...vehicle,  // Copy vehicle data
      created_at: formatDate(vehicle.created_at),  // Format created_at date
      updated_at: formatDate(vehicle.updated_at),  // Format updated_at date
    });
    setModalMode('edit');  // Set modal mode to 'edit'
    setShowModal(true);  // Show the modal
    setActiveTab('details');  // Set the active tab to 'details'
  };

  // Handle removing a vehicle
  const handleRemove = (vehicle) => {
    axios.delete(`http://localhost:5028/api/Vehicle/${vehicle.vehicle_id}`)  // Send DELETE request to remove vehicle
      .then(() => {
        alert("Vehicle removed successfully!");  // Show success message
        setVehicles(prevList => prevList.filter(v => v.vehicle_id !== vehicle.vehicle_id));  // Remove vehicle from the list
      })
      .catch(error => {
        const errorMessage = error.response?.data?.message || error.message;  // Extract error message from response or default to generic message
        console.error("Error removing vehicle:", errorMessage);  // Log error
        alert(`Failed to remove vehicle: ${errorMessage}`);  // Show error alert
      });
  };

  // Handle changing the status of a vehicle
  const handleStatusChange = (vehicleId, newStatus) => {
    axios.put(
      `http://localhost:5028/api/Vehicle/${vehicleId}/status`,  // Send PUT request to update vehicle status
      newStatus,  // New status to be set
      {
        headers: { 'Content-Type': 'application/json' }  // Set content type to JSON
      }
    )
    .then(() => {
      setVehicles(prevVehicles => 
        prevVehicles.map(vehicle => 
          vehicle.vehicle_id === vehicleId  // Find the updated vehicle by ID
            ? { ...vehicle, vehicle_status: newStatus, updated_at: formatDate(new Date()) }  // Update status and updated_at
            : vehicle
        )
      );
    })
    .catch(error => {
      console.error("Error updating status:", error.response?.data || error.message);  // Log error if status update fails
      alert("Failed to update status.");  // Show failure alert
    });
  };

  // Validate the form before saving data
  const validateForm = () => {
    const { plate_number, car_model, vehicle_status, total_mileage, fuel_type, transmission_type, manufacture_year, car_manufacturer, vehicle_color,
            total_fuel_consumption, distance_traveled, seating_capacity,vehicle_category } = selectedVehicle || {};
    
    const newErrors = {};  // Object to hold validation errors
    const numberFields = [
      { field: 'total_mileage', message: "Total mileage must be a positive number." },
      { field: 'total_fuel_consumption', message: "Total fuel consumption must be a positive number." },
      { field: 'distance_traveled', message: "Distance traveled must be a positive number." }
    ];

    // Check for required fields
    if (!plate_number) newErrors.plate_number = "Plate number is required.";
    if (!car_model) newErrors.car_model = "Car model is required.";
    if (!vehicle_status) newErrors.vehicle_status = "Vehicle status is required.";
    if (!fuel_type) newErrors.fuel_type = "Fuel type is required.";
    if (!transmission_type) newErrors.transmission_type = "Transmission type is required.";
    if (!total_mileage) newErrors.total_mileage = "Total mileage is required.";
    if (!total_fuel_consumption) newErrors.total_fuel_consumption = "Total fuel consumption is required.";
    if (!distance_traveled) newErrors.distance_traveled = "Distance traveled is required.";
    if (!seating_capacity) newErrors.seating_capacity = "Seating capacity is required.";
    if (!car_manufacturer) newErrors.car_manufacturer = "Car manufacturer is required.";  
    if (!manufacture_year) newErrors.manufacture_year = "Year of Manufacture is required.";
    if (!vehicle_color) newErrors.vehicle_color = "Vehicle Color is required.";
    if (!vehicle_category) newErrors.vehicle_category = "Vehicle Category is required.";

    // Check if numeric fields are positive numbers
    numberFields.forEach(({ field, message }) => {
      const value = selectedVehicle[field];
      if (!value || isNaN(value) || value < 0) newErrors[field] = message;  // Add error message if invalid
    });

    // Check if seating capacity is an integer
    if (seating_capacity && !Number.isInteger(Number(seating_capacity))) {
      newErrors.seating_capacity = "Seating capacity must be an integer.";  // Add error message for invalid seating capacity
    }

    setErrors(newErrors);  // Set errors state
    return Object.keys(newErrors).length === 0;  // Return true if no errors
  };
  
  // Save or update vehicle data
  const handleSave = () => {
    if (!validateForm()) return;  // Return early if validation fails
  
    const newVehicle = {
      plate_number: selectedVehicle.plate_number,
      car_manufacturer: selectedVehicle.car_manufacturer,
      car_model: selectedVehicle.car_model,
      manufacture_year: selectedVehicle.manufacture_year,
      vehicle_color: selectedVehicle.vehicle_color,
      fuel_type: selectedVehicle.fuel_type,
      transmission_type: selectedVehicle.transmission_type,
      seating_capacity: selectedVehicle.seating_capacity,
      vehicle_category: selectedVehicle.vehicle_category,
      total_mileage: selectedVehicle.total_mileage,
      total_fuel_consumption: selectedVehicle.total_fuel_consumption,
      distance_traveled: selectedVehicle.distance_traveled,
      vehicle_status: selectedVehicle.vehicle_status,
      created_at: selectedVehicle.created_at 
        ? new Date(selectedVehicle.created_at).toISOString() 
        : new Date().toISOString(),
      updated_at: selectedVehicle.updated_at 
        ? new Date(selectedVehicle.updated_at).toISOString() 
        : new Date().toISOString(),
    };

    // Make API request to either add or update vehicle data
    const request = selectedVehicle.vehicle_id
      ? axios.put(`http://localhost:5028/api/Vehicle/${selectedVehicle.vehicle_id}`, newVehicle)
      : axios.post("http://localhost:5028/api/Vehicle", newVehicle);

    request
      .then(response => {
        console.log(`Vehicle ${selectedVehicle.vehicle_id ? 'updated' : 'added'} successfully!`);
        setShowModal(false);  // Close the modal after saving data
        
        // Update vehicles list with the new or updated vehicle data
        setVehicles(prevList => 
          selectedVehicle.vehicle_id
            ? prevList.map(v => 
                v.vehicle_id === selectedVehicle.vehicle_id 
                  ? { ...response.data, created_at: formatDate(response.data.created_at) }
                  : v
              )
            : [...prevList, { ...response.data, created_at: formatDate(response.data.created_at) }]
        );
      })
      .catch(error => {
        const errorMessage = error.response?.data?.message 
          || error.response?.data 
          || error.message 
          || 'An unexpected error occurred';
        
        console.error(`Failed to save vehicle: ${errorMessage}`);  // Log error if save request fails
      });
  };
  

  return (
    <div className="vehicles-container">
      <div className="top-ribbon">
        <div className="left-side">
          <div className="vehicle-header">
            <h1>VEHICLES RECORD</h1>
            <p>Welcome Back, {adminDetails?.fname}</p>
          </div>
        </div>
        <div className='header-button'>
          <Button className='user-button'>
            <div className='user-icon'><FaUser /></div>
            {adminDetails?.fname} {adminDetails?.lname}
          </Button>
        </div>
      </div>
      
      <div className="header-row">
        <h3 className="list-header">LIST OF VEHICLES</h3>
        <div className="action-buttons">
          <Button className='add-vehicle-btn' onClick={handleShow}>
            ADD VEHICLE
          </Button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Vehicle ID</th>
              <th>Plate Number</th>
              <th>Car Model</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle, index) => (
            <tr
              key={index}
              onClick={(e) => {
                // Check if the click target is not in the 'text-center' or 'actions-icons' columns
                const clickedInsideActions = e.target.closest('.text-center, .actions-icons');
                
                // If clicked outside the status dropdown or action buttons, trigger the row click
                if (!clickedInsideActions) {
                  handleRowClick(vehicle, e);
                }
              }}
              className="vehicle-row"
            >
              <td>{vehicle.vehicle_id}</td>
              <td>{vehicle.plate_number}</td>
              <td>{vehicle.car_model}</td>
              <td className="text-center">
                <Form.Control
                  as="select"
                  value={vehicle.vehicle_status}
                  onChange={(e) => {
                    e.stopPropagation(); // Stop the click event from propagating to the row click handler
                    handleStatusChange(vehicle.vehicle_id, e.target.value);
                  }}
                  className={`status-${vehicle.vehicle_status.toLowerCase().replace(' ', '-')}`}
                >
                  {/* Only show "No Status" option if the vehicle doesn't have a status */}
                  {!vehicle.vehicle_status && <option value="">No Status</option>}
                  <option value="Available">Available</option>
                  <option value="Pending">Pending</option>
                  <option value="Rented">Rented</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                </Form.Control>
              </td>
              <td className="actions-icons">
                <Button className="action-btn" onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(vehicle);
                }}>
                  <FaEdit />
                </Button>
                <Button className="action-btn" onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(vehicle);
                }}>
                  <FaTrash />
                </Button>
                <Button className="action-btn" onClick={(e) => {
                  e.stopPropagation();
                  handleRowClick(vehicle); // This will open the vehicle details in view mode
                }}>
                  <FaEye />
                </Button>
              </td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for add/edit/view vehicle */}
      <Modal className='modal-vehicle' show={showModal} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title className='modal-vehicle-title'>
            <b>
              {modalMode === 'add' && 'ADD VEHICLE'}
              {modalMode === 'view' && 'VIEW VEHICLE DETAILS'}
              {modalMode === 'edit' && 'EDIT VEHICLE'}
            </b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Tabs 
            activeKey={activeTab} 
            onSelect={(k) => setActiveTab(k)} 
            className="mb-3"
          >
            <Tab eventKey="details" title="Details">
              <div className="vehicle-details-view">
                {/* Check if selectedVehicle exists before rendering */}
                {modalMode === 'view' && selectedVehicle && (
                  <>
                    <div className="profile-section">
                      <div className="vehicle-info">
                        <div className="registration-number">
                          REGISTRATION NUMBER: {selectedVehicle.plate_number}
                        </div>
                        <h3 className="vehicle-model">{selectedVehicle.car_model}</h3>
                      </div>

                      <span className={`status ${selectedVehicle.vehicle_status.toLowerCase()}`}>
                        {selectedVehicle.vehicle_status}
                      </span>
                    </div>
                    <hr />
                  </>
                )}

                <Form>
                  {(modalMode === 'add' || modalMode === 'edit') && (
                    <>
                      <Row md={2}>
                        <Form.Group as={Col} className="modal-vehicle-formgroup" controlId="plateNumber">
                          <Form.Label className="modal-vehicle-label">Plate Number</Form.Label>
                          <Form.Control 
                            className="modal-vehicle-control" 
                            type="text" 
                            placeholder="Enter Plate Number"
                            value={selectedVehicle?.plate_number || ''}
                            onChange={(e) => setSelectedVehicle({ ...selectedVehicle, plate_number: e.target.value })}
                            disabled={modalMode === 'view'}
                          />
                          {errors.plate_number && <Form.Text className="text-danger">{errors.plate_number}</Form.Text>}
                        </Form.Group>

                        <Form.Group as={Col} className="modal-vehicle-formgroup" controlId="carModel">
                          <Form.Label className="modal-vehicle-label">Car Model</Form.Label>
                          <Form.Control 
                            className="modal-vehicle-control" 
                            type="text" 
                            placeholder="Enter Car Model"
                            value={selectedVehicle?.car_model || ''}                          
                            onChange={(e) => setSelectedVehicle({ ...selectedVehicle, car_model: e.target.value })}
                            disabled={modalMode === 'view'}
                          />
                          {errors.car_model && <Form.Text className="text-danger">{errors.car_model}</Form.Text>}
                        </Form.Group>

                        <Form.Group as={Col} className="modal-vehicle-formgroup" controlId="vehicleStatus">
                          <Form.Label className="modal-vehicle-label">Vehicle Status</Form.Label>
                          <Form.Select 
                            className="modal-vehicle-control"
                            value={selectedVehicle?.vehicle_status || ''}
                            onChange={(e) => setSelectedVehicle({ ...selectedVehicle, vehicle_status: e.target.value })}
                            disabled={modalMode === 'view'}
                          >
                            <option value="">Select Status</option>
                            <option value="Available">Available</option>
                            <option value="Pending">Pending</option>
                            <option value="Rented">Rented</option>
                            <option value="Under Maintenance">Under Maintenance</option>
                          </Form.Select>
                          {errors.vehicle_status && <Form.Text className="text-danger">{errors.vehicle_status}</Form.Text>}
                        </Form.Group>
                      </Row>
                      <hr />
                    </>
                  )}

                  <Col>
                    <Modal.Title className="modal-vehicle-title">VEHICLE SPECS</Modal.Title>
                    <Row md={3}>
                      <Form.Group className="modal-vehicle-formgroup" controlId="vehicleFuel">
                        <Form.Label className="modal-vehicle-label">Fuel Type</Form.Label>
                        <Form.Select
                          className="modal-vehicle-control" 
                          value={selectedVehicle?.fuel_type || ''}
                          onChange={(e) => setSelectedVehicle({ ...selectedVehicle, fuel_type: e.target.value })}
                          disabled={modalMode === 'view'}
                        >
                          {!selectedVehicle?.fuel_type && <option value="">Select Fuel Type</option>}
                          <option value="Diesel">Diesel</option>
                          <option value="Gasoline">Gasoline</option>
                          <option value="Electric">Electric</option>
                          <option value="Hybrid">Hybrid</option>
                        </Form.Select>
                        {errors.fuel_type && <Form.Text className="text-danger">{errors.fuel_type}</Form.Text>}
                      </Form.Group>

                      <Form.Group className="modal-vehicle-formgroup" controlId="vehicleTransmission">
                        <Form.Label className="modal-vehicle-label">Transmission Type</Form.Label>
                        <Form.Select 
                          className="modal-vehicle-control" 
                          value={selectedVehicle?.transmission_type || ''}
                          onChange={(e) => setSelectedVehicle({ ...selectedVehicle, transmission_type: e.target.value })}
                          disabled={modalMode === 'view'}
                        >
                          {!selectedVehicle?.transmission_type && <option value="">Select Transmission Type</option>}
                          <option value="Manual">Manual</option>
                          <option value="Automatic">Automatic</option>
                          <option value="Dual-clutch">Dual-clutch</option>
                          <option value="CVT">CVT</option>
                        </Form.Select>
                        {errors.transmission_type && <Form.Text className="text-danger">{errors.transmission_type}</Form.Text>}
                      </Form.Group>

                      <Form.Group className="modal-vehicle-formgroup" controlId="vehicleCapacity">
                        <Form.Label className="modal-vehicle-label">Seating Capacity</Form.Label>
                        <Form.Control 
                          className="modal-vehicle-control" 
                          type="text" 
                          placeholder="Enter Seating Capacity"
                          value={selectedVehicle?.seating_capacity || ''}
                          onChange={(e) => setSelectedVehicle({ ...selectedVehicle, seating_capacity: e.target.value })}
                          disabled={modalMode === 'view'}
                        />
                        {errors.seating_capacity && <Form.Text className="text-danger">{errors.seating_capacity}</Form.Text>}
                      </Form.Group>
                    </Row>

                    <Row md={2}>
                      <Form.Group className="modal-vehicle-formgroup" controlId="vehicleMileage">
                        <Form.Label className="modal-vehicle-label">Vehicle Mileage</Form.Label>
                        <Form.Control 
                          className="modal-vehicle-control" 
                          type="text" 
                          placeholder="Enter Mileage"
                          value={selectedVehicle?.total_mileage || ''}
                          onChange={(e) => setSelectedVehicle({ ...selectedVehicle, total_mileage: e.target.value })}
                          disabled={modalMode === 'view'}
                        />
                        {errors.total_mileage && <Form.Text className="text-danger">{errors.total_mileage}</Form.Text>}
                      </Form.Group>

                      <Form.Group className="modal-vehicle-formgroup" controlId="vehicleCategory">
                        <Form.Label className="modal-vehicle-label">Vehicle Category</Form.Label>
                        <Form.Select
                          className="modal-vehicle-control"
                          value={selectedVehicle?.vehicle_category || ''}
                          onChange={(e) => setSelectedVehicle({ ...selectedVehicle, vehicle_category: e.target.value })}
                          disabled={modalMode === 'view'}
                        >
                          {!selectedVehicle?.vehicle_category && <option value="">Select Category</option>}
                          <option value="Sedan">Sedan</option>
                          <option value="SUV">SUV</option>
                          <option value="Van">Van</option>
                          <option value="Minivan">Minivan</option>
                          <option value="Coupe">Coupe</option>
                          <option value="Pickup">Pickup</option>
                          <option value="Jeep">Jeep</option>
                        </Form.Select>
                        {errors.vehicle_category && <Form.Text className="text-danger">{errors.vehicle_category}</Form.Text>}
                      </Form.Group>
                    </Row>
                  </Col>
                </Form>
              </div>
            </Tab>

            <Tab eventKey="additional" title="Additional Details">
              <Form>
                <Col>
                  <Row md={1}>
                    <Form.Group className="modal-vehicle-formgroup" controlId="vehicleManufacturer">
                      <Form.Label className="modal-vehicle-label">Manufacturer</Form.Label>
                      <Form.Control 
                        className="modal-vehicle-control" 
                        type="text" 
                        placeholder="Enter Manufacturer"
                        value={selectedVehicle?.car_manufacturer || ''}  // Use 'value' here
                        disabled={modalMode === 'view'}
                        onChange={(e) => setSelectedVehicle({ ...selectedVehicle, car_manufacturer: e.target.value })} // Ensure onChange updates state
                      />
                      {errors.car_manufacturer && <Form.Text className="text-danger">{errors.car_manufacturer}</Form.Text>}
                    </Form.Group>
                  </Row>

                  <Row md={2}>
                    <Form.Group className="modal-vehicle-formgroup" controlId="vehicleBirthyear">
                      <Form.Label className="modal-vehicle-label">Year of Manufacture</Form.Label>
                      <Form.Control 
                        className="modal-vehicle-control" 
                        type="text" 
                        placeholder="Enter Year of Manufacture"
                        value={selectedVehicle?.manufacture_year || ''}  // Use 'value' here instead of 'defaultValue'
                        disabled={modalMode === 'view'}
                        onChange={(e) => setSelectedVehicle({ ...selectedVehicle, manufacture_year: e.target.value })} // Ensure onChange updates state
                      />
                      {errors.manufacture_year && <Form.Text className="text-danger">{errors.manufacture_year}</Form.Text>}
                    </Form.Group>

                    <Form.Group className="modal-vehicle-formgroup" controlId="vehicleColor">
                      <Form.Label className="modal-vehicle-label">Vehicle Color</Form.Label>
                      <Form.Control 
                        className="modal-vehicle-control" 
                        type="text" 
                        placeholder="Enter Color"
                        value={selectedVehicle?.vehicle_color || ''}  // Use 'value' here
                        disabled={modalMode === 'view'}
                        onChange={(e) => setSelectedVehicle({ ...selectedVehicle, vehicle_color: e.target.value })} // Ensure onChange updates state
                      />
                      {errors.vehicle_color && <Form.Text className="text-danger">{errors.vehicle_color}</Form.Text>}
                    </Form.Group>
                  </Row>
                </Col>
              </Form>
            </Tab>

            <Tab eventKey="specs" title="Fuel Consumption & Others">
              <Form>
                <Col>
                  <Row md={2}>
                    <Form.Group className="modal-vehicle-formgroup" controlId="totalFuelConsumption">
                      <Form.Label className="modal-vehicle-label">Total Fuel Consumption</Form.Label>
                      <Form.Control 
                        className="modal-vehicle-control" 
                        type="text" 
                        placeholder="Enter Total Fuel Consumption" 
                        value={selectedVehicle?.total_fuel_consumption || ''}  // Use 'value' here
                        disabled={modalMode === 'view'}
                        onChange={(e) => setSelectedVehicle({ ...selectedVehicle, total_fuel_consumption: e.target.value })} // Ensure onChange updates state
                      />
                      {errors.total_fuel_consumption && <Form.Text className="text-danger">{errors.total_fuel_consumption}</Form.Text>}
                    </Form.Group>

                    <Form.Group className="modal-vehicle-formgroup" controlId="distanceTraveled">
                      <Form.Label className="modal-vehicle-label">Distance Traveled</Form.Label>
                      <Form.Control 
                        className="modal-vehicle-control" 
                        type="text" 
                        placeholder="Enter Distance Traveled" 
                        value={selectedVehicle?.distance_traveled || ''}  // Use 'value' here
                        disabled={modalMode === 'view'}
                        onChange={(e) => setSelectedVehicle({ ...selectedVehicle, distance_traveled: e.target.value })} // Ensure onChange updates state
                      />
                      
                      {errors.distance_traveled && <Form.Text className="text-danger">{errors.distance_traveled}</Form.Text>}
                    </Form.Group>
                  </Row>

                  <Row md={2}>
                    <Form.Group className="modal-vehicle-formgroup" controlId="createdAt">
                      <Form.Label className="modal-vehicle-label">
                        {modalMode === 'add' ? 'Initial Create Date' : 'Created At'}
                      </Form.Label>
                      <Form.Control 
                        className="modal-vehicle-control" 
                        type="date" 
                        value={
                          modalMode === 'add' 
                            ? formatDate(new Date()) 
                            : formatDate(selectedVehicle?.created_at)
                        }
                        disabled
                        readOnly
                      />
                    </Form.Group>

                    <Form.Group className="modal-vehicle-formgroup" controlId="updatedAt">
                      <Form.Label className="modal-vehicle-label">
                        {modalMode === 'add' ? 'Initial Update Date' : 'Updated At'}
                      </Form.Label>
                      <Form.Control 
                        className="modal-vehicle-control" 
                        type="date" 
                        value={formatDate(selectedVehicle?.updated_at)}
                        disabled
                        readOnly
                      />
                    </Form.Group>
                  </Row>
                </Col>
              </Form>
            </Tab>
          </Tabs>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {(modalMode === 'add' || modalMode === 'edit') && (
            <Button variant="primary" onClick={handleSave}>
              Save
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Vehicles;
