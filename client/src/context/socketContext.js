// socketContext.js
import { createContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

export const SocketProvider = ({ children, user }) => {
  const socket = useRef(null);

  useEffect(() => {
    if (!user?.userId) return;

    // ✅ Connect to backend socket server
    socket.current = io('http://localhost:5000', {
      withCredentials: true, // match CORS
    });

    // ✅ Wait for connection before emitting
    socket.current.on('connect', () => {
      console.log('🟢 Socket connected (frontend):', socket.current.id);

      socket.current.emit('join', user._id); // 🔥 Join the room
    });

    // Optional: log disconnect
    socket.current.on('disconnect', () => {
      console.log('🔴 Socket disconnected');
    });

    return () => {
      socket.current.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
