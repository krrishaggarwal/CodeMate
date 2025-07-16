import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import AppRoutes from './routes';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthContext } from './context/AuthContext';
import { SocketProvider } from './context/socketContext';

const AppContent = () => {
  const location = useLocation();
  const { user } = React.useContext(AuthContext);

  const hideFooterRoutes = ['/dashboard', '/messages', '/edit-profile'];

  return (
    <SocketProvider user={user}>
      <div className="app">
        <Navbar />
        <main>
          <AppRoutes />
        </main>
        {!hideFooterRoutes.includes(location.pathname) && <Footer />}
      </div>
    </SocketProvider>
  );
};

const App = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;
