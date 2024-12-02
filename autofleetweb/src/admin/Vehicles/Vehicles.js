import { Form, Button, Modal, Row, Col, Tabs, Tab, Alert } from 'react-bootstrap';
import { FaBell, FaSearch, FaUser, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';  // To make HTTP requests
import { AuthContext } from './../../settings/AuthContext.js';
import './Vehicles.css';

const Vehicles = () => {
  const { user, adminDetails, setAdminDetails } = useContext(AuthContext); // Access user and setAdminDetails from context
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'view', 'edit'
  const [activeTab, setActiveTab] = useState('details');
  const [errors, setErrors] = useState({});

  // Fetch vehicles data from the backend (replace with your actual API URL)
  useEffect(() => {
    axios.get('http://localhost:5028/api/Vehicle/list') // Adjust the URL as needed
      .then(response => {
        setVehicles(response.data);
      })
      .catch(error => {
        console.error("Error fetching vehicles:", error);
      });
  }, []);

  const handleShow = () => {
    setModalMode('add');
    setSelectedVehicle({
      vehicle_id: 0,
      plate_number: '',
      car_model: '',
      vehicle_status: '',
      fuel_type: '',
      transmission_type: '',
      seating_capacity: '',
      total_mileage: '',
      vehicle_category: '',
      total_fuel_consumption: '',
      distance_traveled: '',
      created_at: '',
      updated_at: ''
    });
    setShowModal(true);
    setActiveTab('details');
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedVehicle(null);
    setActiveTab('details');
    setErrors({});  // Clear errors on modal close
  };

  const handleRowClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setModalMode('view');
    setShowModal(true);
    setActiveTab('details');
  };

  const handleEdit = (vehicle) => {
    setSelectedVehicle(vehicle);
    setModalMode('edit');
    setShowModal(true);
    setActiveTab('details');
  };
  
  const handleRemove = (vehicle) => {
    console.log("Remove vehicle", vehicle);
    // Correct the delete URL to match the backend route
    axios.delete(`http://localhost:5028/api/Vehicle/${vehicle.vehicle_id}`)
      .then(response => {
        alert("Vehicle removed successfully!");
        setVehicles(prevList => prevList.filter(v => v.vehicle_id !== vehicle.vehicle_id));
      })
      .catch(error => {
        console.error("Error removing vehicle:", error);
        alert(`Failed to remove vehicle: ${error.response?.data || error.message}`);
      });
  };

  const validateForm = () => {
    const newErrors = {};
  
    // Check required fields
    if (!selectedVehicle?.plate_number) newErrors.plate_number = "Plate number is required.";
    if (!selectedVehicle?.car_model) newErrors.car_model = "Car model is required.";
    if (!selectedVehicle?.vehicle_status) newErrors.vehicle_status = "Vehicle status is required.";
  
    // Check for numeric fields (e.g., total_mileage should be a number and >= 0)
    if (!selectedVehicle?.total_mileage || isNaN(selectedVehicle.total_mileage) || selectedVehicle.total_mileage < 0) {
      newErrors.total_mileage = "Total mileage must be a positive number.";
    }
  
    // Validate other numeric fields like total_fuel_consumption, distance_traveled
    if (!selectedVehicle?.total_fuel_consumption || isNaN(selectedVehicle.total_fuel_consumption) || selectedVehicle.total_fuel_consumption < 0) {
      newErrors.total_fuel_consumption = "Total fuel consumption must be a positive number.";
    }
  
    if (!selectedVehicle?.distance_traveled || isNaN(selectedVehicle.distance_traveled) || selectedVehicle.distance_traveled < 0) {
      newErrors.distance_traveled = "Distance traveled must be a positive number.";
    }
  
    // Check if seating_capacity is a valid integer
    if (selectedVehicle?.seating_capacity && !Number.isInteger(Number(selectedVehicle.seating_capacity))) {
      newErrors.seating_capacity = "Seating capacity must be an integer.";
    }
  
    // Set the errors
    setErrors(newErrors);
  
    // If there are any errors, return false to prevent form submission
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSave = () => {
    if (!validateForm()) return;  // If validation fails, do not proceed
  
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
      created_at: selectedVehicle.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  
    // Include vehicle_id only for updates
    if (selectedVehicle.vehicle_id) {
      newVehicle.vehicle_id = selectedVehicle.vehicle_id;
    }
  
    console.log("New Vehicle Data:", newVehicle);
  
    const request = selectedVehicle.vehicle_id
      ? axios.put(`http://localhost:5028/api/Vehicle/${selectedVehicle.vehicle_id}`, newVehicle) // Update
      : axios.post("http://localhost:5028/api/Vehicle", newVehicle); // Add
  
    request
      .then((response) => {
        alert("Vehicle saved successfully!");
        setShowModal(false);
        setVehicles((prevList) => {
          if (selectedVehicle.vehicle_id) {
            // Update existing vehicle
            return prevList.map((v) =>
              v.vehicle_id === selectedVehicle.vehicle_id ? response.data : v
            );
          } else {
            // Add new vehicle
            return [...prevList, response.data];
          }
        });
      })
      .catch((error) => {
        console.error("Error saving vehicle:", error);
        alert(`Failed to save vehicle: ${error.response?.data || error.message}`);
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
          <button className="export-btn">EXPORT</button>
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
                onClick={() => handleRowClick(vehicle)}
                className="vehicle-row"
              >
                <td>{vehicle.vehicle_id}</td>
                <td>{vehicle.plate_number}</td>
                <td>{vehicle.car_model}</td>
                <td>
                  <span className={`status ${vehicle.vehicle_status.toLowerCase()}`}>
                    {vehicle.vehicle_status}
                  </span>
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
                            <option value="Available">Active</option>
                            <option value="Pending">Pending</option>
                            <option value="Rented">Rented</option>
                            <option value="On Maintenance">On Maintenance</option>
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
                          {selectedVehicle?.fuel_type === '' && (
                              <option value="">Select Fuel Type</option>
                            )}
                            <option value="Diesel">Diesel</option>
                            <option value="Gasoline">Gasoline</option>
                            <option value="Electric">Electric</option>
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
                          {selectedVehicle?.transmission_type === '' && (
                              <option value="">Select Transmission Type</option>
                            )}
                            <option value="Manual">Manual</option>
                            <option value="Automatic">Automatic</option>
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
                          {selectedVehicle?.vehicle_category === '' && (
                            <option value="">Select Category</option>
                          )}
                          <option value="Sedan">Sedan</option>
                          <option value="SUV">SUV</option>
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
                    </Form.Group>
                  </Row>

                  <Row md={2}>
                    <Form.Group className="modal-vehicle-formgroup" controlId="createdAt">
                      <Form.Label className="modal-vehicle-label">
                        {modalMode === 'add' ? 'Created At' : 'Created Date'}
                      </Form.Label>
                      <Form.Control 
                        className="modal-vehicle-control" 
                        type="datetime-local" 
                        value={selectedVehicle?.created_at ? new Date(selectedVehicle.created_at).toISOString().slice(0, 16) : ''} 
                        disabled={true} // Always disable created_at field
                        onChange={(e) => setSelectedVehicle({ ...selectedVehicle, created_at: e.target.value })} 
                      />
                    </Form.Group>

                    <Form.Group className="modal-vehicle-formgroup" controlId="updatedAt">
                      <Form.Label className="modal-vehicle-label">
                        {modalMode === 'add' ? 'Initial Update Date' : 'Updated At'}
                      </Form.Label>
                      <Form.Control 
                        className="modal-vehicle-control" 
                        type="datetime-local" 
                        value={selectedVehicle?.updated_at ? new Date(selectedVehicle.updated_at).toISOString().slice(0, 16) : ''} 
                        disabled={modalMode === 'view'}
                        onChange={(e) => setSelectedVehicle({ ...selectedVehicle, updated_at: e.target.value })} 
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
