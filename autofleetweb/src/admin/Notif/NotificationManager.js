import React, { useState, useEffect } from 'react';
import * as signalR from "@microsoft/signalr";

function NotificationManager() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Create SignalR connection
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5028/notificationHub")
      .withAutomaticReconnect()
      .build();

    // Start connection
    connection.start()
      .then(() => console.log("SignalR Connected"))
      .catch(err => console.error("Connection failed: ", err));

    // Listen for new notifications
    connection.on("ReceiveNotification", (message) => {
      const newNotification = {
        id: Date.now(),
        message,
        timestamp: new Date(),
        read: false
      };

      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      connection.stop();
    };
  }, []);

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return { 
    notifications, 
    unreadCount, 
    markAsRead 
  };
}

export default NotificationManager;
