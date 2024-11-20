// src/admin/Vehicles/Vehicles.js
import { Form, Button, Modal, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { FaBell, FaSearch, FaUser, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import React, { useContext, useState } from 'react';
import { AuthContext } from './../../settings/AuthContext.js';
import './Vehicles.css';

const Vehicles = () => {
  const {user} = useContext(AuthContext); // Access user and setAdminDetails from context
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'view', 'edit'
  const [activeTab, setActiveTab] = useState('details');

  const handleShow = () => {
    setModalMode('add');
    setShowModal(true);
    setActiveTab('details');
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedVehicle(null);
    setActiveTab('details');
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
  };

  const handleView = (vehicle) => {
    setSelectedVehicle(vehicle);
    setModalMode('view');
    setShowModal(true);
    setActiveTab('details');
  };
  // sample data, icoconnect ito sa db
  const vehicles = [
    {
      vehicle_id: '1',
      plate_number: 'ABC-1234',
      driver: 'Juan Dela Cruz',
      car_model: 'Toyota Hiace',
      vehicle_status: 'Repair',
      image: '/path/to/driver-image.jpg',
      performanceNotes:
        'The vehicle has been performing well, with no reported issues. Regular check-ups are recommended to maintain efficiency',
      utilization:
        'Actively utilized for local deliveries, averaging 500 km/week.',
      car_manufacturer: 'Toyota',
      manufacture_year: '2020',
      vehicle_color: 'White',
      fuel_type: 'Diesel',
      transmission_type: 'Automatic',
      seating_capacity: '12',
      total_mileage: '85,000 km',
      total_fuel_consumption: '2,500 L',
      distance_traveled: '12,500 km',
      vehicle_category: 'Van',
      created_at: '2023-01-15T08:30:00Z',
      updated_at: '2024-03-20T14:45:00Z'
    },
    {
      vehicle_id: '2',
      plate_number: 'DEF-5678',
      driver: 'Maria Santos',
      car_model: 'Ford Transit',
      vehicle_status: 'Active',
      image: '/path/to/driver-image2.jpg',
      performanceNotes:
        'Excellent condition, minimal maintenance required',
      utilization:
        'Used for long-distance transportation, averaging 750 km/week.',
      car_manufacturer: 'Ford',
      manufacture_year: '2019',
      vehicle_color: 'Blue',
      fuel_type: 'Gasoline',
      transmission_type: 'Manual',
      seating_capacity: '15',
      total_mileage: '95,000 km',
      total_fuel_consumption: '3,200 L',
      distance_traveled: '15,800 km',
      vehicle_category: 'Passenger Van',
      created_at: '2023-02-20T10:15:00Z',
      updated_at: '2024-03-19T16:30:00Z'
    },
    {
      vehicle_id: '3',
      plate_number: 'GHI-9012',
      driver: 'Pedro Lopez',
      car_model: 'Nissan NV350',
      vehicle_status: 'Inactive',
      image: '/path/to/driver-image3.jpg',
      performanceNotes:
        'Requires significant maintenance, currently out of service',
      utilization:
        'Not in active use, awaiting repairs',
      car_manufacturer: 'Nissan',
      manufacture_year: '2018',
      vehicle_color: 'Silver',
      fuel_type: 'Diesel',
      transmission_type: 'Automatic',
      seating_capacity: '10',
      total_mileage: '110,000 km',
      total_fuel_consumption: '2,800 L',
      distance_traveled: '13,200 km',
      vehicle_category: 'Cargo Van',
      created_at: '2023-03-10T09:45:00Z',
      updated_at: '2024-03-18T11:20:00Z'
    },
  ];

  return (
    <div className="vehicles-container">
      <div className="top-ribbon">
        <div className="left-side">
          <div className="vehicle-header">
            <h1>VEHICLES RECORD</h1>
            <p>Welcome Back, {user?.email}</p>
          </div>
        </div>
        <div className="right-side">
          <Button className='notif-button'><FaBell /></Button>
          <Button className='search-button'><FaSearch /></Button>
          <Button className='user-button'>
            <div className='user-icon'><FaUser /></div> 
            Someone else
          </Button>
        </div>
      </div>
      
      <div className="header-row">
        <h3 className="list-header">LIST OF VEHICLES</h3>
        <div className="action-buttons">
          <button className="export-btn">EXPORT</button>
          <Button className='add-vehicle' onClick={handleShow}>
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
              <th>Driver</th>
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
                <td>{vehicle.driver}</td>
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
                    handleView(vehicle);
                  }}>
                    <FaEye />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
                {/* Profile section only shown in view mode */}
                {modalMode === 'view' && selectedVehicle && (
                  <>
                    <div className="profile-section">
                      <img 
                        src={selectedVehicle.image} 
                        alt={selectedVehicle.driver} 
                        className="driver-image" 
                      />
                      <div className="vehicle-info">
                        <div className="registration-number">
                          REGISTRATION NUMBER: {selectedVehicle.plate_number}
                        </div>
                        <h2 className="driver-name">{selectedVehicle.driver}</h2>
                        <h3 className="vehicle-model">{selectedVehicle.car_model}</h3>
                      </div>
                      
                      <span className={`status ${selectedVehicle.vehicle_status.toLowerCase()}`}>
                        {selectedVehicle.vehicle_status}
                      </span>
                    </div>

                    <hr />

                    <div className="remarks">
                      <h4>REMARKS</h4>
                      <p>
                        <strong>Performance Notes: </strong>
                        {selectedVehicle.performanceNotes}
                      </p>
                      <p>
                        <strong>Fleet Utilization: </strong>
                        {selectedVehicle.utilization}
                      </p>
                    </div>

                    <hr />
                  </>
                )}

                {/* Form fields shown in all modes */}
                <Form>
                  {(modalMode === 'add' || modalMode === 'edit') && (
                    <>
                      <Row md={2}>
                        <Form.Group className='modal-vehicle-formgroup' controlId="driverName">
                          <Form.Label className='modal-vehicle-label'>Driver Name</Form.Label>
                          <Form.Control 
                            className='modal-vehicle-control' 
                            type="text" 
                            placeholder="Enter Driver Name"
                            defaultValue={selectedVehicle?.driver || ''}
                          />
                        </Form.Group>

                        <Form.Group className='modal-vehicle-formgroup' controlId="vehicleStatus">
                          <Form.Label className='modal-vehicle-label'>Vehicle Status</Form.Label>
                          <Form.Select 
                            className='modal-vehicle-control'
                            defaultValue={selectedVehicle?.vehicle_status || ''}
                          >
                            <option value="">Select Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Repair">Repair</option>
                          </Form.Select>
                        </Form.Group>
                      </Row>

                      <Row md={1}>
                        <Form.Group className='modal-vehicle-formgroup' controlId="performanceNotes">
                          <Form.Label className='modal-vehicle-label'>Performance Notes</Form.Label>
                          <Form.Control 
                            as="textarea" 
                            rows={3}
                            className='modal-vehicle-control' 
                            placeholder="Enter Performance Notes"
                            defaultValue={selectedVehicle?.performanceNotes || ''}
                          />
                        </Form.Group>

                        <Form.Group className='modal-vehicle-formgroup' controlId="utilization">
                          <Form.Label className='modal-vehicle-label'>Fleet Utilization</Form.Label>
                          <Form.Control 
                            as="textarea" 
                            rows={3}
                            className='modal-vehicle-control' 
                            placeholder="Enter Fleet Utilization"
                            defaultValue={selectedVehicle?.utilization || ''}
                          />
                        </Form.Group>
                      </Row>

                      <hr />
                    </>
                  )}

                  <Col>
                    <Modal.Title className='modal-vehicle-title'>VEHICLE SPECS</Modal.Title>
                    <Row md={3}>
                      <Form.Group className='modal-vehicle-formgroup' controlId="vehicleFuel">
                        <Form.Label className='modal-vehicle-label'>Fuel Type</Form.Label>
                        <Form.Control 
                          className='modal-vehicle-control' 
                          type="text" 
                          placeholder="Enter Fuel Type" 
                          defaultValue={selectedVehicle?.fuel_type || ''}
                          disabled={modalMode === 'view'}
                        />
                      </Form.Group>

                      <Form.Group className='modal-vehicle-formgroup' controlId="vehicleTransmission">
                        <Form.Label className='modal-vehicle-label'>Transmission Type</Form.Label>
                        <Form.Control 
                          className='modal-vehicle-control' 
                          type="text" 
                          placeholder="Enter Transmission Type" 
                          defaultValue={selectedVehicle?.transmission_type || ''}
                          disabled={modalMode === 'view'}
                        />
                      </Form.Group>

                      <Form.Group className='modal-vehicle-formgroup' controlId="vehicleCapacity">
                        <Form.Label className='modal-vehicle-label'>Seating Capacity</Form.Label>
                        <Form.Control 
                          className='modal-vehicle-control' 
                          type="text" 
                          placeholder="Enter Seating Capacity" 
                          defaultValue={selectedVehicle?.seating_capacity || ''}
                          disabled={modalMode === 'view'}
                        />
                      </Form.Group>
                    </Row>

                    <Row md={2}>
                      <Form.Group className='modal-vehicle-formgroup' controlId="vehicleMileage">
                        <Form.Label className='modal-vehicle-label'>Vehicle Mileage</Form.Label>
                        <Form.Control 
                          className='modal-vehicle-control' 
                          type="text" 
                          placeholder="Enter Mileage"
                          defaultValue={selectedVehicle?.total_mileage || ''}
                          disabled={modalMode === 'view'}
                        />
                      </Form.Group>

                      <Form.Group className='modal-vehicle-formgroup' controlId="vehicleCategory">
                        <Form.Label className='modal-vehicle-label'>Vehicle Category</Form.Label>
                        <Form.Control 
                          className='modal-vehicle-control' 
                          type="text" 
                          placeholder="Enter Category"
                          defaultValue={selectedVehicle?.vehicle_category || ''}
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
                    <Form.Group className='modal-vehicle-formgroup' controlId="vehicleManufacturer">
                      <Form.Label className='modal-vehicle-label'>Manufacturer</Form.Label>
                      <Form.Control 
                        className='modal-vehicle-control' 
                        type="text" 
                        placeholder="Enter Manufacturer" 
                        defaultValue={selectedVehicle?.car_manufacturer || ''}
                        disabled={modalMode === 'view'}
                      />
                    </Form.Group>

                    <Form.Group className='modal-vehicle-formgroup' controlId="vehicleModel">
                      <Form.Label className='modal-vehicle-label'>Model</Form.Label>
                      <Form.Control 
                        className='modal-vehicle-control' 
                        type="text" 
                        placeholder="Enter Model" 
                        defaultValue={selectedVehicle?.car_model || ''}
                        disabled={modalMode === 'view'}
                      />
                    </Form.Group>

                    <Form.Group className='modal-vehicle-formgroup' controlId="vehiclePlate">
                      <Form.Label className='modal-vehicle-label'>Plate Number</Form.Label>
                      <Form.Control 
                        className='modal-vehicle-control' 
                        type="text" 
                        placeholder="Enter Plate Number" 
                        defaultValue={selectedVehicle?.plate_number || ''}
                        disabled={modalMode === 'view'}
                      />
                    </Form.Group>
                  </Row>

                  <Row md={2}>
                    <Form.Group className='modal-vehicle-formgroup' controlId="vehicleBirthyear">
                      <Form.Label className='modal-vehicle-label'>Year of Manufacture</Form.Label>
                      <Form.Control 
                        className='modal-vehicle-control' 
                        type="text" 
                        placeholder="Enter Year of Manufacture"
                        defaultValue={selectedVehicle?.manufacture_year || ''}
                        disabled={modalMode === 'view'}
                      />
                    </Form.Group>

                    <Form.Group className='modal-vehicle-formgroup' controlId="vehicleColor">
                      <Form.Label className='modal-vehicle-label'>Vehicle Color</Form.Label>
                      <Form.Control 
                        className='modal-vehicle-control' 
                        type="text" 
                        placeholder="Enter Color"
                        defaultValue={selectedVehicle?.vehicle_color || ''}
                        disabled={modalMode === 'view'}
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
                    <Form.Group className='modal-vehicle-formgroup' controlId="vehicleFuel">
                      <Form.Label className='modal-vehicle-label'>Fuel Type</Form.Label>
                      <Form.Control 
                        className='modal-vehicle-control' 
                        type="text" 
                        placeholder="Enter Fuel Type" 
                        defaultValue={selectedVehicle?.fuel_type || ''}
                        disabled={modalMode === 'view'}
                      />
                    </Form.Group>

                    <Form.Group className='modal-vehicle-formgroup' controlId="totalFuelConsumption">
                      <Form.Label className='modal-vehicle-label'>Total Fuel Consumption</Form.Label>
                      <Form.Control 
                        className='modal-vehicle-control' 
                        type="text" 
                        placeholder="Enter Total Fuel Consumption" 
                        defaultValue={selectedVehicle?.total_fuel_consumption || ''}
                        disabled={modalMode === 'view'}
                      />
                    </Form.Group>

                    <Form.Group className='modal-vehicle-formgroup' controlId="distanceTraveled">
                      <Form.Label className='modal-vehicle-label'>Distance Traveled</Form.Label>
                      <Form.Control 
                        className='modal-vehicle-control' 
                        type="text" 
                        placeholder="Enter Distance Traveled" 
                        defaultValue={selectedVehicle?.distance_traveled || ''}
                        disabled={modalMode === 'view'}
                      />
                    </Form.Group>
                  </Row>

                  <Row md={2}>
                    <Form.Group className='modal-vehicle-formgroup' controlId="createdAt">
                      <Form.Label className='modal-vehicle-label'>Created At</Form.Label>
                      <Form.Control 
                        className='modal-vehicle-control' 
                        type="datetime-local" 
                        defaultValue={selectedVehicle?.created_at ? new Date(selectedVehicle.created_at).toISOString().slice(0, 16) : ''}
                        disabled={modalMode === 'view'}
                      />
                    </Form.Group>

                    <Form.Group className='modal-vehicle-formgroup' controlId="updatedAt">
                      <Form.Label className='modal-vehicle-label'>Updated At</Form.Label>
                      <Form.Control 
                        className='modal-vehicle-control' 
                        type="datetime-local" 
                        defaultValue={selectedVehicle?.updated_at ? new Date(selectedVehicle.updated_at).toISOString().slice(0, 16) : ''}
                        disabled={modalMode === 'view'}
                      />
                    </Form.Group>
                  </Row>
                </Col>
              </Form>
            </Tab>
          </Tabs>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" className='modal-vehicle-close' onClick={handleClose}>
            Close
          </Button>
          {modalMode !== 'view' && (
            <Button className='modal-vehicle-save' onClick={handleClose}>
              Save Changes
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Vehicles;