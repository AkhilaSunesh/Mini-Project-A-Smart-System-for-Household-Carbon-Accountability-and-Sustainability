import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

/* Components */
import Navbar from './components/Navbar';
import Footer from './components/Footer';

/* Pages */
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BlogPage from './pages/BlogPage';
import BlogArticle from './pages/BlogArticle';

/* Layout Wrapper to conditionally show Navbar/Footer */
const AppLayout = ({ children }) => {
  const location = useLocation();
  // Don't show Navbar/Footer on Dashboard or Login pages for a cleaner app-like feel
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
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogArticle />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
