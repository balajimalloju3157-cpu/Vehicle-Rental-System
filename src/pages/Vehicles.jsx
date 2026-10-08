import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import VehicleCard from '../components/VehicleCard';
import { VEHICLES_DATA, CITIES, CATEGORIES } from '../data/vehiclesData';
import { Search, RefreshCw, Car } from 'lucide-react';

export default function Vehicles({ currency, formatPrice }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get('category') || 'All';
  const initialCity = searchParams.get('city') || '';

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortBy, setSortBy] = useState('recommended');

  const filteredVehicles = useMemo(() => {
    return VEHICLES_DATA.filter((v) => {
      if (activeCategory !== 'All' && v.category !== activeCategory) return false;
      if (selectedCity && v.location.toLowerCase() !== selectedCity.toLowerCase()) return false;
      if (v.ratePerDay > maxPrice) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesName = v.name.toLowerCase().includes(term);
        const matchesBrand = v.brand.toLowerCase().includes(term);
        const matchesType = v.type.toLowerCase().includes(term);
        if (!matchesName && !matchesBrand && !matchesType) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.ratePerDay - b.ratePerDay;
      if (sortBy === 'price-high') return b.ratePerDay - a.ratePerDay;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [activeCategory, selectedCity, maxPrice, searchTerm, sortBy]);

  const resetFilters = () => {
    setSearchTerm('');
    setActiveCategory('All');
    setSelectedCity('');
    setMaxPrice(10000);
    setSortBy('recommended');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Vehicle Inventory</h1>
        <p className="text-slate-500 text-xs mt-1">
          Explore vehicles filtered by category, location, or daily budget
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search vehicle model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900 font-medium"
            />
          </div>

          {/* City Filter */}
          <div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900 font-medium"
            >
              <option value="">All Pick-Up Locations</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900 font-medium"
            >
              <option value="recommended">Sort by: Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rating</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-semibold text-slate-700">
              <span>Max Rate:</span>
              <span className="font-bold text-slate-900">{formatPrice(maxPrice)} / day</span>
            </div>
            <input
              type="range"
              min="800"
              max="10000"
              step="200"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-slate-900 bg-slate-200 rounded-lg cursor-pointer h-1.5"
            />
          </div>

        </div>

        {/* Info & Reset */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-900">{filteredVehicles.length}</strong> of {VEHICLES_DATA.length} vehicles
          </span>

          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-slate-700 hover:text-slate-900 font-bold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Vehicles Grid */}
      {filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              currency={currency}
              formatPrice={formatPrice}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl space-y-3">
          <Car className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Vehicles Match Criteria</h3>
          <p className="text-slate-500 text-xs max-w-sm mx-auto">
            Try adjusting search terms or budget limits to view available vehicles.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
}
