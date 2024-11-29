import React, { useContext, useEffect, useState } from 'react';

import { Form, Button, Alert, Modal, Container, Row, Col, Table, Spinner } from 'react-bootstrap';

import './Dashboard.css'

import { FaBell, FaSearch, FaUser } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'; // Import required elements
import { Pie } from 'react-chartjs-2';
import user from './../../img/user.png';

import { AuthContext } from './../../settings/AuthContext.js';
import { useNavigate } from 'react-router-dom';


ChartJS.register(ArcElement, Tooltip, Legend); 




function Dashboard() {
  const { user, adminDetails, setAdminDetails } = useContext(AuthContext); // Access user and setAdminDetails from context
  const [error, setError] = useState(null); // For error handling
  const [isLoading, setIsLoading] = useState(true);
  
  const [totalCars, setTotalCars] = useState(0);
  const [available, setAvailable] = useState(0);
  const [rented, setRented] = useState(0);
  const [underMaintenance, setUnderMaintenance] = useState(0);

  const [suv, setSUV] = useState(0);
  const [van, setVan] = useState(0);
  const [sedan, setSedan] = useState(0);

  const [fname, setFname] = useState();
  const [lname, setLname] = useState();

  const [recentBookings, setRecentBookings] = useState([]);


  const fleetstatusdata = {
    labels: ['SUV', 'Van', 'Sedan'],
    datasets: [
      {
        label: 'Fleet Status',
        data: [suv, van, sedan],
        backgroundColor: ['#FF6A18', '#023047', '#FFC8A9'],
        hoverBackgroundColor: ['#FF8B4B', '#014567', '#FFE1D0'],
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'right', // Move the legend to the right side of the chart
        align: 'center',   // Center-align the legend vertically
        labels: {
          usePointStyle: true, // Use circles instead of squares in the legend
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false, // Allows for better control over sizing
  };

  console.log(user.user_id)

  // Fetch admin details based on user id
  useEffect(() => {
    const fetchAdminDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5028/api/Dashboard/get-admin-details?userId=${user.user_id}`);
        if (response.ok) {
          const data = await response.json();
          console.log("Admin Data:", data); // Check if data is logged correctly
          setAdminDetails({ fname: data.firstName, lname: data.lastName, adminId: data.adminId });
          setFname(adminDetails.fname);
          setLname(adminDetails.lname);
        } else {
          setError('Failed to fetch admin details.');
        }
      } catch (error) {
        setError('Error fetching admin details: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminDetails();

    if (user?.user_id) {
      fetchAdminDetails();
    }
  }, [user, setAdminDetails]);

  useEffect(() => {
    const fetchTotalCars = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5028/api/Dashboard/Count'); // Your API to get total cars
        if (response.ok) {
          const data = await response.json();
          setTotalCars(data); // Set the total cars count
          console.log(totalCars);
        } else {
          setError('Failed to fetch total cars.');
        }
      } catch (error) {
        setError('Error fetching total cars: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTotalCars();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const fetchFleetStatus = async () => {
      try {
        const response = await fetch('http://localhost:5028/api/Dashboard/StatusCount'); // Replace with your API endpoint
        if (response.ok) {
          const data = await response.json();
          setAvailable(data.available);  // Assuming the response contains available count
          setRented(data.rented);        // Assuming the response contains rented count
          setUnderMaintenance(data.underMaintenance); // Assuming the response contains under maintenance count
        } else {
          setError('Failed to fetch fleet status.');
        }
      } catch (error) {
        setError('Error fetching fleet status: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchFleetStatus();
  }, []);

  useEffect(() => {
    const fetchCategoryCount = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5028/api/Dashboard/CategoryCount'); // Replace with your API endpoint
        if (response.ok) {
          const data = await response.json();
          setSUV(data.suv);  // Assuming the response contains available count
          setVan(data.van);        // Assuming the response contains rented count
          setSedan(data.sedan); // Assuming the response contains under maintenance count
        } else {
          setError('Failed to fetch fleet status.');
        }
      } catch (error) {
        setError('Error fetching fleet status: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchCategoryCount();
  }, []);

  useEffect(() => {
    const fetchRecentBookings = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5028/api/Dashboard/RecentBookings'); // Replace with your API endpoint
        if (response.ok) {
          const data = await response.json();
          setRecentBookings(data); // Store the fetched data in state
        } else {
          setError('Failed to fetch recent bookings.');
        }
      } catch (error) {
        setError('Error fetching recent bookings: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchRecentBookings();
  }, []);
  

  if (isLoading) {
    return (
      <div className="Dashboard">
        <div className="loading-container">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>Loading Dashboard...</p>
        </div>
      </div>
    );
  }
  


  return (
    <div className="Dashboard">
      <div className='header-dashboard'>
        <div className='header-row'>
          <h1>DASHBOARD</h1>
          <p>Welcome Back, {adminDetails?.fname || "User"}</p>
        </div>
        <div className='header-button'>
          <Button className='user-button'>
            <div className='user-icon'><FaUser /></div> 
            {adminDetails?.fname} {adminDetails?.lname }
          </Button>
        </div>
      </div>

      <div className="dashboard-content">
        <Row className="w-100 m-0 d-flex flex-row flex-grow-1">
          <Col xs={12} md={7} className="left-content p-0 d-flex flex-column">
            <Row className="dashboard-total m-0">
              <Col xs={6} sm={6} md={6} lg={3} className="total-car">
                <div className='total-car-custom'>
                  <h4>TOTAL CARS</h4>
                  <p>{totalCars}</p>
                </div>
              </Col>
              <Col xs={6} sm={6} md={6} lg={3} className="total-car available">
                <div className='total-car-custom'>
                  <h4>AVAILABLE</h4>
                  <p>{available}</p>
                </div>
              </Col>
              <Col xs={6} sm={6} md={6} lg={3} className="total-car undermaintenance">
                <div className='total-car-custom'>
                  <h4>RENTED</h4>
                  <p>{rented}</p>
                </div>
              </Col>
              <Col xs={6} sm={6} md={6} lg={3} className="total-car undermonitoring">
                <div className='total-car-custom'>
                  <h4>UNDER MAINTENANCE</h4>
                  <p>{underMaintenance}</p>
                </div>
              </Col>
            </Row>

            <Row className='location-overview'>
              <h4>LOCATION OVERVIEW</h4>
              <div className='location-overview-custom'>
                <iframe
                  title="Google Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d128041.0482820389!2d120.9842!3d14.5995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33b5b594b0e626c7%3A0xa2c5ebd24e07a68!2zTW5pbGFwYXIsIFBILjAgMDE0MCA3NCcgU0lYJZ2Fv!5e0!3m2!1sen!2sph!4v1642125664995!5m2!1sen!2sph"
                  width="100%"
                  height="100%" 
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
              
            </Row>
          </Col>

          <Col xs={12} md={5} className="right-content p-0 d-flex flex-column">
            <Row className='fleet-status flex-grow-1'>
              <h4>CURRENT VEHICLE CATEGORY</h4>
              <div className="pie-chart-container">
                <Pie data={fleetstatusdata} options={chartOptions} />
              </div>
            </Row>

            <Row className='upcoming-trips'>
              <div>
                <h4 style={{ margin: '0', padding: '0' }}>NOTIFICATIONS</h4>
              </div>
              <div className='upcoming-trips-table '>
                <table className="table">
                  <tbody>
                    <tr className='upcoming-trips-custom-table'>
                      <td>
                        <div className='about'>
                          <h4>Notif 1</h4>
                          <p>Driver: Juan Dela Cruz</p>
                        </div>
                      </td>
                    </tr>
                    <tr className='upcoming-trips-custom-table'>
                      <td className='td-custom'>
                        <div className='about'>
                          <h4>Notif 2</h4>
                          <p>Driver: Juan Dela Cruz</p>
                        </div>
                      </td>
                    </tr>
                    <tr className='upcoming-trips-custom-table'>
                      <td>
                        <div className='about'>
                          <h4>Notif 3</h4>
                          <p>Driver: Juan Dela Cruz</p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Row>
          </Col>

          <Row className='recent-bookings'>
            <h4>RECENT BOOKINGS</h4>
            <div className="recent-bookings-table">
              <table className="table">
                <thead>
                  <tr>
                    <th>Car ID</th>
                    <th>Renter Name</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th className='text-center'>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.length > 0 ? (
                    recentBookings.slice(0, 10).map((booking) => {  // Slice the array to show only the first 10 bookings
                      // Determine rent_status color based on its value
                      let rentStatusColor = '';
                      switch (booking.rent_status) {
                        case 'upcoming':
                          rentStatusColor = 'upcoming'; // Blue
                          break;
                        case 'completed':
                          rentStatusColor = 'completed'; // Green
                          break;
                        case 'canceled':
                          rentStatusColor = 'canceled'; // Red
                          break;
                        default:
                          rentStatusColor = ''; // In case of any other status
                      }

                      return (
                        <tr key={booking.vehicle_id}>
                          <td>{booking.vehicle_id}</td>
                          <td>{booking.renter_fname}</td>
                          <td>{new Date(booking.pickup_date).toLocaleDateString()}</td>
                          <td>{new Date(booking.dropoff_date).toLocaleDateString()}</td>
                          <td className={`text-center ${rentStatusColor}`}>
                            {booking.rent_status.toUpperCase()} {/* Display rent_status in uppercase */}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">No recent bookings available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Row>

        </Row>

      </div>
    </div>
  );
}

export default Dashboard;