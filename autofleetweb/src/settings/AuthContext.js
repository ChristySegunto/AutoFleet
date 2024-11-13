import { createContext, useContext, useState, useEffect, Children  } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('authUser');
        return savedUser ? JSON.parse(savedUser) : { email: "", role: "", user_id: "" };
    });

    const [adminDetails, setAdminDetails] = useState(() => {
        const savedAdmin = localStorage.getItem('authAdmin');
        return savedAdmin ? JSON.parse(savedAdmin) : null;
    });


    useEffect(() => {
        if (user.email) {
            localStorage.setItem('authUser', JSON.stringify(user));
        } else {
            localStorage.removeItem('authUser');
        }

        if (adminDetails) {
            localStorage.setItem('authAdmin', JSON.stringify(adminDetails));
        } else {
            localStorage.removeItem('authAdmin');
        }
    }, [user]);

    const login = (userData, adminData) => {
        setUser(userData);        // Set user data
        setAdminDetails(adminData); // Set admin data
    };

    const logout = () => {
        setUser({ email: "", role: "", user_id: "" });
        setAdminDetails({ fname: "", lname: "" });
        localStorage.removeItem('authUser');
        localStorage.removeItem('authAdmin');
    };

    

    const isAuthenticated = () => {
        return !!user.email && !!user.role;
    };


    return (
        <AuthContext.Provider value={{ user, adminDetails, setAdminDetails, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )

};


export const useAuth = () => useContext(AuthContext);