import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

/* Components */
import Navbar from './components/Navbar';
import Footer from './components/Footer';

/* Pages */
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

/* Layout Wrapper to conditionally show Navbar/Footer */
const AppLayout = ({ children }) => {
  const location = useLocation();
  // Don't show Navbar/Footer on Dashboard or Login pages for a cleaner app-like feel
  // Or maybe keep Navbar on Login? Usually Dashboard has its own layout.
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isLogin = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {!isDashboard && !isLogin && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!isDashboard && !isLogin && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
