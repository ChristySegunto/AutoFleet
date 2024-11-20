import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


import Login from './Login/Login.js';
import Sidebar from './components/Sidebar.js';



import { AuthProvider } from './settings/AuthContext.js';
import RequireAuth from './settings/RequireAuth.js';
import ProtectedRoute from './settings/ProtectedRoute.js';

import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from 'react-router-dom';

import Dashboard from './admin/Dashboard/Dashboard.js';
import Vehicles from './admin/Vehicles/Vehicles.js';
import Drivers from './admin/Drivers/Drivers.js';
import Maptracking from './admin/Maptracking/Maptracking.js';
import Settings from './admin/Settings/Settings.js';
import Maintenance from './admin/Maintenance/Maintenance.js';

const router =createBrowserRouter(
  createRoutesFromElements(
    <Route path = "/"  >
      <Route index element={
         <div className='web-container'>
         <Sidebar/>
         <Maptracking/>
       </div>
      }></Route>
      <Route 
        path = "login" 
        element={<Login />}>
      </Route>

      <Route
        path="dashboard"
        element={
          <RequireAuth>
              <div className='web-container'>
                <Sidebar/>
                <Dashboard/>
              </div>
          </RequireAuth>
        }
      />

      <Route
        path="vehicles"
        element={
          <RequireAuth>
              <div className='web-container'>
                <Sidebar/>
                <Vehicles/>
              </div>
          </RequireAuth>
        }
      />

      <Route
        path="drivers"
        element={
          <RequireAuth>
              <div className='web-container'>
                <Sidebar/>
                <Drivers/>
              </div>
          </RequireAuth>
        }
      />

      <Route
        path="maptracking"
        element={
         
              <div className='web-container'>
                <Sidebar/>
                <Maptracking/>
              </div>
          
        }
      />

      <Route
        path="maintenance"
        element={
         
              <div className='web-container'>
                <Sidebar/>
                <Maintenance/>
              </div>
          
        }
      />

      <Route
        path="settings"
        element={
          <RequireAuth>
              <div className='web-container'>
                <Sidebar/>
                <Settings/>
              </div>
          </RequireAuth>
        }
      />

    </Route>
  )
)

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;