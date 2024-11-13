// src/admin/Vehicles/Vehicles.js

import { Form, Button, Alert, Modal, Container } from 'react-bootstrap';
import React, { useState } from 'react';
import './Vehicles.css';
import VehicleDetails from './VehicleDetails';

const Vehicles = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // sample data, icoconnect ito sa db
  const vehicles = [
    {
      vehicleNo: '1',
      plateNo: 'ABC-1234',
      driver: 'Juan Dela Cruz',
      model: 'Toyota Hiace',
      status: 'Repair',
      image: '/path/to/driver-image.jpg',
      performanceNotes:
        'The vehicle has been performing well, with no reported issues. Regular check-ups are recommended to maintain efficiency',
      utilization:
        'Actively utilized for local deliveries, averaging 500 km/week.',
    },
    {
      vehicleNo: '2',
      plateNo: 'ABC-1234',
      driver: 'Juan Dela Cruz',
      model: 'Toyota Hiace',
      status: 'Active',
      image: '/path/to/driver-image.jpg',
      performanceNotes:
        'The vehicle has been performing well, with no reported issues. Regular check-ups are recommended to maintain efficiency',
      utilization:
        'Actively utilized for local deliveries, averaging 500 km/week.',
    },
    {
      vehicleNo: '3',
      plateNo: 'ABC-1234',
      driver: 'Juan Dela Cruz',
      model: 'Toyota Hiace',
      status: 'Inactive',
      image: '/path/to/driver-image.jpg',
      performanceNotes:
        'The vehicle has been performing well, with no reported issues. Regular check-ups are recommended to maintain efficiency',
      utilization:
        'Actively utilized for local deliveries, averaging 500 km/week.',
    },
  ];

  const handleRowClick = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const closeVehicleDetails = () => {
    setSelectedVehicle(null);
  };

  return (
    <div className="vehicles-container">
      <div className="top-ribbon">
        <h2 className="vehicle-header">VEHICLES RECORD</h2>
        <p>Welcome Back, John!</p>
      </div>

      <div className="header-row">
        <h3 className="list-header">LIST OF VEHICLES</h3>
        <div className="action-buttons">
          <button className="export-btn">Export</button>
          <button className="add-vehicle-btn">Add Vehicle</button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Vehicle #</th>
              <th>Plate #</th>
              <th>Driver</th>
              <th>Car Model</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle, index) => (
              <tr
                key={index}
                onClick={() => handleRowClick(vehicle)}
                className="vehicle-row"
              >
                <td>{vehicle.vehicleNo}</td>
                <td>{vehicle.plateNo}</td>
                <td>{vehicle.driver}</td>
                <td>{vehicle.model}</td>
                <td>
                  <span className={`status ${vehicle.status.toLowerCase()}`}>
                    {vehicle.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedVehicle && (
        <VehicleDetails
          vehicle={selectedVehicle}
          onClose={closeVehicleDetails}
        />
      )}
    </div>
  );
};

export default Vehicles;
