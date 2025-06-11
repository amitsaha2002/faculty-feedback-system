import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer'; // Make sure the path is correct
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import Faculty from './pages/Faculty';
import Student from './pages/Student';
import Contact from './pages/Contact';
import Team from './pages/Team';
import AdminDashboard from './pages/AdminDashboard';
import FacultyRegister from './pages/FacultyRegister';
import StudentRegister from './pages/StudentRegister';
import ViewFeedback from './pages/ViewFeedback';
import FacultyList from './pages/FacultyList';
import Feedback from './pages/Feedback';
import FacultyDetails from './pages/FacultyDetails';
import FeedbackForm from './pages/FeedbackForm';

function App() {
  return (
    <Router>
      <AppWithRouter />
    </Router>
  );
}

function AppWithRouter() {
  const location = useLocation();
  const hideFooter =
    location.pathname === '/' ||
    location.pathname === '/admindashboard' ||
    location.pathname === '/facultylist' ||
    location.pathname.startsWith('/feedback/') ||
    location.pathname.startsWith('/feedbackform/') ||
    location.pathname === '/facultydetails' ||
    location.pathname === '/viewfeedback';

  return (
    <>
      <Navbar /> {/* Navbar shows on every route */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/student" element={<Student />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/team" element={<Team />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/facultyregister" element={<FacultyRegister />} />
        <Route path="/studentregister" element={<StudentRegister />} />
        <Route path="/viewfeedback" element={<ViewFeedback />} />
        <Route path="/facultylist" element={<FacultyList />} />
        <Route path="/feedback/:facultyId" element={<Feedback />} />
        <Route path="/facultydetails" element={<FacultyDetails />} />
        <Route path="/feedbackform/:facultyId" element={<FeedbackForm />} />
      </Routes>
      {!hideFooter && <Footer />} {/* Conditional rendering of Footer */}
    </>
  );
}

export default App;
