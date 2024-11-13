import { useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const RequireAuth = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
      }

      return children;
};

export default RequireAuth;
