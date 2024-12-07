import { Navigate } from "react-router-dom"; // Import Navigate to redirect users
import { useAuth } from "./AuthContext"; // Import custom hook to get user authentication data

// ProtectedRoute component ensures only authenticated users with specific roles can access certain routes
const ProtectedRoute = ({ children, role }) => {
    const { user } = useAuth(); // Access user data from the AuthContext

    // If there is no user (not logged in), redirect to login page
    if (!user) {
        return <Navigate to="/login" /> // Redirect to login if user is not authenticated
    }

    // Split the 'role' string by '|' (multiple roles) into an array of allowed roles
    const allowedRoles = role.split('|');

    // If a role is provided and the user's role is not in the allowedRoles array, redirect to login
    if (role && !allowedRoles.includes(user.role)) {
        return <Navigate to= "/login" /> // Redirect to login if the user's role is not allowed
    }

    // If the user is authenticated and has a valid role, render the protected children (content)
    return children; // Display the protected route content
};

export default ProtectedRoute;