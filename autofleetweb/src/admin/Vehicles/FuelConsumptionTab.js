// src/admin/Vehicles/FuelConsumptionTab.js
import React from 'react';
import './FuelConsumptionTab.css';

const FuelConsumptionTab = () => {
  return (
    <div className="vehicle-content">
        
      <div className="fuel-section">
        <div className="fuel-header">FUEL CONSUMPTION</div>
        <div className="fuel-grid">
          <div className="fuel-item">
            <div className="fuel-label">Fuel Type:</div>
            <div className="fuel-value">Diesel</div>
          </div>
          <div className="fuel-item">
            <div className="fuel-label">Fuel Consumption This Month:</div>
            <div className="fuel-value">150 liters</div>
          </div>
          <div className="fuel-item">
            <div className="fuel-label">Average Mileage This Month:</div>
            <div className="fuel-value">10km/l</div>
          </div>
          <div className="fuel-item">
            <div className="fuel-label">Total Distance Driven This Month:</div>
            <div className="fuel-value">1,500 km</div>
          </div>
        </div>
      </div>

      <div className="fuel-section">
        <div className="fuel-header">MILEAGE</div>
        <div className="fuel-grid">
          <div className="fuel-item">
            <div className="fuel-label">Current Odometer Readings:</div>
            <div className="fuel-value">85,000 km</div>
          </div>
          <div className="fuel-item">
            <div className="fuel-label">Last Oil Change:</div>
            <div className="fuel-value">85,000 km</div>
          </div>
          <div className="fuel-item full-width">
            <div className="fuel-label">Next Oil Change:</div>
            <div className="fuel-value">85,000 km</div>
          </div>
        </div>
      </div>

      <div className="update-container">
        <button className="update-btn">UPDATE</button>
      </div>
    </div>
  );
};

export default FuelConsumptionTab;