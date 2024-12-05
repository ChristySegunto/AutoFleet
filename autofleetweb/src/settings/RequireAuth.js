import { useEffect } from "react"; // Import useEffect hook for side effects
import { useNavigate, Navigate } from "react-router-dom"; // Import necessary routing components
import { useAuth } from "./AuthContext"; // Import custom hook to access authentication data


// RequireAuth component ensures that only authenticated users can access the protected content
const RequireAuth = ({ children }) => {
    const { isAuthenticated } = useAuth(); // Access the isAuthenticated function from AuthContext to check if the user is logged in


    // If the user is not authenticated, redirect to the login page
    if (!isAuthenticated()) {
        return <Navigate to="/login" />; // Redirect to login page if the user is not authenticated
      }

      // If the user is authenticated, render the protected children (content)
      return children; // Display the protected route content for authenticated users
};

export default RequireAuth;
