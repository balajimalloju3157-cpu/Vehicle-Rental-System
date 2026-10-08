import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VehicleCard from '../components/VehicleCard';
import { VEHICLES_DATA, CITIES } from '../data/vehiclesData';
import { Search, MapPin, Calendar, Car, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Home({ currency, formatPrice }) {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [pickupDate, setPickupDate] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedCity) params.append('city', selectedCity);
    if (selectedType && selectedType !== 'All') params.append('category', selectedType);
    navigate(`/vehicles?${params.toString()}`);
  };

  const featuredVehicles = VEHICLES_DATA.filter((v) => v.featured);

  return (
    <div className="space-y-12 pb-16">
      
      {/* HERO SECTION - Minimal & Professional */}
      <section className="bg-gradient-to-b from-slate-100 via-slate-50 to-white text-slate-900 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 border border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/80 text-slate-800 text-xs font-semibold border border-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
              <span>Professional Vehicle Rental Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Simple, Reliable <br />
              <span className="text-slate-600">Vehicle Rentals</span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
              Choose from verified sedans, SUVs, hatchbacks, and motorcycles. Enjoy transparent daily rates, flexible durations, and instant reservation confirmation.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verified Fleet</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>No Hidden Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Instant Confirmation</span>
              </div>
            </div>
          </div>

          {/* Right Search Box Widget */}
          <div className="lg:col-span-5">
            <form
              onSubmit={handleSearch}
              className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-md space-y-4"
            >
              <div className="pb-2 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Search className="w-4 h-4 text-slate-700" />
                  <span>Search Vehicle Availability</span>
                </h3>
              </div>

              {/* City Selection */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>Pick-Up City</span>
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
                >
                  <option value="">All Pick-Up Locations</option>
                  {CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Car className="w-3.5 h-3.5 text-slate-500" />
                  <span>Vehicle Category</span>
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
                >
                  <option value="All">All Categories (SUVs, Sedans, Bikes)</option>
                  <option value="SUVs">SUVs & Off-roaders</option>
                  <option value="Sedans">Sedans & Executive</option>
                  <option value="Hatchbacks">Hatchbacks & Compact</option>
                  <option value="Luxury">Luxury Vehicles</option>
                  <option value="Bikes & Scooters">Bikes & Scooters</option>
                </select>
              </div>

              {/* Date */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Pick-Up Date</span>
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all shadow-xs flex items-center justify-center gap-2 active:scale-98"
              >
                <Search className="w-4 h-4" />
                <span>Search Vehicles</span>
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* STATS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white border border-slate-200 rounded-2xl shadow-xs text-center">
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">150+</span>
            <p className="text-xs text-slate-500 font-medium">Fleet Vehicles</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">12,400+</span>
            <p className="text-xs text-slate-500 font-medium">Completed Bookings</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">8</span>
            <p className="text-xs text-slate-500 font-medium">Major Cities</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">4.9 / 5</span>
            <p className="text-xs text-slate-500 font-medium">Customer Rating</p>
          </div>
        </div>
      </section>

      {/* FEATURED FLEET */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Featured Vehicles</h2>
            <p className="text-xs text-slate-500">Popular cars and motorbikes available for immediate booking</p>
          </div>
          <button
            onClick={() => navigate('/vehicles')}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all border border-slate-200 flex items-center gap-1.5"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              currency={currency}
              formatPrice={formatPrice}
            />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-10 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">How It Works</h2>
            <p className="text-xs text-slate-500">Simple three-step rental process</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold text-sm flex items-center justify-center">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">Select Vehicle</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Filter our fleet by category, price, capacity, and city location.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold text-sm flex items-center justify-center">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">Configure Reservation</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Choose duration days, add-ons, and see calculated rates instantly.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold text-sm flex items-center justify-center">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">Confirm & Drive</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Confirm booking details synced directly with database log.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
