import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';

//Design
import { Form, Button, Alert, Modal, Container, Row, Col } from 'react-bootstrap';
import { FaBell, FaSearch, FaUser } from 'react-icons/fa';

import { AuthContext } from './../../settings/AuthContext.js';
import { useNavigate } from 'react-router-dom';

import './Maintenance.css'

function Maintenance() {
  const { user, adminDetails, setAdminDetails } = useContext(AuthContext); // Access user and setAdminDetails from context
  const [showModal, setShowModal] = useState(false);
  const [plateNumbers, setPlateNumbers] = useState([]);
  const [maintenanceList, setMaintenanceList] = useState([]);
  // const [plateDetails, setPlateDetails] = useState([]);
  const [selectedCarModel, setSelectedCarModel] = useState("");
  const [maintenanceType, setMaintenanceType] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [nextDueDate, setNextDueDate] = useState("");
  const [selectedPlate, setSelectedPlate] = useState("");
  const [vehicleId, setVehicleId] = useState("");

  const maintenanceIntervals = {
    "Oil Change": 90, // 90 days (3 months)
    "Tire Rotation": 180, // 180 days (6 months)
    "Brake Inspection": 365, // 365 days (1 year)
    "Engine Check": 180, // 180 days (6 months)
    "Battery Replacement": 365, // 365 days (1 year)
    "Transmission Service": 365, // 365 days (1 year)
  };

  const statusColors = {
    "Pending": "#CC3C3C",
    "Under Maintenance": "#767676",
    "Completed": "#68B031",
  };

  const statusBgColors = {
    "Pending": "#FFD9D9",
    "Under Maintenance": "#E6E6E6",
    "Completed": "#D1F1B9",
  };

  const getStatusColor = (status) => statusColors[status] || "gray";


  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  useEffect(() => {
    axios.get('http://localhost:5028/api/Maintenance/plateNumbers') // Adjust the URL as needed
      .then(response => {
        setPlateNumbers(response.data);
      })
      .catch(error => {
        console.error("Error fetching plate numbers:", error);
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5028/api/Maintenance/list') // Adjust the URL as needed
      .then(response => {
        setMaintenanceList(response.data);
      })
      .catch(error => {
        console.error("Error fetching maintenance list:", error);
      });
  }, []);

  const handlePlateChange = (event) => {
    const selectedPlate = event.target.value;
    console.log("Selected Plate:", selectedPlate); // Log to check

    const selectedCar = plateNumbers.find(p => p.plate_number === selectedPlate);
    
    if (selectedCar) {
        setSelectedCarModel(selectedCar.car_model);
        setSelectedPlate(selectedPlate); // Update the selected plate here
        setVehicleId(selectedCar.vehicle_id); // Set the vehicle_id here

        console.log("Vehicle ID Set:", selectedCar.vehicle_id); // Debugging log
    } else {
        setSelectedCarModel("");
        setVehicleId(null); // Clear vehicle_id if no plate is selected
        console.log("No car selected, resetting vehicle ID.");
    }
  };

  const handleMaintenanceTypeChange = (e) => {
    const type = e.target.value;
    console.log("Selected Maintenance Type:", type); // Log to check
    setMaintenanceType(type);
    // Auto-calculate next due date
    if (dueDate) {
      const interval = maintenanceIntervals[type];
      if (interval) {
        const nextDate = new Date(dueDate);
        nextDate.setDate(nextDate.getDate() + interval);
        setNextDueDate(nextDate.toISOString().split('T')[0]);
      }
    }
  };

  // Handle due date change
  const handleDueDateChange = (e) => {
    const date = e.target.value;
    console.log("Selected Due Date:", date); // Log to check
    setDueDate(date);
  
    if (maintenanceType) {
      const interval = maintenanceIntervals[maintenanceType];
      if (interval) {
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + interval);
        setNextDueDate(nextDate.toISOString().split('T')[0]);
      }
    }
  };


  // Handle form submission to save maintenance data
  const handleSave = () => {
    if (!selectedPlate || !maintenanceType || !dueDate ) {
      alert("Please fill all required fields.");
      return;
    }
    const newMaintenance = {
      car_model: selectedCarModel,
      maintenance_due_date: dueDate,
      maintenance_next_due_date: nextDueDate,
      maintenance_status: "Pending",
      maintenance_type: maintenanceType,
      plate_num: selectedPlate,
      vehicle_id: vehicleId,
    };

    console.log("New Maintenance Data:", newMaintenance);

    // Send POST request to your backend
    axios.post('http://localhost:5028/api/Maintenance/addMaintenance', newMaintenance)
      .then(response => {
        alert("Maintenance added successfully!");
        setShowModal(false); // Close modal on success
        // Optionally refresh maintenance list here
        setMaintenanceList(prevList => [...prevList, response.data]);
      })
      .catch(error => {
        console.error("Error adding maintenance:", error);
        alert(`Failed to add maintenance: ${error.response?.data || error.message}`);
      });
  };

  const handleStatusChange = (maintenance_id, newStatus) => {
    const maintenance = maintenanceList.find(item => item.maintenance_id === maintenance_id);
    
    if (!maintenance) {
      alert('Maintenance record not found.');
      return;
    }
  
    // Construct the payload with maintenance_id and other necessary fields
    const updateData = {
      maintenance_id: maintenance.maintenance_id,  // Correctly reference maintenance_id
      maintenance_status: newStatus,
      car_model: maintenance.car_model,            // Include car_model in the request
      plate_num: maintenance.plate_num,            // Include plate_num in the request
      maintenance_type: maintenance.maintenance_type, // Include maintenance_type in the request
    };
  
    // Send PUT request to the backend
    axios
      .put(`http://localhost:5028/api/Maintenance/updateStatus/${maintenance.maintenance_id}`, updateData)
      .then(() => {
        setMaintenanceList(prevList =>
          prevList.map(item =>
            item.maintenance_id === maintenance.maintenance_id ? { ...item, maintenance_status: newStatus } : item
          )
        );
        alert("Status updated successfully!");
      })
      .catch(error => {
        console.error("Error updating status:", error);
        alert(`Failed to update status: ${error.response?.data || error.message}`);
      });
  };
  

  return (
    <div className="Maintenance">
      <div className='header-maintenance'>
        <div className='header-row'>
          <h1>MAINTENANCE</h1>
          <p>Welcome Back, {adminDetails?.fname}</p>
        </div>
        <div className='header-button'>
          <Button className='user-button'>
            <div className='user-icon'><FaUser /></div> 
            {adminDetails?.fname} {adminDetails?.lname}
          </Button>
        </div>
      </div>

      <Row className='maintenance-title'>
        <div className='col h4-placing'>
          <h4>MAINTENANCE SCHEDULE</h4>
          <Button className='add-maintenance' onClick={handleShow}>
            ADD MAINTENANCE
          </Button>
        </div>
      </Row>

      <Row className="maintenance-table">
        <div className='maintenance-table-container'>
          <table className="table">
            <thead>
              <tr>
                <th>Plate Number</th>
                <th>Vehicle Name</th>
                <th>Maintenance Type</th>
                <th>Due Date</th>
                <th>Next Due Date</th>
                <th className='text-center'>Status</th>
                <th className='text-center'>Action</th>
              </tr>
            </thead>
            <tbody>
              {maintenanceList.length > 0 ? (
                maintenanceList.map((maintenance, index) => (
                  <tr key={index}>
                    <td>{maintenance.plate_num || "N/A"}</td>
                    <td>{maintenance.car_model || "N/A"}</td>
                    <td>{maintenance.maintenance_type || "N/A"}</td>
                    <td>{maintenance.dueDate || "N/A"}</td>
                    <td>{maintenance.nextDueDate || "N/A"}</td>
                    <td className={`text-center`}>
                      <Form.Control
                        as="select"
                        value={maintenance.maintenance_status}
                        onChange={(e) => handleStatusChange(maintenance.maintenance_id, e.target.value)}
                        className={`status-${maintenance.maintenance_status.toLowerCase().replace(' ', '-')}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Under Maintenance">Under Maintenance</option>
                        <option value="Completed">Completed</option>
                      </Form.Control>
                    </td>
                    <td className='text-center'>
                      <i className="fas fa-trash" style={{ cursor: 'pointer'}}></i>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No Maintenance Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
      </Row>


      {/* Modal for Adding Maintenance */}
      <Modal className='modal-maintenance' show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title className='modal-maintenance-title'>ADD MAINTENANCE</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className='modal-maintenance-formgroup' controlId="vehicleId">
              <Form.Label className='modal-maintenance-label'>Plate Number</Form.Label>
              <Form.Control className='modal-maintenance-control' as="select" onChange={handlePlateChange}>
                <option value="">Select Plate Number</option>
                {plateNumbers.map((plate, index) => (
                  <option key={index} value={plate.plate_number}>{plate.plate_number}</option>
                ))}
              </Form.Control>         
            </Form.Group>
            <Form.Group className='modal-maintenance-formgroup' controlId="vehicleName">
              <Form.Label className='modal-maintenance-label'>Vehicle Name</Form.Label>
                <Form.Control className='modal-maintenance-control' type="text" placeholder="Vehicle Name" value={selectedCarModel} readOnly/>
              </Form.Group>

            <Form.Group className='modal-maintenance-formgroup' controlId="maintenanceType">
              <Form.Label className='modal-maintenance-label'>Maintenance Type</Form.Label>
              <Form.Control as="select" className="modal-maintenance-control" value={maintenanceType} onChange={handleMaintenanceTypeChange}>
                <option value="">Select Maintenance Type</option>
                <option value="Oil Change">Oil Change</option>
                <option value="Tire Rotation">Tire Rotation</option>
                <option value="Brake Inspection">Brake Inspection</option>
                <option value="Engine Check">Engine Check</option>
                <option value="Battery Replacement">Battery Replacement</option>
                <option value="Transmission Service">Transmission Service</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className='modal-maintenance-formgroup' controlId="dueDate">
              <Form.Label className='modal-maintenance-label'>Due Date</Form.Label>
              <Form.Control className='modal-maintenance-control' type="date" value={dueDate} onChange={handleDueDateChange}/>
            </Form.Group>

            <Form.Group className="modal-maintenance-formgroup" controlId="nextDueDate">
              <Form.Label className="modal-maintenance-label">Next Due Date</Form.Label>
              <Form.Control className="modal-maintenance-control" type="date" value={nextDueDate} readOnly />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className='modal-maintenance-close' onClick={handleClose}>
            Close
          </Button>
          <Button className='modal-maintenance-save' onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>




    </div>
  );

}

export default Maintenance;