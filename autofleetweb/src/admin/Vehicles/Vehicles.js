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
    axios.get('https://localhost:7164/api/Vehicle/list') // Adjust the URL as needed
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
    // Add the logic to remove vehicle (call an API)
    axios.delete(`https://localhost:7164/api/Vehicles/delete/${vehicle.vehicle_id}`)
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
    if (!selectedVehicle?.plate_number) newErrors.plate_number = "Plate number is required.";
    if (!selectedVehicle?.car_model) newErrors.car_model = "Car model is required.";
    if (!selectedVehicle?.vehicle_status) newErrors.vehicle_status = "Vehicle status is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
  
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
  
    axios
      .post("https://localhost:7164/api/Vehicle/addOrUpdate", newVehicle)
      .then((response) => {
        alert("Vehicle saved successfully!");
        setShowModal(false);
        setVehicles((prevList) => [...prevList, response.data]);
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
                            <option value="On Maintenance">Maintenance</option>
                          </Form.Select>
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
                        <Form.Control 
                          className="modal-vehicle-control" 
                          type="text" 
                          placeholder="Enter Fuel Type"
                          value={selectedVehicle?.fuel_type || ''}
                          onChange={(e) => setSelectedVehicle({ ...selectedVehicle, fuel_type: e.target.value })}
                          disabled={modalMode === 'view'}
                        />
                      </Form.Group>

                      <Form.Group className="modal-vehicle-formgroup" controlId="vehicleTransmission">
                        <Form.Label className="modal-vehicle-label">Transmission Type</Form.Label>
                        <Form.Control 
                          className="modal-vehicle-control" 
                          type="text" 
                          placeholder="Enter Transmission Type"
                          value={selectedVehicle?.transmission_type || ''}
                          onChange={(e) => setSelectedVehicle({ ...selectedVehicle, transmission_type: e.target.value })}
                          disabled={modalMode === 'view'}
                        />
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
                      </Form.Group>

                      <Form.Group className="modal-vehicle-formgroup" controlId="vehicleCategory">
                        <Form.Label className="modal-vehicle-label">Vehicle Category</Form.Label>
                        <Form.Control 
                          className="modal-vehicle-control" 
                          type="text" 
                          placeholder="Enter Category"
                          value={selectedVehicle?.vehicle_category || ''}
                          onChange={(e) => setSelectedVehicle({ ...selectedVehicle, vehicle_category: e.target.value })}
                          disabled={modalMode === 'view'}
                        />
                      </Form.Group>
                    </Row>
                  </Col>
                </Form>
              </div>
            </Tab>

            <Tab eventKey="additional" title="Additional Details">
              <Form>
                <Col>
                  <Row md={3}>
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

                    <Form.Group className="modal-vehicle-formgroup" controlId="vehicleModel">
                      <Form.Label className="modal-vehicle-label">Model</Form.Label>
                      <Form.Control 
                        className="modal-vehicle-control" 
                        type="text" 
                        placeholder="Enter Model" 
                        defaultValue={selectedVehicle?.car_model || ''}
                        disabled={modalMode === 'view'}
                      />
                    </Form.Group>

                    <Form.Group className="modal-vehicle-formgroup" controlId="vehiclePlate">
                      <Form.Label className="modal-vehicle-label">Plate Number</Form.Label>
                      <Form.Control 
                        className="modal-vehicle-control" 
                        type="text" 
                        placeholder="Enter Plate Number" 
                        defaultValue={selectedVehicle?.plate_number || ''}
                        disabled={modalMode === 'view'}
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
                  <Row md={3}>
                    <Form.Group className="modal-vehicle-formgroup" controlId="vehicleFuel">
                      <Form.Label className="modal-vehicle-label">Fuel Type</Form.Label>
                      <Form.Control 
                        className="modal-vehicle-control" 
                        type="text" 
                        placeholder="Enter Fuel Type" 
                        defaultValue={selectedVehicle?.fuel_type || ''}
                        disabled={modalMode === 'view'}
                      />
                    </Form.Group>

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
                      <Form.Label className="modal-vehicle-label">Created At</Form.Label>
                      <Form.Control 
                        className="modal-vehicle-control" 
                        type="datetime-local" 
                        value={selectedVehicle?.created_at ? new Date(selectedVehicle.created_at).toISOString().slice(0, 16) : ''} // Use 'value' here
                        disabled={modalMode === 'view'}
                        onChange={(e) => setSelectedVehicle({ ...selectedVehicle, created_at: e.target.value })} // Ensure onChange updates state
                      />
                    </Form.Group>

                    <Form.Group className="modal-vehicle-formgroup" controlId="updatedAt">
                      <Form.Label className="modal-vehicle-label">Updated At</Form.Label>
                      <Form.Control 
                        className="modal-vehicle-control" 
                        type="datetime-local" 
                        value={selectedVehicle?.updated_at ? new Date(selectedVehicle.updated_at).toISOString().slice(0, 16) : ''} // Use 'value' here
                        disabled={modalMode === 'view'}
                        onChange={(e) => setSelectedVehicle({ ...selectedVehicle, updated_at: e.target.value })} // Ensure onChange updates state
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
