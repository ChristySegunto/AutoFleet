import React, { useContext, useEffect, useState } from 'react';

//Design
import { Form, Button, Alert, Modal, Container, Row, Col } from 'react-bootstrap';
import { FaBell, FaSearch, FaUser } from 'react-icons/fa';


import { AuthContext } from './../../settings/AuthContext.js';
import { useNavigate } from 'react-router-dom';

import './Maintenance.css'

function Maintenance() {
  const { user, adminDetails, setAdminDetails } = useContext(AuthContext); // Access user and setAdminDetails from context
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);


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
                <th>Vehicle ID</th>
                <th>Vehicle Name</th>
                <th>Maintenance Type</th>
                <th>Due Date</th>
                <th>Next Due Date</th>
                <th className='text-center'>Status</th>
                <th className='text-center'>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>001</td>
                <td>Ford Transit</td>
                <td>Oil Change</td>
                <td>2024-11-20</td>
                <td>2024-11-20</td>
                <td>Pending</td>
                <td><i class="fas fa-trash"></i></td>
              </tr>
              <tr>
                <td>002</td>
                <td>Toyota Hiace</td>
                <td>Brake Inspection</td>
                <td>2024-12-05</td>
                <td>2024-11-20</td>
                <td>Scheduled</td>
                <td><i class="fas fa-trash"></i></td>
              </tr>
              <tr>
                <td>003</td>
                <td>Chevrolet Express</td>
                <td>Tire Rotation</td>
                <td>2024-12-10</td>
                <td>2024-11-20</td>
                <td>Completed</td>
                <td><i class="fas fa-trash"></i></td>
              </tr>
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
              <Form.Label className='modal-maintenance-label'>Vehicle ID</Form.Label>
              <Form.Control className='modal-maintenance-control' type="text" placeholder="Enter Vehicle ID" />
            </Form.Group>

            <Form.Group className='modal-maintenance-formgroup' controlId="vehicleName">
              <Form.Label className='modal-maintenance-label'>Vehicle Name</Form.Label>
              <Form.Control className='modal-maintenance-control' type="text" placeholder="Enter Vehicle Name" />
            </Form.Group>

            <Form.Group className='modal-maintenance-formgroup' controlId="maintenanceType">
              <Form.Label className='modal-maintenance-label'>Maintenance Type</Form.Label>
              <Form.Control className='modal-maintenance-control' type="text" placeholder="Enter Maintenance Type" />
            </Form.Group>

            <Form.Group className='modal-maintenance-formgroup' controlId="dueDate">
              <Form.Label className='modal-maintenance-label'>Due Date</Form.Label>
              <Form.Control className='modal-maintenance-control' type="date" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className='modal-maintenance-close' onClick={handleClose}>
            Close
          </Button>
          <Button className='modal-maintenance-save' onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>




    </div>
  );

}

export default Maintenance;