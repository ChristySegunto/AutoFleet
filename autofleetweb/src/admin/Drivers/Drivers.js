import React, { useContext, useState } from 'react';
import { Form, Button, Alert, Modal, Container } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Drivers.css';
import { AuthContext } from './../../settings/AuthContext.js';


const Drivers = () => {
  const { user, adminDetails, setAdminDetails } = useContext(AuthContext); // Access user and setAdminDetails from context
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});  
  const [emailTouched, setEmailTouched] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowCreateAccount(false);
    setShowAccountModal(true);
    setEmail('');
  };

  const handleSubmitAccount = (e) => {
    e.preventDefault();
    console.log('Account creation data:', formData);
    setShowAccountModal(false);
    setFormData({
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  const drivers = [
    {
      id: 1,
      status: 'COMPLETED',
      name: 'JUAN DELA CRUZ',
      carModel: 'Toyota Hiace',
      contactNumber: '09123-456-789',
      email: 'JuanDC@Gmail.com',
      address: '123 Herbosa St.',
      emergencyContact: '09123-456-789',
      pickupLocation: '123 Herbosa St.',
      pickupDate: '11/09/2024',
      pickupTime: '11:00AM',
      dropoffLocation: '123 Herbosa St.',
      dropoffDate: '11/09/2024',
      dropoffTime: '11:00AM',
      photos: [
        '/api/placeholder/400/300'
      ]
    },
    {
      id: 2,
      status: 'ONGOING',
      name: 'ANGEL DEL MONTE',
      carModel: 'Toyota Hiace',
      contactNumber: '09123-456-789',
      email: 'JuanDC@Gmail.com',
      address: '123 Herbosa St.',
      emergencyContact: '09123-456-789',
      pickupLocation: '123 Herbosa St.',
      pickupDate: '11/09/2024',
      pickupTime: '11:00AM',
      dropoffLocation: '123 Herbosa St.',
      dropoffDate: '11/09/2024',
      dropoffTime: '11:00AM',
      photos: [
        '/api/placeholder/400/300'
      ]
    },
    {
      id: 3,
      status: 'ONGOING',
      name: 'JOSE DEVERA',
      carModel: 'Toyota Hiace',
      contactNumber: '09123-456-789',
      email: 'JuanDC@Gmail.com',
      address: '123 Herbosa St.',
      emergencyContact: '09123-456-789',
      pickupLocation: '123 Herbosa St.',
      pickupDate: '11/09/2024',
      pickupTime: '11:00AM',
      dropoffLocation: '123 Herbosa St.',
      dropoffDate: '11/09/2024',
      dropoffTime: '11:00AM',
      photos: [
        '/api/placeholder/400/300'
      ]
    },
  ];

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.carModel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="drivers-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="vehicle-header">
            <h1>RENT SCHEDULE</h1>
            <p>Welcome Back, {adminDetails?.fname}</p>
          </div>
          <div className="header-actions">
            <div className="icon-container">
              <div className="notification-container">
                <i className="fas fa-bell notification-icon"></i>
              </div>
              <div className="search2-container">
                <i className="fas fa-search search2-icon"></i>
              </div>
            </div>
            <div className="admin-dropdown">
              <img 
                className="admin-avatar" 
                src="/api/placeholder/30/30" 
                alt="Avatar" 
              />
              <div className="admin-info">
                <span className="admin-name">John Dalisay</span>
                <span className="admin-label">Admin</span>
              </div>
              <span className="dropdown-arrow">▼</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-container">
        <div className="content-wrapper">
          {/* Left Panel - Driver List */}
          <div className="driver-list">
            <div className="search-container">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                placeholder="Search Files"
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="add-schedule-container">
              <button 
                className="add-schedule-btn" 
                onClick={() => setShowAddVehicleModal(true)}
              >
                Add Schedule
              </button>
            </div>

            <div className="drivers-grid">
              {filteredDrivers.map((driver) => (
                <div
                  key={driver.id}
                  className={`driver-card ${selectedDriver?.id === driver.id ? 'selected' : ''}`}
                  onClick={() => setSelectedDriver(driver)}
                >
                  <div className="driver-info">
                    <img className="avatar" src="/api/placeholder/50/50" alt="" />
                    <div>
                      <div className="drivers-name">{driver.name}</div>
                      <div className="driver-car">{driver.carModel}</div>
                      <div className="driver-pickup">{driver.pickupDate}</div>
                      <div className={`status-indicator ${driver.status === 'COMPLETED' ? 'status-ONGOING' : 'status-COMPLETED'}`}>
                        {driver.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Driver Details */}
          {selectedDriver && (
            <div className="driver-details">
              <div className="details-card">
                <div className="driver-header">{selectedDriver.name}</div>
                <div className="reg-number">Car to be Rented: {selectedDriver.carModel}</div>

                <div className="details-content">
                  {selectedDriver.contactNumber && (
                    <div className="info-section">
                      <div>Contact Number: {selectedDriver.contactNumber}</div>
                      <div>Email: {selectedDriver.email}</div>
                      <div>Address: {selectedDriver.address}</div>
                      <div>Emergency Contact: {selectedDriver.email}</div>
                    </div>
                  )}

                  {selectedDriver.pickupLocation && (
                    <div className="info-section">
                      <div>Pick up Location: {selectedDriver.pickupLocation}</div>
                      <div>Pick up Date: {selectedDriver.pickupDate}</div>
                      <div>Pick up Time: {selectedDriver.pickupTime}</div>
                      <div>Dropoff Location: {selectedDriver.dropoffLocation}</div>
                      <div>Dropoff Date: {selectedDriver.dropoffDate}</div>
                      <div>Dropoff Time: {selectedDriver.dropoffTime}</div>
                    </div>
                  )}

                  {selectedDriver.photos && (
                    <div className="photos-section">
                      <div className="photos-header">GOVERNMENT-ISSUED ID</div>
                      <div className="photos-grid">
                        {selectedDriver.photos.map((photo, index) => (
                          <img
                            key={index}
                            src={photo}
                            alt={`GOV ID`}
                            className="id-photo"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Vehicle Modal */}
      <Modal
        show={showAddVehicleModal}
        onHide={() => setShowAddVehicleModal(false)}
        size="lg"
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text w-100" style={{ fontWeight: 'bold', color: '#f76d20' }}>
            ADD VEHICLE
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Renter Details */}
          <h6 style={{ color: '#003399', fontWeight: 'bold', marginBottom: '10px' }}>RENTER DETAILS</h6>
          <Form>
            <div className="row">
              <Form.Group className="col-md-4">
                <Form.Label>First Name</Form.Label>
                <Form.Control size="sm" type="text" placeholder="Enter first name" />
              </Form.Group>
              <Form.Group className="col-md-4">
                <Form.Label>Middle Name</Form.Label>
                <Form.Control size="sm" type="text" placeholder="Enter middle name" />
              </Form.Group>
              <Form.Group className="col-md-4">
                <Form.Label>Last Name</Form.Label>
                <Form.Control size="sm" type="text" placeholder="Enter last name" />
              </Form.Group>
            </div>
            <div className="row">
              <Form.Group className="col-md-6">
                <Form.Label>Birthday</Form.Label>
                <Form.Control size="sm" type="date" />
              </Form.Group>
              <Form.Group className="col-md-6">
                <Form.Label>Email</Form.Label>
                <Form.Control size="sm" type="email" placeholder="Enter email" />
              </Form.Group>
            </div>
            <div className="row">
              <Form.Group className="col-md-6">
                <Form.Label>Contact Number</Form.Label>
                <Form.Control size="sm" type="text" placeholder="Enter contact number" />
              </Form.Group>
              <Form.Group className="col-md-6">
                <Form.Label>Emergency Contact</Form.Label>
                <Form.Control size="sm" type="text" placeholder="Enter emergency contact" />
              </Form.Group>
            </div>
            <div className="row">
              <Form.Group className="col-md-12">
                <Form.Label>Address</Form.Label>
                <Form.Control size="sm" type="text" placeholder="Enter address" />
              </Form.Group>
            </div>
            <div className="row">
              <Form.Group className="col-md-12">
                <Form.Label>Upload ID</Form.Label>
                <Form.Control size="sm" type="file" />
              </Form.Group>
            </div>
          </Form>

          {/* Rent Details */}
          <h6 style={{ color: '#003399', fontWeight: 'bold', marginTop: '15px', marginBottom: '10px' }}>
            RENT DETAILS
          </h6>
          <Form>
            <div className="row">
              <Form.Group className="col-md-6">
                <Form.Label>Pick Up Location</Form.Label>
                <Form.Control size="sm" type="text" placeholder="Enter pick-up location" />
              </Form.Group>
              <Form.Group className="col-md-6">
                <Form.Label>Drop Off Location</Form.Label>
                <Form.Control size="sm" type="text" placeholder="Enter drop-off location" />
              </Form.Group>
            </div>
            <div className="row">
              <Form.Group className="col-md-3">
                <Form.Label>Start Date of Rent</Form.Label>
                <Form.Control size="sm" type="date" />
              </Form.Group>
              <Form.Group className="col-md-3">
                <Form.Label>Start Time of Rent</Form.Label>
                <Form.Control size="sm" type="time" />
              </Form.Group>
              <Form.Group className="col-md-3">
                <Form.Label>End Date of Rent</Form.Label>
                <Form.Control size="sm" type="date" />
              </Form.Group>
              <Form.Group className="col-md-3">
                <Form.Label>End Time of Rent</Form.Label>
                <Form.Control size="sm" type="time" />
              </Form.Group>
            </div>
          </Form>

          {/* Vehicle Details */}
          <h6 style={{ color: '#003399', fontWeight: 'bold', marginTop: '15px', marginBottom: '10px' }}>
            VEHICLE DETAILS
          </h6>
          <Form>
            <div className="row">
              <Form.Group className="col-md-6">
                <Form.Label>Car to be Rented</Form.Label>
                <Form.Control size="sm" type="text" placeholder="Enter car name/model" />
              </Form.Group>
              <Form.Group className="col-md-6">
                <Form.Label>Plate Number</Form.Label>
                <Form.Control size="sm" type="text" placeholder="Enter plate number" />
              </Form.Group>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button
            variant="primary"
            style={{
              backgroundColor: '#003399',
              borderColor: '#003399',
              padding: '5px 15px',
            }}
            onClick={() => {
              setShowAddVehicleModal(false);
              setShowCreateAccount(true);
            }}
          >
            Next
          </Button>
        </Modal.Footer>
      </Modal>

     {/* Simple Create Account Modal */}
<Modal
  show={showCreateAccount}
  onHide={() => setShowCreateAccount(false)}
  size="md"
  centered
  className="simple-account-modal"
>
  <Modal.Header closeButton>
    <Modal.Title
      className="w-100"
      style={{
        color: '#f76d20',
        fontSize: '24px',
        fontWeight: 'bold',
      }}
    >
      INPUT YOUR EMAIL ADDRESS
    </Modal.Title>
  </Modal.Header>
  <Modal.Body className="px-4 py-3">
    <Form noValidate>
      <Form.Group className="mb-4">
        <Form.Label style={{ color: '#000', marginBottom: '8px' }}>Email</Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          style={{
            border: 'none',
            borderBottom: '1px solid #ced4da',
            borderRadius: '0',
            padding: '8px 0',
            boxShadow: 'none',
          }}
          isInvalid={!email && emailTouched} // Mark invalid if touched and empty
        />
        <Form.Control.Feedback type="invalid">
          Email is required.
        </Form.Control.Feedback>
      </Form.Group>

      <div className="d-flex flex-column align-items-center">
        <Button
          className="w-100 mb-3"
          variant="dark"
          style={{
            backgroundColor: '#003399',
            border: 'none',
            borderRadius: '4px',
            padding: '10px',
          }}
          onClick={() => {
            if (!email) {
              setEmailTouched(true); 
              return; 
            }
            setShowCreateAccount(false);
          }}
        >
          Submit
        </Button>

        <span
          style={{
            color: '#003399',
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
          onClick={() => {
            setShowCreateAccount(false);
            setShowAccountModal(true);
          }}
        >
          Create an account
        </span>
      </div>
    </Form>
  </Modal.Body>
</Modal>



       {/* Create Renter Account Modal */}
       <Modal
        show={showAccountModal}
        onHide={() => setShowAccountModal(false)}
        size="md"
        dialogClassName="custom-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center" style={{ color: '#f76d20', fontWeight: 'bold' }}>
            CREATE A RENTER'S ACCOUNT
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitAccount}>
            <Form.Group className="mb-4">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-center">
              <Button
                type="submit"
                style={{
                  backgroundColor: '#003399',
                  borderColor: '#003399',
                  padding: '8px 40px',width: '100%',
                  maxWidth: '200px',
                  borderRadius: '5px',
                  fontWeight: 'bold'
                }}
              >
                Submit
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Drivers;