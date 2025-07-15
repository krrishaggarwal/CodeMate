import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import AppRoutes from './routes';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const AppContent = () => {
  const location = useLocation();

  // List of routes where footer should not appear
  const hideFooterRoutes = ['/dashboard', '/messages', '/edit-profile'];

  return (
    <div className="app">
      <Navbar />
      <main>
        <AppRoutes />
      </main>
      {!hideFooterRoutes.includes(location.pathname) && <Footer />}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
