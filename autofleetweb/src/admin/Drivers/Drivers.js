import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Modal, Container } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Drivers.css';
import { AuthContext } from './../../settings/AuthContext.js';
import { FaBell, FaSearch, FaUser } from 'react-icons/fa';

const Drivers = () => {
  const { user, adminDetails, setAdminDetails } = useContext(AuthContext);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [renterList, setRenterList] = useState([]);
  const [renterFname, setRenterFname] = useState("");
  const [renterMname, setRenterMname] = useState("");
  const [renterLname, setRenterLname] = useState("");
  const [renterBirthday, setRenterBirthday] = useState("");
  const [renterContactNumber, setRenterContactNumber] = useState("");
  const [renterEmail, setRenterEmail] = useState("");
  const [renterEmergencyContact, setRenterEmergencyContact] = useState("");
  const [renterAddress, setRenterAddress] = useState("");
  const [renterIdPhoto, setRenterIdPhoto] = useState("");

  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});  
  const [emailTouched, setEmailTouched] = useState(false);

  useEffect(() => {
    fetchRenterList();
  }, []);

  const fetchRenterList = () => {
    axios.get('http://localhost:5028/api/Renter/list') 
      .then(response => {
        setRenterList(response.data);
      })
      .catch(error => {
        console.error("Error fetching renter list:", error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitAccount = (e) => {
    e.preventDefault();
    
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const newRenter = {
      renter_fname: renterFname,
      renter_mname: renterMname,
      renter_lname: renterLname,
      renter_birthday: renterBirthday,
      renter_contact_num: renterContactNumber,
      renter_email: renterEmail,
      renter_emergency_contact: renterEmergencyContact,
      renter_address: renterAddress,
      renter_id_photo_1: renterIdPhoto,
      user_id: adminDetails?.adminId,
      password: formData.password
    };

    // Prepare a temporary ID for immediate rendering
    const tempId = Date.now();
    const tempRenter = { ...newRenter, id: tempId };

    // Optimistically add the renter to the list
    const updatedRenterList = [...renterList, tempRenter];
    setRenterList(updatedRenterList);

    axios.post('http://localhost:5028/api/Renter/addRenter', newRenter)
      .then(response => {
        // Replace the temporary renter with the actual response from server
        const actualRenter = response.data;
        setRenterList(prevList => 
          prevList.map(renter => 
            renter.id === tempId ? actualRenter : renter
          )
        );
        
        alert("Renter and account added successfully!");
        setShowAccountModal(false);
        
        // Reset form data
        resetFormFields();
      })
      .catch(error => {
        // If API fails, remove the temporary renter
        setRenterList(prevList => 
          prevList.filter(renter => renter.id !== tempId)
        );
        
        console.error("Error adding renter:", error);
        alert(`Failed to add renter: ${error.response?.data || error.message}`);
      });
  };

  const resetFormFields = () => {
    setRenterFname("");
    setRenterMname("");
    setRenterLname("");
    setRenterBirthday("");
    setRenterContactNumber("");
    setRenterEmail("");
    setRenterEmergencyContact("");
    setRenterAddress("");
    setRenterIdPhoto("");
    setFormData({
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowCreateAccount(false);
    setShowAccountModal(true);
    setEmail('');
  };

  const filteredDrivers = renterList.filter(driver =>
    driver.renter_fname.toLowerCase().includes(searchQuery.toLowerCase())  ||
    driver.renter_mname.toLowerCase().includes(searchQuery.toLowerCase())  ||
    driver.renter_lname.toLowerCase().includes(searchQuery.toLowerCase())  ||
    driver.renter_email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="drivers-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="vehicle-header">
            <h1>RENTER</h1>
            <p>Welcome Back, {adminDetails?.fname}</p>
          </div>
          <div className="header-actions">
            <div className='header-button'>
              <Button className='user-button'>
                <div className='user-icon'><FaUser /></div> 
                {adminDetails?.fname} {adminDetails?.lname }
              </Button>
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
              <i className="fas fa-search dsearch-icon"></i>
              <input
                type="text"
                placeholder=" Search Renter"
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="add-schedule-container">
            <button 
            className="add-schedule-btn" 
            onClick={() => setShowCreateAccount(true)} 
          >
            Add Renter
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
                      <div className="drivers-name">{driver.renter_fname} {driver.renter_mname} {driver.renter_lname}</div>
                      <div className="driver-email">{driver.renter_email}</div>
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
                <div className="driver-header">{selectedDriver.renter_fname} {selectedDriver.renter_mname} {selectedDriver.renter_lname}</div>
                <div className="reg-number">Birthday: {selectedDriver.birthDay}</div>

                <div className="details-content">
                  {selectedDriver.renter_contact_num && (
                    <div className="info-section">
                      <div>Contact Number: {selectedDriver.renter_contact_num}</div>
                      <div>Email: {selectedDriver.renter_email}</div>
                      <div>Address: {selectedDriver.renter_address}</div>
                      <div>Emergency Contact: {selectedDriver.renter_emergency_contact}</div>
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

                  {selectedDriver.renter_id_photo_1 && (
                    <div className="photos-section">
                      <div className="photos-header">GOVERNMENT-ISSUED ID</div>
                      <div className="photos-grid">
                          <img
                            src={selectedDriver.renter_id_photo_1}
                            alt={`GOV ID`}
                            className="id-photo"
                          />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

     {/* Verify Email Modal */}
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
          isInvalid={!email && emailTouched}
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
          setShowAddVehicleModal(true); 
        }}
      >
        Verify
      </Button>

      <span
        style={{
          color: '#003399',
          textDecoration: 'underline',
          cursor: 'pointer',
        }}
        onClick={() => {
          setShowCreateAccount(false);
          setShowAddVehicleModal(true); 
        }}
      >
        Create an account
      </span>
      </div>
    </Form>
  </Modal.Body>
</Modal>

        {/* Personal Details Modal */}
        <Modal
          show={showAddVehicleModal}
          onHide={() => setShowAddVehicleModal(false)}
          size="lg"
          dialogClassName="custom-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title className="text w-100" style={{ fontWeight: 'bold', color: '#f76d20' }}>
              ADD RENTER
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          {/* Renter Details */}
          <h6 style={{ color: '#003399', fontWeight: 'bold', marginBottom: '10px' }}>RENTER DETAILS</h6>
          <Form>
            <div className="row">
              <Form.Group className="col-md-4">
                <Form.Label>First Name</Form.Label>
                <Form.Control 
                  value={renterFname} 
                  onChange={(e) => setRenterFname(e.target.value)}
                  size="sm" 
                  type="text" 
                  placeholder="Enter first name" 
                />
              </Form.Group>
              <Form.Group className="col-md-4">
                <Form.Label>Middle Name</Form.Label>
                <Form.Control 
                  value={renterMname} 
                  onChange={(e) => setRenterMname(e.target.value)}
                  size="sm" 
                  type="text" 
                  placeholder="Enter middle name" 
                />
              </Form.Group>
              <Form.Group className="col-md-4">
                <Form.Label>Last Name</Form.Label>
                <Form.Control 
                  value={renterLname} 
                  onChange={(e) => setRenterLname(e.target.value)}
                  size="sm" 
                  type="text" 
                  placeholder="Enter last name" 
                />
              </Form.Group>
            </div>

            <div className="row">
            <Form.Group className="col-md-6">
                <Form.Label>Birthday</Form.Label>
                <Form.Control
                  value={renterBirthday ? renterBirthday.toString().slice(0, 10) : ""}
                  onChange={(e) => {
                    const selectedDate = new Date(e.target.value);
                    const formattedDate = selectedDate.toISOString().slice(0, 10);
                    setRenterBirthday(formattedDate);
                  }}
                  size="sm"
                  type="date"
                />
              </Form.Group>
              <Form.Group className="col-md-6">
                <Form.Label>Email</Form.Label>
                <Form.Control 
                  value={renterEmail} 
                  onChange={(e) => setRenterEmail(e.target.value)}
                  size="sm" 
                  type="email" 
                  placeholder="Enter email"
                />
              </Form.Group>
            </div>
            <div className="row">
            <Form.Group className="col-md-6">
                <Form.Label>Contact Number</Form.Label>
                <Form.Control 
                  value={renterContactNumber} 
                  onChange={(e) => setRenterContactNumber(e.target.value)}
                  size="sm" 
                  type="text" 
                  placeholder="Enter contact number"
                />
              </Form.Group>
              <Form.Group className="col-md-6">
                <Form.Label>Emergency Contact</Form.Label>
                <Form.Control 
                  value={renterEmergencyContact} 
                  onChange={(e) => setRenterEmergencyContact(e.target.value)}
                  size="sm" 
                  type="text" 
                  placeholder="Enter emergency contact"
                />
              </Form.Group>
            </div>
            <div className="row">
            <Form.Group className="col-md-12">
                <Form.Label>Address</Form.Label>
                <Form.Control 
                  value={renterAddress} 
                  onChange={(e) => setRenterAddress(e.target.value)}
                  size="sm" 
                  type="text" 
                  placeholder="Enter address"
                />
              </Form.Group>
            </div>
            <div className="row">
            <Form.Group className="col-md-12">
                <Form.Label>Upload ID</Form.Label>
                <Form.Control 
                  value={renterIdPhoto} 
                  onChange={(e) => setRenterIdPhoto(e.target.value)}
                  size="sm" 
                  type="text" 
                />
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
            setShowAccountModal(true); 
          }}
        >
          Next
        </Button>
        </Modal.Footer>
      </Modal>


       {/* Email and Password Creation Modal */}
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
            value={renterEmail}  
            readOnly      
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
                variant="primary"
                style={{
                  backgroundColor: '#003399',
                  borderColor: '#003399',
                  padding: '8px 40px',
                  width: '100%',
                  maxWidth: '200px',
                  borderRadius: '5px',
                  fontWeight: 'bold'
                }}
                onClick={handleSubmitAccount}
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