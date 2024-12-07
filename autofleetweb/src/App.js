import './App.css'; // Importing the custom styles for the application
import 'bootstrap/dist/css/bootstrap.min.css'; // Importing Bootstrap CSS for responsive design and components

// Importing components and pages
import Login from './Login/Login.js'; // Login page component
import Sidebar from './components/Sidebar.js'; // Sidebar component for navigation

// Importing context and route protection components
import { AuthProvider } from './settings/AuthContext.js'; // Auth context provider to manage user state
import RequireAuth from './settings/RequireAuth.js'; // Component that protects routes from unauthenticated access
import ProtectedRoute from './settings/ProtectedRoute.js'; // Protected route handling 

// Importing routing utilities from React Router
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from 'react-router-dom';

// Importing admin pages for routing
import Dashboard from './admin/Dashboard/Dashboard.js';
import Vehicles from './admin/Vehicles/Vehicles.js';
import Drivers from './admin/Drivers/Drivers.js';
import Maptracking from './admin/Maptracking/Maptracking.js';
import Settings from './admin/Settings/Settings.js';
import Maintenance from './admin/Maintenance/Maintenance.js';

// Defining the routes using `createBrowserRouter` and `createRoutesFromElements`
const router =createBrowserRouter(
  createRoutesFromElements(
    <Route path = "/"  >
      {/* Default Route */}
      <Route index element={<Login />}></Route>

      {/* Login Route */}
      <Route 
        path = "login" 
        element={<Login />}>
      </Route>

      {/* Protected Dashboard Route - Only accessible for authenticated users */}
      <Route
        path="dashboard"
        element={
          <RequireAuth> {/* Requires authentication to access */}
              <div className='web-container'>
                <Sidebar/> {/* Sidebar component on the left */}
                <Dashboard/> {/* Main content of the dashboard */}
              </div>
          </RequireAuth>
        }
      />

      {/* Protected Vehicles Route - Only accessible for authenticated users */}
      <Route
        path="vehicles"
        element={
          <RequireAuth>
              <div className='web-container'>
                <Sidebar/>
                <Vehicles/> {/* Vehicles page for the admin */}
              </div>
          </RequireAuth>
        }
      />

      {/* Protected Drivers Route - Only accessible for authenticated users */}
      <Route
        path="drivers"
        element={
          <RequireAuth>
              <div className='web-container'>
                <Sidebar/>
                <Drivers/> {/* Drivers page for the admin */}
              </div>
          </RequireAuth>
        }
      />

      {/* Unprotected Maptracking Route - Accessible by everyone */}
      <Route
        path="maptracking"
        element={
          <div className='web-container'>
            <Sidebar/>
            <Maptracking/> {/* Map tracking page */}
          </div>
        }
      />

      {/* Unprotected Maintenance Route - Accessible by everyone */}

      <Route
        path="maintenance"
        element={
          <div className='web-container'>
            <Sidebar/>
            <Maintenance/>
          </div>
        }
      />

    </Route>
  )
)

function App() {
  return (
    <AuthProvider> {/* Provides authentication context to the entire app */}
      <RouterProvider router={router} /> {/* RouterProvider renders the router, handling the route transitions */}
    </AuthProvider>
  );
}

export default App;