import React, { useState } from 'react';
import './VehicleDetails.css';
import FuelConsumptionTab from './FuelConsumptionTab';

const VehicleDetails = ({ vehicle, onClose }) => {
  const [activeTab, setActiveTab] = useState('details');

  if (!vehicle) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'fuel':
        return <FuelConsumptionTab />;
      case 'details':
      default:
        return (
          <div className="vehicle-content">
            <div className="profile-section">
              <img src={vehicle.image} alt={vehicle.driver} className="driver-image" />
              <div className="vehicle-info">
                <div className="registration-number">
                  REGISTRATION NUMBER: {vehicle.plateNo}
                  <button className="edit-btn">Edit</button>
                </div>
                <h2 className="driver-name">{vehicle.driver}</h2>
                <h3 className="vehicle-model">{vehicle.model}</h3>
                <span className={`status ${vehicle.status.toLowerCase()}`}>
                  {vehicle.status}
                </span>
              </div>
            </div>
            <div className="remarks">
              <h4>REMARKS</h4>
              <p>
                <strong>Performance Notes: </strong>
                {vehicle.performanceNotes}
              </p>
              <p>
                <strong>Fleet Utilization: </strong>
                {vehicle.utilization}
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="vehicle-details-overlay">
      <div className="vehicle-details-modal">
        <div className="modal-header">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Vehicle Details
            </button>
            <button
              className={`tab ${activeTab === 'fuel' ? 'active' : ''}`}
              onClick={() => setActiveTab('fuel')}
            >
              Fuel Consumption & Mileage
            </button>
            <button
              className={`tab ${activeTab === 'maintenance' ? 'active' : ''}`}
              onClick={() => setActiveTab('maintenance')}
            >
              Maintenance & Others
            </button>
          </div>
          <button className="close-btn" onClick={onClose}>X</button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default VehicleDetails;