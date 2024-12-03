import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Button, Modal } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Drivers.css';
import { AuthContext } from './../../settings/AuthContext.js';
import { FaUser } from 'react-icons/fa';

const Drivers = () => {
  const { adminDetails } = useContext(AuthContext);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  
  // Email verification state
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailError, setEmailError] = useState('');
  
  // Renter Details State
  const [renterList, setRenterList] = useState([]);
  const [renterFname, setRenterFname] = useState("");
  const [renterMname, setRenterMname] = useState("");
  const [renterLname, setRenterLname] = useState("");
  const [renterBirthday, setRenterBirthday] = useState("");
  const [renterContactNumber, setRenterContactNumber] = useState("");
  const [renterEmail, setRenterEmail] = useState("");
  const [renterEmergencyContact, setRenterEmergencyContact] = useState("");
  const [renterAddress, setRenterAddress] = useState("");
  const [recentTrips, setRecentTrips] = useState([]);


  // Account Creation State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    fetchRenterList();
  }, []);

  useEffect(() => {
    if (selectedDriver) {
      fetchRecentTrips(selectedDriver.renter_id);
    }
  }, [selectedDriver]);

  const fetchRenterList = async () => {
    try {
      const response = await axios.get('http://localhost:5028/api/Renter/list');
      setRenterList(response.data);
    } catch (error) {
      console.error("Error fetching renter list:", error);
      alert("Failed to fetch renters");
    }
  };

  const fetchRecentTrips = async (renterId) => {
    try {
      const response = await axios.get(`http://localhost:5028/api/Home/recent-trips/${renterId}`);
      setRecentTrips(response.data);
    } catch (error) {
      console.error('Error fetching recent trips:', error);
      alert('Failed to fetch recent trips');
    }
  };

  const checkEmailUniqueness = async (emailToCheck) => {
    try {
      const response = await axios.get(`http://localhost:5028/api/Renter/check-email?email=${emailToCheck}`);
      return response.data;
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  const handleEmailVerification = async () => {
    setEmailTouched(true);
    setEmailError('');

    if (!email) {
      setEmailError('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
      return;
    }

    try {
      const isUnique = await checkEmailUniqueness(email);
      
      if (isUnique) {
        setShowCreateAccount(false);
        setRenterEmail(email);
        setShowAddVehicleModal(true);
      } else {
        setEmailError('User already exists');
      }
    } catch (error) {
      setEmailError('Error verifying email');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitAccount = async (e) => {
    e.preventDefault();
    setPasswordError('');

    // Validate password
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
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
      // renter_id_photo_1: renterIdPhoto,
      // password: formData.password
    };

    // const formDataToSend = new FormData();
    // if (renterIdPhoto) {
    //   formDataToSend.append('renter_id_photo', renterIdPhoto); // Attach file
    // }

    const newAcc = {
      email: renterEmail,
      password: formData.password,
      role: "renter"
    }

    try {
      // Create user first
      const userResponse = await axios.post('http://localhost:5028/api/Renter/addAcc', newAcc);

      newRenter.user_id = userResponse.data.user_id;  // Assuming user_response contains the user_id
      const response = await axios.post('http://localhost:5028/api/Renter/addRenter', newRenter);

      
      // Update local list with new renter
      setRenterList(prev => [...prev, response.data]);
      
      // Reset modals and forms
      setShowAccountModal(false);
      setShowAddVehicleModal(false);
      
      // Reset all form fields
      resetFormFields();
      
      alert("Renter added successfully!");
    } catch (error) {
      console.error("Error adding renter:", error);
      alert(error.response?.data || "Failed to add renter");
    }
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
    // setRenterIdPhoto("");
    setFormData({
      email: '',
      password: '',
      confirmPassword: ''
    });
    setEmail('');
  };

  const filteredDrivers = renterList.filter(driver =>
    driver.renter_fname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.renter_mname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.renter_lname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.renter_email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0]; // Get the first file selected
  //   if (file) {
  //     setRenterIdPhoto(file); // Save the file to the state
  //   }
  // };
  
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

                  {/* {selectedDriver.pickupLocation && (
                    <div className="info-section">
                      <div>Pick up Location: {selectedDriver.pickupLocation}</div>
                      <div>Pick up Date: {selectedDriver.pickupDate}</div>
                      <div>Pick up Time: {selectedDriver.pickupTime}</div>
                      <div>Dropoff Location: {selectedDriver.dropoffLocation}</div>
                      <div>Dropoff Date: {selectedDriver.dropoffDate}</div>
                      <div>Dropoff Time: {selectedDriver.dropoffTime}</div>
                    </div>
                  )} */}

                  {recentTrips.length > 0 ? (
                    <div className="recent-trips">
                      <h5>Recent Trips</h5>
                        {recentTrips.map((trip, index) => (
                          <div key={index} className='recent-trips-box'>
                            <div>Car Model: {trip.car_model}</div>
                            <div>Pickup Date: {trip.pickupDate}</div>
                            <div>Pickup Time: {trip.pickupTime}</div>
                          </div>
                        ))}
                    </div>
                    ) : (
                      <div className="recent-trips">
                        <h5>Recent Trips</h5>
                        <div className="no-recent-trips">No recent trips</div>
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
        onHide={() => {
          setShowCreateAccount(false);
          setEmailTouched(false);
          setEmailError('');
        }}
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailTouched(true);
                  setEmailError('');
                }}
                placeholder="Enter email"
                style={{
                  border: 'none',
                  borderBottom: '1px solid #ced4da',
                  borderRadius: '0',
                  padding: '8px 0',
                  boxShadow: 'none',
                }}
                isInvalid={!!emailError}
              />
              {emailError && (
                <Form.Control.Feedback type="invalid">
                  {emailError}
                </Form.Control.Feedback>
              )}
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
                onClick={handleEmailVerification}
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
          centered
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
                  className="custom-dateform"
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
                isInvalid={!!passwordError}
                required
              />
                <Form.Control.Feedback type="invalid">{passwordError}</Form.Control.Feedback>

            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                isInvalid={!!passwordError}
                required
              />
                <Form.Control.Feedback type="invalid">{passwordError}</Form.Control.Feedback>

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