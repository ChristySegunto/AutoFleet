import React, { useState, useEffect } from "react";
import {
    CDBSidebar,
    CDBSidebarContent,
    CDBSidebarFooter,
    CDBSidebarHeader,
    CDBSidebarMenu,
    CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from "../settings/AuthContext";
import './Sidebar.css';

//bootstrap
import { Image } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Sidebar = () => {
    return(
        <div className='sidebar'>
            <CDBSidebar className="custom-sidebar">
            <div className='custom-header'>
                <CDBSidebarHeader prefix={<i className="iconbar-custom fa fa-bars fa-large"></i>}>
                    <a href="/" className="header-logo text-decoration-none">
                        <h1>AutoFleet</h1>
                    </a>
                   
                </CDBSidebarHeader>
            </div>      
    
            <CDBSidebarContent className="sidebar-content">
                <CDBSidebarMenu>
                <NavLink exact to="/dashboard" className={({ isActive }) => (isActive ? "activeClicked" : "")}>
                    <CDBSidebarMenuItem icon="chart-line">Dashboard</CDBSidebarMenuItem>
                </NavLink>
                <NavLink exact to="/vehicles" className={({ isActive }) => (isActive ? "activeClicked" : "")}>
                    <CDBSidebarMenuItem icon="exclamation-triangle">Vehicles</CDBSidebarMenuItem>
                </NavLink>
                <NavLink exact to="/drivers" className={({ isActive }) => (isActive ? "activeClicked" : "")}>
                    <CDBSidebarMenuItem icon="file">Drivers</CDBSidebarMenuItem>
                </NavLink>
                <NavLink exact to="/maptracking" className={({ isActive }) => (isActive ? "activeClicked" : "")}>
                    <CDBSidebarMenuItem icon="cog">Map Tracking</CDBSidebarMenuItem>
                </NavLink>
                <NavLink exact to="/settings" className={({ isActive }) => (isActive ? "activeClicked" : "")}>
                    <CDBSidebarMenuItem icon="cog">Settings</CDBSidebarMenuItem>
                </NavLink>


                </CDBSidebarMenu>
            </CDBSidebarContent>
    
            <CDBSidebarFooter className='sidebar-content-footer'>
                <div className='sidebar-footer'>
                    <div className="divider"></div> 
                    <NavLink exact to="/logout" activeClassName="activeClicked">
                        <CDBSidebarMenuItem icon="door-open" className='custom-footer'>Logout</CDBSidebarMenuItem>
                    </NavLink>
                </div>
            </CDBSidebarFooter>
            </CDBSidebar>
        </div>
    );
};

export default Sidebar;