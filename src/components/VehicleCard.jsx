import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Gauge, Fuel, Star, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';

export default function VehicleCard({ vehicle, currency, formatPrice }) {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate(`/rent?vehicle=${vehicle.id}`);
  };

  const isAvailable = vehicle.status === 'Available';

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col h-full">
      {/* Image Header with Badges */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-bold border border-slate-200 shadow-xs">
            {vehicle.category}
          </span>
          <span
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold backdrop-blur-md border ${
              isAvailable
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
          >
            {vehicle.status}
          </span>
        </div>

        {/* Location & Rating */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-800">
          <div className="flex items-center gap-1 bg-white/90 px-2 py-0.5 rounded-md backdrop-blur-md border border-slate-200 font-semibold text-[11px]">
            <MapPin className="w-3 h-3 text-slate-600" />
            <span>{vehicle.location}</span>
          </div>
          <div className="flex items-center gap-1 bg-white/90 px-2 py-0.5 rounded-md backdrop-blur-md border border-slate-200 text-[11px]">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span className="font-bold text-slate-900">{vehicle.rating}</span>
            <span className="text-slate-500">({vehicle.reviewsCount})</span>
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-700 transition-colors line-clamp-1">
            {vehicle.name}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {vehicle.description}
          </p>

          {/* Vehicle Specs Grid */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
              <Users className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span>{vehicle.seats} Seats</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
              <Gauge className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span className="truncate">{vehicle.transmission}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
              <Fuel className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span>{vehicle.fuelType}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span className="truncate">{vehicle.mileage}</span>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">Daily Rate</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-slate-900">
                {formatPrice(vehicle.ratePerDay)}
              </span>
              <span className="text-xs text-slate-500 font-medium">/ day</span>
            </div>
          </div>

          <button
            onClick={handleBookNow}
            disabled={!isAvailable}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
              isAvailable
                ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs active:scale-95'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
          >
            <span>{isAvailable ? 'Book' : 'Booked'}</span>
            {isAvailable && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
