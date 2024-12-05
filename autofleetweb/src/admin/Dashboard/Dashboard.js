import React, { useContext, useEffect, useState } from 'react';

import { Form, Button, Alert, Modal, Container, Row, Col, Table, Spinner } from 'react-bootstrap';

import './Dashboard.css'

import { FaBell, FaSearch, FaUser } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'; // Import required elements
import { Pie } from 'react-chartjs-2';
import user from './../../img/user.png';

import { AuthContext } from './../../settings/AuthContext.js';
import { useNavigate } from 'react-router-dom';
import * as signalR from "@microsoft/signalr";
import NotificationManager from './../Notif/NotificationManager';
import ReactMapGL, { Marker } from 'react-map-gl';


ChartJS.register(ArcElement, Tooltip, Legend); 


const MAPBOX_API_KEY = "pk.eyJ1Ijoicm9jaGVsbGVib3JyIiwiYSI6ImNtM29rejZnazA0Z3Mya3NkZ2g4YXd5cnIifQ.4Pso-euXHqkZMUmz7Dpegw";
function Dashboard() {
  const { user, adminDetails, setAdminDetails } = useContext(AuthContext); // Access user and setAdminDetails from context
  const { notifications, unreadCount, markAsRead } = NotificationManager();

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
  const [todaySched, setTodaySched] = useState([]);
  // const { notifications, markNotificationAsRead } = useNotifications();

  const [carUpdates, setCarUpdates] = useState([]);

  const [viewport, setViewport] = useState({
    latitude: 14.5995,  // Center of the map (adjust to your desired location)
    longitude: 120.9842,
    zoom: 10,  // Default zoom level
  });

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5028/api/Dashboard/Reports'); // Replace with your actual API endpoint
        if (response.ok) {
          const data = await response.json();
          console.log("Reports Data:", data); // Check if data is logged correctly
          setCarUpdates(data); // Set report data
        } else {
          setError('Failed to fetch reports.');
        }
      } catch (error) {
        setError('Error fetching reports: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchReports();
  }, []);

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
  
  useEffect(() => {
    const fetchTodaysSchedules = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5028/api/Dashboard/get-today-schedules'); // API endpoint for today's schedules
        if (response.ok) {
          const data = await response.json();
          console.log("API Response Data for Notifications: ", data); // Log the full API response

          // Combine rentalSchedules and maintenanceSchedules into one array
          const combinedSchedules = [
            ...data.rentalSchedules.map(schedule => ({
              ...schedule,
              type: 'Rental', // Add a type field for identification
            })),
            ...data.maintenanceSchedules.map(schedule => ({
              ...schedule,
              type: 'Maintenance', // Add a type field for identification
            }))
          ];

          console.log("Combined Schedules: ", combinedSchedules); // Log the combined schedules before filtering

          setTodaySched(combinedSchedules);

        } else {
          setError('Failed to fetch today\'s schedules.');
        }
      } catch (error) {
        setError('Error fetching today\'s schedules: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchTodaysSchedules();
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
  
  // Function to convert time to 12-hour format
  function convertTo12Hour(time) {
    let [hours, minutes, seconds] = time.split(':');
    let period = 'AM';

    // Convert hours to a number to handle AM/PM logic
    hours = parseInt(hours, 10);

    // Determine the period (AM/PM)
    if (hours === 0) {
      hours = 12; // Midnight case
    } else if (hours === 12) {
      period = 'PM'; // Noon case
    } else if (hours > 12) {
      hours -= 12; // Convert PM hours to 12-hour format
      period = 'PM';
    }

    // Format hours to ensure two digits (e.g., 03 instead of 3)
    hours = hours < 10 ? '0' + hours : hours;

    return `${hours}:${minutes}:${seconds} ${period}`;
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

            {/* <Row className='location-overview'>
              <h4>LOCATION OVERVIEW</h4>
              <div className="map-container">
                <ReactMapGL
                  {...viewport}
                  width="100%"
                  height="100px"
                  mapboxApiAccessToken={MAPBOX_API_KEY}
                  onViewportChange={(nextViewport) => setViewport(nextViewport)}
                >
                  {carUpdates.map((car, index) => (
                    <Marker key={index} latitude={car.latitude} longitude={car.longitude}>
                      <div className="marker">
                        <span>{car.status}</span>
                      </div>
                    </Marker>
                  ))}
                </ReactMapGL>
              </div>
              
            </Row> */}
            <Row className='report-overview'>
              <h4>REPORTS</h4>
              <div className="report-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Renter ID</th>
                      <th>Nature of Issue</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th className='text-center'>Emergency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carUpdates.length > 0 ? (
                      carUpdates
                      .sort((a, b) => new Date(b.date) - new Date(a.date))  // Sorting by date from most recent to oldest
                      .slice(0, 8)
                      .map((report) => {
                        const validDate = new Date(report.date);
                        const formattedDate = validDate instanceof Date && !isNaN(validDate) ? validDate.toLocaleDateString() : 'Invalid Date';

                        const emergencyStatus = report.emergency === 'y' ? 'Yes' : report.emergency === 'n' ? 'No' : '';

                        return (
                          <tr key={report.report_id}>
                            <td>{report.renter_id}</td>
                            <td>{report.nature_of_issue}</td>
                            <td>{formattedDate}</td>
                            <td>{convertTo12Hour(report.time)}</td>
                            <td className='text-center'>{emergencyStatus}</td>
                          </tr>
                        );
                        })
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center" style={{ height: '200px', verticalAlign: 'middle' }}>No reports available.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
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

              <div className='upcoming-trips-container'>
                <div className="scrollable-notifications">
                  {todaySched.length > 0 ? (
                    todaySched.map((notification, index) => (
                      <div key={index} className='upcoming-trip-item'>
                        <div className="notification-header">
                          {notification.type}
                        </div>
                        <div className="notification-details">
                          <p className='name'>
                            <strong>{notification.type === 'Rental' ? notification.renterName : notification.carModel}</strong>
                          </p>
                          <p className='type'>
                            {notification.type === 'Rental' ? 
                              notification.vehicleName :
                              `Maintenance Type: ${notification.maintenanceType}`}
                          </p>
                          <p className='date'>
                            {notification.type === 'Rental' ? 
                              `Pickup: ${new Date(notification.pickupDate).toLocaleString()}` :
                              `Due Date: ${new Date(notification.maintenanceDueDate).toLocaleDateString()}`}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center no-notif">No notifications for today.</div>
                  )}
                </div>
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

        {/* <div className="notification-list">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
              >
                <p>{notification.message}</p>
                <button onClick={() => markAsRead(notification.id)}>Mark as Read</button>
              </div>
            ))
          ) : (
            <p>No new notifications</p>
          )}
        </div> */}

      </div>
    </div>
  );
}

export default Dashboard;