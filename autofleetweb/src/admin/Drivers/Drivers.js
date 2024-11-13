import { Form, Button, Alert, Modal, Container } from 'react-bootstrap';
import './Drivers.css'
import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Drivers = () => {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const drivers = [
    {
      id: 1,
      name: 'JUAN DELA CRUZ',
      regNumber: 'ABC-1234',
      carModel: 'Toyota Hiace',
      status: 'Available',
      trainingCompleted: 'Yes',
      contactNumber: '09123-456-789',
      email: 'JuanDC@Gmail.com',
      photos: [
        '/api/placeholder/400/300',
        '/api/placeholder/400/300'
      ]
    },
    {
      id: 2,
      name: 'MARIE SANTOS',
      regNumber: 'XYZ-1234',
      carModel: 'Toyota Hiace',
      status: 'Unavailable',
      trainingCompleted: 'Yes',
      contactNumber: '09123-456-789',
      email: 'JuanDC@Gmail.com',
      photos: [
        '/api/placeholder/400/300',
        '/api/placeholder/400/300'
      ]
    },
    {
      id: 3,
      name: 'JOSE REYES',
      regNumber: 'DEF-9101',
      carModel: 'Toyota Hiace',
      status: 'Unavailable',
      trainingCompleted: 'Yes',
      contactNumber: '09123-456-789',
      email: 'JuanDC@Gmail.com',
      photos: [
        '/api/placeholder/400/300',
        '/api/placeholder/400/300'
      ]
    },
    {
      id: 4,
      name: 'ANA MORALES',
      regNumber: 'GHI-2345',
      carModel: 'Toyota Hiace',
      status: 'Available',
      trainingCompleted: 'Yes',
      contactNumber: '09123-456-789',
      email: 'JuanDC@Gmail.com',
      photos: [
        '/api/placeholder/400/300',
        '/api/placeholder/400/300'
      ]
    }
  ];

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.regNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="drivers-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div>
            <h1 className="company-logo">DRIVERS</h1>
            <p className="welcome-text">Welcome Back, John!</p>
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
                    src="https://via.placeholder.com/30" 
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

            <div className="add-driver-container">
              <button className="add-driver-btn">
                Add Driver
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
                  <img className="avatar" src="https://via.placeholder.com/50" alt="" />
                    <div>
                      <div className="driver-name">{driver.name}</div>
                      <div className="driver-reg">{driver.regNumber}</div>
                      <div className={`status-indicator ${driver.status === 'Available' ? 'status-available' : 'status-unavailable'}`}>
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
                <div className="reg-number">REGISTRATION NUMBER: {selectedDriver.regNumber}</div>

                <div className="details-content">
                  {selectedDriver.carModel && (
                    <div className="info-section">
                      <div>Car Model: {selectedDriver.carModel}</div>
                      <div className={`status-indicator ${
                        selectedDriver.status === 'Available' ? 'status-available' : 'status-unavailable'
                      }`}>
                        Status: {selectedDriver.status}
                      </div>
                      <div>Driver Training Completed: {selectedDriver.trainingCompleted}</div>
                    </div>
                  )}

                  {selectedDriver.contactNumber && (
                    <div className="info-section">
                      <div>Contact Number: {selectedDriver.contactNumber}</div>
                      <div>Email: {selectedDriver.email}</div>
                    </div>
                  )}

                  {selectedDriver.photos && (
                    <div className="photos-section">
                    <div className="photos-header">CAR PHOTOS</div>
                    <div className="photos-grid">
                      {selectedDriver.photos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo || "https://via.placeholder.com/400x300"} // Placeholder image
                          alt={`Car photo ${index + 1}`}
                          className="car-photo"
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
    </div>
  );
};

export default Drivers;