import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FoodListingForm from './pages/FoodListingForm';
import NearbyPartners from './pages/NearbyPartners';
import NgoDashboard from './pages/NgoDashboard';
import MyDonations from './pages/MyDonations';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#f8fafc]">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/post-food" element={<FoodListingForm />} />
            <Route path="/partners" element={<NearbyPartners />} />
            <Route path="/browse-food" element={<NgoDashboard />} />
            <Route path="/my-donations" element={<MyDonations />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
