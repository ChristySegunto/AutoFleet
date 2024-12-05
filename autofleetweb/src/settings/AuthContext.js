import { createContext, useContext, useState, useEffect, Children  } from "react";

// Create AuthContext to manage user and admin authentication state
export const AuthContext = createContext();

// AuthProvider component provides authentication context to the app
export const AuthProvider = ({ children }) => {
    // State to store the user data, initialized from localStorage if available
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('authUser'); // Retrieve saved user data from localStorage
        // If savedUser exists, parse it and set as the initial state; otherwise, set default empty object
        return savedUser ? JSON.parse(savedUser) : { email: "", role: "", user_id: "" };
    });

    // State to store admin details, initialized from localStorage if available
    const [adminDetails, setAdminDetails] = useState(() => {
        const savedAdmin = localStorage.getItem('authAdmin'); // Retrieve saved admin details from localStorage
        // If savedAdmin exists, parse it and set as the initial state; otherwise, set as null
        return savedAdmin ? JSON.parse(savedAdmin) : null;
    });


    // useEffect hook to store user and admin details in localStorage whenever they change
    useEffect(() => {
        if (user.email) {
            // If user data is available, store it in localStorage
            localStorage.setItem('authUser', JSON.stringify(user));
        } else {
            // If no user data, remove it from localStorage
            localStorage.removeItem('authUser');
        }

        if (adminDetails) {
            // If admin details are available, store them in localStorage
            localStorage.setItem('authAdmin', JSON.stringify(adminDetails));
        } else {
            // If no admin details, remove them from localStorage
            localStorage.removeItem('authAdmin');
        }
    }, [user]); // Re-run whenever `user` or `adminDetails` state changes

    // Login function to set both user and admin details and update the localStorage
    const login = (userData, adminData) => {
        setUser(userData);        // Set user data
        setAdminDetails(adminData); // Set admin data
    };

    // Logout function to clear both user and admin details and remove them from localStorage
    const logout = () => {
        setUser({ email: "", role: "", user_id: "" }); // Reset user state to empty values
        setAdminDetails({ fname: "", lname: "" }); // Reset admin state to empty values
        localStorage.removeItem('authUser'); // Remove user data from localStorage
        localStorage.removeItem('authAdmin'); // Remove admin data from localStorage
    };

    // Function to check if the user is authenticated
    const isAuthenticated = () => {
        return !!user.email && !!user.role; // Returns true if user has email and role, false otherwise
    };


    // Provide the context value to the app (user, adminDetails, login, logout, isAuthenticated)
    return (
        <AuthContext.Provider value={{ user, adminDetails, setAdminDetails, login, logout, isAuthenticated }}>
            {children} {/* Render children components inside the provider */}
        </AuthContext.Provider>
    )

};

// Custom hook to access authentication context in components
export const useAuth = () => useContext(AuthContext);