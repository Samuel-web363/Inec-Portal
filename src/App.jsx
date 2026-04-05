import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import RouteGuard from './components/auth/RouteGuard';
import DashboardLayout from './components/layout/DashboardLayout';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Public Pages
import HomePage      from './pages/public/HomePage';
import ResultsPage   from './pages/public/ResultsPage';
import AboutPage     from './pages/public/AboutPage';
import LoginPage     from './pages/public/LoginPage';
import RegisterPage  from './pages/public/RegisterPage';
import NotFound      from './pages/public/NotFound';
import Unauthorized  from './pages/public/Unauthorized';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageResults  from './pages/admin/ManageResults';
import ManageUsers    from './pages/admin/ManageUsers';
import UploadResults  from './pages/admin/UploadResults';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import UserResults   from './pages/user/UserResults';
import ChartsPage    from './pages/user/ChartsPage';
import UserProfile   from './pages/user/UserProfile';

// Layout wrapper for public pages (with Navbar + Footer)
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="colored"
          style={{ zIndex: 99999 }}
        />
        <Routes>
          {/* ── Public Routes ── */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/results"      element={<PublicLayout><ResultsPage /></PublicLayout>} />
          <Route path="/about"        element={<PublicLayout><AboutPage /></PublicLayout>} />
          <Route path="/login"        element={<LoginPage />} />
          <Route path="/register"     element={<RegisterPage />} />
          <Route path="/unauthorized" element={<PublicLayout><Unauthorized /></PublicLayout>} />

          {/* ── Admin Routes (role: admin) ── */}
          <Route element={<RouteGuard allowedRoles={['admin']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/results"   element={<ManageResults />} />
              <Route path="/admin/users"     element={<ManageUsers />} />
              <Route path="/admin/upload"    element={<UploadResults />} />
            </Route>
          </Route>

          {/* ── User Routes (role: user or admin) ── */}
          <Route element={<RouteGuard allowedRoles={['user', 'admin']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/results"   element={<UserResults />} />
              <Route path="/user/charts"    element={<ChartsPage />} />
              <Route path="/user/profile"   element={<UserProfile />} />
            </Route>
          </Route>

          {/* ── 404 ── */}
          <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}