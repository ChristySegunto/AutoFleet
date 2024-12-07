//LOGIN FILE
//React Imports
import React, { useState, useEffect, useContext } from "react";
import './Login.css'
import { useNavigate } from 'react-router-dom'; // Import Redirect from React Router
import { AuthContext } from "../settings/AuthContext";


//Bootstrap
import { Form, Button, Alert, Modal, Container } from 'react-bootstrap';

//Image
import logo from './../img/logo.png';

const Login = () => {
    //Declarations
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // For navigation
    const { login, setAdminDetails } = useContext(AuthContext); //To save or fetch details


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            //Check the login credentials
            const response = await fetch('http://localhost:5028/api/login/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, role }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    // Handle unauthorized status
                    setError('Invalid credentials.'); // Specific message for invalid login
                } else {
                    // For other types of errors, try to get the error message from response
                    const errorData = await response.json();
                    setError(errorData.Message || 'An error occurred. Please try again.');
                }
                return;
            }

            const data = await response.json();
            console.log('Login successful:', data);

            // Check the role and navigate accordingly
            if (data.role === 'admin') {
                login({ 
                    email: data.email, 
                    role: data.role,
                    user_id: data.userId,
                    token: data.token 
                }); 

                alert('Login Successful.') //Display alert
                navigate('/dashboard'); // Navigate to dashboard for admin
            } else {
                setError('You do not have access to this application.'); // Set error for non-admin roles
            }
            

        } catch (error) {
            setError('An error occurred. Please try again.'); // Handle network errors
        }
    }

    return(
        <div className="login">
            <div className="row align-items-center justify-content-center min-vh-100">
                {/* Left Side with Logo and Text */}
                <div className="left-side col-md-5 d-none d-md-block text-center text-white p-5">
                    <div className="logo-section">
                        <img src={logo} alt="AutoFleet Logo" className="logo" />
                        <h1 className="mt-1">AutoFleet</h1>
                        <h4>FLEET MANAGEMENT SYSTEM</h4>
                    </div>
                </div>

                {/* Right Side with Form */}
                <div className="right-side bg-white col-md-4 p-5 rounded shadow">
                    <h2 className="text-center mb-4">LOGIN</h2>

                    {error && <Alert variant="danger">{error}</Alert>} 

                    {/* Login form */}
                    <form onSubmit={handleSubmit}>
                        {/* Email textbox */}
                        <div className="form-group email-form mb-3">
                            <label>Email</label>
                            <input 
                                type="email" 
                                className="form-control" 
                                id="email" 
                                placeholder="Enter email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        </div>

                        {/* Password textbox */}
                        <div className="form-group pass-form mb-3">
                            <label htmlFor="password">Password</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                id="password" 
                                placeholder="Password"
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Submit button */}
                        <div className="d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary w-50 mt-5 mb-3">LOGIN</button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
        
    )
}

export default Login;