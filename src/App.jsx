import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SectionBanner from './components/SectionBanner';
import Toast from './components/Toast';
import Home from './pages/Home';
import Vehicles from './pages/Vehicles';
import RentalForm from './pages/RentalForm';
import RentalHistory from './pages/RentalHistory';
import ProjectOverview from './pages/ProjectOverview';
import { rentalDb } from './lib/supabase';

export default function App() {
  const [currency, setCurrency] = useState('INR');
  const [darkMode, setDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState('all');
  const [rentalsCount, setRentalsCount] = useState(0);
  const [toast, setToast] = useState(null);

  // Sync rentals count
  const updateRentalsCount = async () => {
    try {
      const res = await rentalDb.getAll();
      setRentalsCount(res.data.length);
    } catch (err) {
      console.error('Count update error:', err);
    }
  };

  useEffect(() => {
    updateRentalsCount();
  }, []);

  // Format price helper (INR ₹ / USD $)
  const formatPrice = (amountInINR) => {
    if (currency === 'USD') {
      const usdAmount = (amountInINR / 83.5).toFixed(1);
      return `$${usdAmount}`;
    }
    return `₹${amountInINR.toLocaleString('en-IN')}`;
  };

  const showToast = (toastMeta) => {
    setToast(toastMeta);
    updateRentalsCount();
  };

  return (
    <Router>
      <div className={`min-h-screen flex flex-col ${darkMode ? 'dark bg-[#090e1a] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
        
        {/* Section Filter Banner for Evaluation - Section 1-5 */}
        <SectionBanner
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        {/* Header Navigation Bar - Section 1 */}
        <Navbar
          currency={currency}
          setCurrency={setCurrency}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          rentalsCount={rentalsCount}
        />

        {/* Main Content View */}
        <main className="flex-1">
          {activeSection === 'all' && (
            <Routes>
              <Route path="/" element={<Home currency={currency} formatPrice={formatPrice} activeSection={activeSection} />} />
              <Route path="/vehicles" element={<Vehicles currency={currency} formatPrice={formatPrice} />} />
              <Route path="/rent" element={<RentalForm currency={currency} formatPrice={formatPrice} onRentalCreated={showToast} />} />
              <Route path="/history" element={<RentalHistory currency={currency} formatPrice={formatPrice} onNotification={showToast} />} />
              <Route path="/overview" element={<ProjectOverview />} />
            </Routes>
          )}

          {activeSection === 'sec1' && (
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 mb-4 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs">
                <strong>Viewing Section 1:</strong> Project Architecture, Header Navigation & React Router DOM navigation menu.
              </div>
              <Routes>
                <Route path="*" element={<Home currency={currency} formatPrice={formatPrice} activeSection={activeSection} />} />
              </Routes>
            </div>
          )}

          {activeSection === 'sec2' && (
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 mb-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                <strong>Viewing Section 2:</strong> Reusable Vehicle Cards, Search Filters, Category Tabs & Inventory.
              </div>
              <Vehicles currency={currency} formatPrice={formatPrice} />
            </div>
          )}

          {activeSection === 'sec3' && (
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 mb-4 p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs">
                <strong>Viewing Section 3:</strong> Interactive Rental Booking Form, Live Rate Breakdown & Protection Add-ons.
              </div>
              <RentalForm currency={currency} formatPrice={formatPrice} onRentalCreated={showToast} />
            </div>
          )}

          {activeSection === 'sec4' && (
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 mb-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                <strong>Viewing Section 4:</strong> Supabase Database Integration, LocalStorage Sync & Rental Log Dashboard.
              </div>
              <RentalHistory currency={currency} formatPrice={formatPrice} onNotification={showToast} />
            </div>
          )}

          {activeSection === 'sec5' && (
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 mb-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                <strong>Viewing Section 5:</strong> Responsive CSS Theme System, Group Section Deliverables & Project Documentation.
              </div>
              <ProjectOverview />
            </div>
          )}
        </main>

        {/* Global Toast Notification */}
        <Toast toast={toast} onClose={() => setToast(null)} />

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}
