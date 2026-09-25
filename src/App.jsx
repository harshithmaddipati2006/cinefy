import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CityProvider } from "./context/CityContext";
import { WishlistProvider } from "./context/WishlistContext";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import SearchModal from "./components/common/SearchModal";
import AuthModal from "./components/auth/AuthModal";
import CinematicIntro from "./components/animation/CinematicIntro";

import Home from "./pages/Home";
import MoviesCatalog from "./pages/MoviesCatalog";
import MovieDetails from "./pages/MovieDetails";
import TheatreDetails from "./pages/TheatreDetails";
import TheatresExplorer from "./pages/TheatresExplorer";
import SeatSelection from "./pages/SeatSelection";
import Checkout from "./pages/Checkout";
import BookingSuccess from "./pages/BookingSuccess";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Events from "./pages/Events";
import Offers from "./pages/Offers";
import Admin from "./pages/Admin";
import StadiumBookingPage from "./pages/StadiumBookingPage";

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  const handleReplayIntro = () => {
    setShowIntro(true);
  };

  return (
    <AuthProvider>
      <CityProvider>
        <WishlistProvider>
          <Router>
          {showIntro && <CinematicIntro onComplete={handleIntroComplete} />}
          
          <div className="min-h-screen bg-[#050811] text-gray-100 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
            <div>
              <Navbar onOpenSearch={() => setSearchOpen(true)} onReplayIntro={handleReplayIntro} />
              <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
              <AuthModal />
              
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/movies" element={<MoviesCatalog />} />
                  <Route path="/movie/:id" element={<MovieDetails />} />
                  <Route path="/theatres" element={<TheatresExplorer />} />
                  <Route path="/cinemas" element={<TheatresExplorer />} />
                  <Route path="/theatre/:theatreId" element={<TheatresExplorer />} />
                  <Route path="/theatres/:movieId" element={<TheatreDetails />} />
                  <Route path="/seats" element={<SeatSelection />} />
                  <Route path="/seat-selection/:showId" element={<SeatSelection />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/booking-success/:bookingId" element={<BookingSuccess />} />
                  <Route path="/my-bookings" element={<MyBookings />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/login" element={<Login isRegister={false} />} />
                  <Route path="/register" element={<Login isRegister={true} />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/offers" element={<Offers />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/login" element={<Admin />} />
                  <Route path="/admin-login" element={<Admin />} />
                  <Route path="/stadium-booking" element={<StadiumBookingPage />} />
                </Routes>
              </main>
            </div>

            <Footer />
          </div>
        </Router>
        </WishlistProvider>
      </CityProvider>
    </AuthProvider>
  );
}
